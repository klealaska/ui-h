import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  FeatureFlagTargetQueries,
  QueryDocumentCardSetCounts,
  RetryStrategyService,
  SendLockMessage,
  StartLockHeartbeat,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import {
  FormatterService,
  PageHelperService,
  ToastService,
  XdcService,
} from '@ui-coe/avidcapture/core/util';
import { IndexingHelperService } from '@ui-coe/avidcapture/indexing/util';
import * as actionsMyUploads from '@ui-coe/avidcapture/my-uploads/data-access';
import * as actionsQueue from '@ui-coe/avidcapture/pending/data-access';
import * as actionsRecycleBin from '@ui-coe/avidcapture/recycle-bin/data-access';
import * as actionsResearch from '@ui-coe/avidcapture/research/data-access';
import {
  Activity,
  ActivityTypes,
  AppPages,
  ChangeLog,
  CompositeDocument,
  DocumentLabelKeys,
  EscalationCategoryTypes,
  FieldBase,
  FieldTypes,
  IndexedData,
  IndexedLabel,
  IndexingPageAction,
  InputDataTypes,
  InvoiceTypes,
  SearchBodyRequest,
  SkipDocumentDirection,
  UserPermissions,
} from '@ui-coe/avidcapture/shared/types';
import jwt_decode from 'jwt-decode';
import { DateTime } from 'luxon';
import { EMPTY, Observable, combineLatest, of } from 'rxjs';
import { catchError, filter, mergeMap, retry, take, tap } from 'rxjs/operators';

import {
  LoadPrepProperty,
  LoadPrepSupplier,
  ParseDocumentFormFields,
  SetDueDate,
  SetExistingProperty,
  SetExistingSupplier,
} from '../indexing-document-fields/indexing-document-fields.actions';
import * as utilityActions from '../indexing-utility/indexing-utility.actions';
import * as actions from './indexing-page.actions';
import { IndexingPageStateModel } from './indexing-page.model';
import { IndexingPageSelectors } from './indexing-page.selectors';

const defaults: IndexingPageStateModel = {
  compositeData: null,
  pdfFile: null,
  swappedDocument: null,
  hasNewEscalations: false,
  buyerId: null,
  latestFieldAssociation: null,
  originalCompositeData: null,
  changedLabels: [],
  associatedErrorMessage: null,
  escalation: null,
  startDate: '',
  allowedToUnlockDocument: true,
  associatedLookupFieldValue: null,
  isReadOnly: false,
  updateFontFace: false,
  disableHighlight:
    localStorage.getItem('indexingPage.disableHighlight') === 'undefined'
      ? false
      : JSON.parse(localStorage.getItem('indexingPage.disableHighlight')),
  pageFilters:
    sessionStorage.getItem('indexingPage.pageFilters') != null
      ? JSON.parse(sessionStorage.getItem('indexingPage.pageFilters'))
      : null,
};

@State<IndexingPageStateModel>({
  name: 'indexingPage',
  defaults,
})
@Injectable()
export class IndexingPageState {
  constructor(
    private xdcService: XdcService,
    private toast: ToastService,
    private router: Router,
    private indexingHelperService: IndexingHelperService,
    private retryStrategyService: RetryStrategyService,
    private pageHelperService: PageHelperService,
    private store: Store,
    private formatterService: FormatterService
  ) {}

  @Selector()
  static data(state: IndexingPageStateModel): IndexingPageStateModel {
    return state;
  }

  @Action(actions.InitIndexingPage)
  initIndexingPage(
    { dispatch, getState }: StateContext<IndexingPageStateModel>,
    { documentId }: actions.InitIndexingPage
  ): void {
    if (getState().compositeData == null) {
      dispatch(new actions.QueryUnindexedDocument(documentId));
    }
  }

  @Action(actions.QueryUnindexedDocument)
  queryUnindexedDocument(
    { dispatch, patchState }: StateContext<IndexingPageStateModel>,
    { documentId }: actions.QueryUnindexedDocument
  ): Observable<CompositeDocument> {
    const username = this.store.selectSnapshot(state => state.core.userAccount.preferred_username);

    return this.xdcService.getUnindexedDocument(documentId, username).pipe(
      retry({
        count: 1,
        delay: err =>
          this.retryStrategyService.retryApiCall(of(err), {
            excludedStatusCodes: [401, 404, 409],
            duration: 1000,
          }),
      }),
      tap((document: CompositeDocument) => {
        if (document.userLock.indexer.toLowerCase() !== username.toLowerCase()) {
          const toastMessage = `Invoice ${documentId} was locked by ${document.userLock.indexer}. Please try a different document.`;
          this.toast.warning(toastMessage);
          this.router.navigate([AppPages.Queue]);
        } else {
          this.router.navigate([AppPages.IndexingPage, documentId]);

          const displayIdentifierSearchValues =
            Boolean(
              Number(
                document.indexed.labels.find(
                  lbl =>
                    lbl.label === DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
                )?.value.text
              )
            ) ?? false;

          const buyerId = document.indexed.labels.find(
            (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.BuyerId
          )?.value?.text;

          const originalCompositeData = JSON.parse(JSON.stringify(document));

          patchState({
            compositeData: document,
            hasNewEscalations: false,
            originalCompositeData,
            associatedErrorMessage: null,
            startDate: DateTime.local().toString(),
            allowedToUnlockDocument: true,
            isReadOnly:
              document?.unindexed?.pages?.length === 0 || !document?.unindexed?.pages?.length
                ? true
                : false,
          });

          dispatch([
            new actions.SetBuyerId(buyerId),
            new actions.SetPdfFileValue(),
            new utilityActions.CreateLabelColors(),
            new SendLockMessage(username, documentId, buyerId),
            new StartLockHeartbeat(documentId, buyerId),
            new actions.UpdateLabelsAfterThresholdCheck(),
            new actions.RoundCurrencyValues(),
            new actions.InitialInvoiceTypeLabelValueCheck(),
          ]);

          if (displayIdentifierSearchValues) {
            dispatch([new LoadPrepSupplier(), new LoadPrepProperty()]);
          }
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 409) {
          const currentPage = this.store.selectSnapshot(state => state.core.currentPage);
          const toastMessage = `Invoice is locked. Please try a different document.`;

          patchState({
            allowedToUnlockDocument: false,
          });

          this.toast.warning(toastMessage);
          this.router.navigate([currentPage]);
        }

        if (err.status === 404) {
          const currentPage = this.store.selectSnapshot(state => state.core.currentPage);
          const toastMessage = `We're sorry, but you do not have access to this area of the application.`;

          this.toast.warning(toastMessage);
          this.router.navigate([currentPage]);
        }

        throw err;
      })
    );
  }

  @Action(actions.PutInEscalation)
  putInEscalation(
    { dispatch, getState, setState }: StateContext<IndexingPageStateModel>,
    { indexedDocument, action, documentId }: actions.PutInEscalation
  ): Observable<void> {
    const indexer: string = this.store.selectSnapshot(
      state => state.core.userAccount.preferred_username
    );
    const store = this.store.snapshot();
    const requestBody: SearchBodyRequest =
      this.indexingHelperService.getNextDocumentRequestBody(store);
    const currentPage: string = store.core.currentPage;

    const fileName =
      indexedDocument.labels.find(
        (label: IndexedLabel) => label.label === DocumentLabelKeys.nonLookupLabels.FileName
      )?.value.text ?? '';
    const changeLog = this.indexingHelperService.generateChangeLog(
      indexedDocument,
      getState().changedLabels
    );
    const escalation = getState().escalation;

    this.indexingHelperService.addActivity(
      indexedDocument,
      getState().changedLabels,
      ActivityTypes.Exception,
      indexer,
      escalation,
      getState().startDate,
      changeLog
    );

    indexedDocument.activities.forEach(activity => {
      if (!activity.changeLog) {
        return;
      }

      const newChangeLog = [];
      activity.changeLog.forEach(log => {
        if (log.current) {
          newChangeLog.push(log);
        }
      });
      activity.changeLog = newChangeLog;
    });

    return this.xdcService.putEscalation(indexedDocument).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(() => {
        dispatch([new UnlockDocument(documentId), new utilityActions.UpdateAllQueueCounts()]);

        setState({
          ...defaults,
          changedLabels: [],
        });

        if (escalation.category.issue === EscalationCategoryTypes.Void) {
          this.indexingHelperService.handleDocSwapSubmission(fileName);

          this.router.navigate([currentPage]);
        } else if (escalation.category.issue === EscalationCategoryTypes.RecycleBin) {
          this.indexingHelperService.handleSaveSubmitSuccess(IndexingPageAction.Delete, fileName);
          dispatch(
            new actions.GetNextDocument(documentId, requestBody, EscalationCategoryTypes.RecycleBin)
          );
        } else {
          this.indexingHelperService.handleSaveSubmitSuccess(action, fileName);
          dispatch(new actions.GetNextDocument(documentId, requestBody, ''));
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.indexingHelperService.handleSaveSubmitError(action);
        throw err;
      })
    );
  }

  @Action(actions.SaveIndexedDocument)
  saveIndexedDocument(
    { getState, patchState }: StateContext<IndexingPageStateModel>,
    { indexedDocument, action, redirectQueue }: actions.SaveIndexedDocument
  ): Observable<IndexedData> {
    const indexer: string = this.store.selectSnapshot(
      state => state.core.userAccount.preferred_username
    );
    const fileName =
      indexedDocument.labels.find(
        (label: IndexedLabel) => label.label === DocumentLabelKeys.nonLookupLabels.FileName
      )?.value.text ?? '';
    const changeLog = this.indexingHelperService.generateChangeLog(
      indexedDocument,
      getState().changedLabels
    );

    this.indexingHelperService.addActivity(
      indexedDocument,
      getState().changedLabels,
      ActivityTypes.Save,
      indexer,
      getState().escalation,
      getState().startDate,
      changeLog
    );

    return this.xdcService.putIndexed(indexedDocument).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(() => {
        this.indexingHelperService.handleSaveSubmitSuccess(action, fileName);

        if (redirectQueue) {
          patchState({
            ...defaults,
          });
          this.router.navigate([AppPages.Queue]);
        } else {
          patchState({
            changedLabels: [],
          });
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.indexingHelperService.handleSaveSubmitError(action);
        throw err;
      })
    );
  }

  @Action(actions.SubmitIndexedDocument)
  submitIndexedDocument(
    { getState, dispatch, setState }: StateContext<IndexingPageStateModel>,
    { indexedDocument, action, documentId }: actions.SubmitIndexedDocument
  ): Observable<void> {
    const indexer: string = this.store.selectSnapshot(
      state => state.core.userAccount.preferred_username
    );
    const fileName =
      indexedDocument.labels.find(
        (label: IndexedLabel) => label.label === DocumentLabelKeys.nonLookupLabels.FileName
      )?.value.text ?? '';
    const changeLog: ChangeLog[] = this.indexingHelperService.generateChangeLog(
      indexedDocument,
      getState().changedLabels
    );

    this.indexingHelperService.addActivity(
      indexedDocument,
      getState().changedLabels,
      ActivityTypes.Submit,
      indexer,
      getState().escalation,
      getState().startDate,
      changeLog
    );

    indexedDocument.activities.forEach(activity => {
      if (!activity.changeLog) {
        return;
      }

      const newChangeLog = [];
      activity.changeLog.forEach(log => {
        if (log.current) {
          newChangeLog.push(log);
        }
      });
      activity.changeLog = newChangeLog;
    });

    return this.xdcService.putIndexedSubmit(indexedDocument).pipe(
      retry({
        count: 1,
        delay: err =>
          this.retryStrategyService.retryApiCall(of(err), {
            excludedStatusCodes: [401, 406, 404, 0],
            excludedStatusCodesToastMessage: [400],
            duration: 1000,
          }),
      }),
      tap(() => {
        const store = this.store.snapshot();
        const requestBody: SearchBodyRequest =
          this.indexingHelperService.getNextDocumentRequestBody(store);

        dispatch([
          new UnlockDocument(documentId),
          new utilityActions.EnableSubmitButton(true),
          new utilityActions.UpdateAllQueueCounts(),
        ]);

        setState({
          ...defaults,
          changedLabels: [],
        });

        dispatch(new actions.GetNextDocument(documentId, requestBody, ActivityTypes.Submit));

        this.indexingHelperService.handleSaveSubmitSuccess(action, fileName);
      }),
      catchError((err: HttpErrorResponse) => {
        indexedDocument.activities.pop();

        if (err.status === 406) {
          dispatch([
            new actions.AddAutoFormatActivity(indexedDocument, err.error),
            new utilityActions.SetDuplicateDocumentId(err.error),
          ]);
        } else if (err.status === 400) {
          this.toast.warning(`Missing Fields: ${err.error.split(':')[1].trim()}`);
        } else {
          this.indexingHelperService.handleSaveSubmitError(action);
        }

        dispatch(new utilityActions.EnableSubmitButton(true));
        throw err;
      })
    );
  }

  @Action(actions.SetEscalation)
  setEscalation(
    { dispatch, getState, patchState }: StateContext<IndexingPageStateModel>,
    { escalation }: actions.SetEscalation
  ): Observable<IndexedLabel[]> {
    const isAccountCreatedEscalation = escalation.category.issue === ActivityTypes.CreateNewAccount;

    const hasNewEscalations =
      getState().compositeData.indexed.activities.filter(act => act.escalation === escalation) &&
      !isAccountCreatedEscalation;

    patchState({ escalation });

    if (isAccountCreatedEscalation) {
      return;
    } else {
      const fields = this.indexingHelperService.getFieldsToRemove(
        escalation.category.issue,
        getState().compositeData.indexed.labels
      );
      if (fields.length > 0) {
        const compositeData$ = this.store.select(
          state => state.indexingPage.compositeData.indexed.labels
        );

        fields.forEach(field => {
          dispatch(
            new actions.UpdateOnManualIntervention({
              value: '',
              key: field,
            } as FieldBase<string>)
          );
        });
        return compositeData$.pipe(
          tap(labels => {
            const invoiceNumber = labels.find(
              lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceNumber
            ).value.text;
            const invoiceAmount = labels.find(
              lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceAmount
            ).value.text;
            if (invoiceNumber === '' && invoiceAmount === '') {
              dispatch(new utilityActions.HandleEscalationSubmission(hasNewEscalations));
            }
          })
        );
      } else {
        dispatch(new utilityActions.HandleEscalationSubmission(hasNewEscalations));
      }
    }
  }

  @Action(actions.AddCompositeDataActivity)
  addCompositeDataActivity(
    { getState, patchState }: StateContext<IndexingPageStateModel>,
    { activity }: actions.AddCompositeDataActivity
  ): void {
    patchState({
      ...getState(),
      compositeData: {
        ...getState().compositeData,
        indexed: {
          ...getState().compositeData.indexed,
          activities: [...getState().compositeData.indexed.activities, activity],
        },
      },
    });
  }

  @Action(actions.RemoveCustomerAccountActivity)
  removeCustomerAccountActivity({
    getState,
    patchState,
  }: StateContext<IndexingPageStateModel>): void {
    const activities = getState().compositeData.indexed.activities;
    const customerAccountIndex = activities.findIndex(
      activity =>
        activity.activity === ActivityTypes.CreateNewAccount &&
        activity.startDate === getState().startDate
    );

    if (customerAccountIndex > -1) {
      activities.splice(customerAccountIndex);
    }

    patchState({
      ...getState(),
      compositeData: {
        ...getState().compositeData,
        indexed: {
          ...getState().compositeData.indexed,
          activities,
        },
      },
    });
  }

  @Action(actions.UpdateOnLookupFieldAssociation)
  updateOnLookupFieldAssociation(
    { dispatch, getState, patchState }: StateContext<IndexingPageStateModel>,
    { indexedLabel }: actions.UpdateOnLookupFieldAssociation
  ): void {
    const foundLabel = this.indexingHelperService.getIndexedLabel(
      getState().compositeData.indexed.labels,
      indexedLabel.label
    );
    const updatedLabel: IndexedLabel = JSON.parse(JSON.stringify(indexedLabel));

    updatedLabel.value.text = '';
    updatedLabel.value.boundingBox = indexedLabel.value.boundingBox;

    patchState({
      latestFieldAssociation: {
        field: indexedLabel.label,
        value: indexedLabel.value.text,
      },
    });

    dispatch([
      new actions.UpdateChangedLabels(foundLabel),
      new actions.UpdateCompositeDataLabel(updatedLabel),
    ]);
  }

  @Action(actions.UpdateOnNonLookupFieldAssociation)
  updateOnNonLookupFieldAssociation(
    { dispatch, getState, patchState }: StateContext<IndexingPageStateModel>,
    { indexedLabel }: actions.UpdateOnNonLookupFieldAssociation
  ): void {
    let message = '';
    const labels = getState().compositeData.indexed.labels;
    const foundLabel = this.indexingHelperService.getIndexedLabel(labels, indexedLabel.label);
    const updatedLabel: IndexedLabel = JSON.parse(JSON.stringify(indexedLabel));
    const existingLabel = labels.find(lbl => lbl.label === updatedLabel.label);

    updatedLabel.value.text = indexedLabel.value.text;
    updatedLabel.value.confidence = indexedLabel.value.text ? 1 : 0;

    if (!indexedLabel.value.text && indexedLabel.value.type === InputDataTypes.Date) {
      message = 'Date must be greater than 1970.';
    } else if (!indexedLabel.value.text) {
      message = 'Invalid text selected.';
    }

    patchState({
      latestFieldAssociation: {
        field: indexedLabel.label,
        value: indexedLabel.value.text,
      },
      associatedErrorMessage: {
        message: indexedLabel.value.text ? '' : message,
        label: indexedLabel.value.text ? '' : indexedLabel.label,
      },
    });

    if (existingLabel) {
      dispatch([
        new actions.UpdateChangedLabels(foundLabel),
        new actions.UpdateCompositeDataLabel(updatedLabel),
      ]);
    } else {
      dispatch([
        new actions.UpdateChangedLabels(foundLabel),
        new actions.AddCompositeDataLabel(updatedLabel),
      ]);
    }

    if (indexedLabel.label === DocumentLabelKeys.nonLookupLabels.InvoiceDate) {
      dispatch(new SetDueDate());
    }
  }

  @Action(actions.UpdateOnManualIntervention)
  updateOnManualIntervention(
    { dispatch, getState, patchState }: StateContext<IndexingPageStateModel>,
    { formValue }: actions.UpdateOnManualIntervention
  ): void {
    const token = this.store.selectSnapshot(state => state.core.token);
    const isSponsorUser = jwt_decode(token)[UserPermissions.SponsorUser] ? true : false;

    formValue.value = this.formatterService.getSanitizedFieldValue(
      formValue,
      formValue.value,
      isSponsorUser
    );
    const labels = getState().compositeData.indexed.labels;
    const indexedLabel = this.indexingHelperService.getIndexedLabel(labels, formValue.key);
    const updatedLabel: IndexedLabel = JSON.parse(JSON.stringify(indexedLabel));
    const existingLabel = labels.find(lbl => lbl.label === updatedLabel.label);

    updatedLabel.value.text = formValue.value;
    updatedLabel.value.confidence = 1;
    updatedLabel.value.type = formValue.type;

    if (
      getState().associatedLookupFieldValue === null &&
      updatedLabel.label !== DocumentLabelKeys.lookupLabels.ShipToAddress &&
      updatedLabel.label !== DocumentLabelKeys.lookupLabels.SupplierAddress
    ) {
      updatedLabel.value.boundingBox = [];
    }

    patchState({
      associatedErrorMessage: null,
      associatedLookupFieldValue: null,
    });

    if (existingLabel) {
      dispatch([
        new actions.UpdateChangedLabels(indexedLabel),
        new actions.UpdateCompositeDataLabel(updatedLabel),
      ]);
    } else {
      dispatch([
        new actions.UpdateChangedLabels(indexedLabel),
        new actions.AddCompositeDataLabel(updatedLabel),
      ]);
    }
  }

  @Action(actions.UpdateCompositeDataLabel)
  updateCompositeDataLabel(
    { getState, patchState }: StateContext<IndexingPageStateModel>,
    { indexedLabel }: actions.UpdateCompositeDataLabel
  ): void {
    const labelIndex: number = getState().compositeData.indexed.labels.findIndex(
      lbl => lbl.label === indexedLabel.label
    );

    patchState({
      ...getState(),
      compositeData: {
        ...getState().compositeData,
        indexed: {
          ...getState().compositeData.indexed,
          labels: [
            ...getState().compositeData.indexed.labels.slice(0, labelIndex),
            Object.assign({}, getState().compositeData.indexed.labels[labelIndex], indexedLabel),
            ...getState().compositeData.indexed.labels.slice(labelIndex + 1),
          ],
        },
      },
    });
  }

  @Action(actions.AddCompositeDataLabel)
  addCompositeDataLabel(
    { getState, patchState }: StateContext<IndexingPageStateModel>,
    { indexedLabel }: actions.AddCompositeDataLabel
  ): void {
    patchState({
      ...getState(),
      compositeData: {
        ...getState().compositeData,
        indexed: {
          ...getState().compositeData.indexed,
          labels: [...getState().compositeData.indexed.labels, indexedLabel],
        },
      },
    });
  }

  @Action(actions.UpdateChangedLabels)
  updateChangedLabels(
    { getState, patchState }: StateContext<IndexingPageStateModel>,
    { changedLabel }: actions.UpdateChangedLabels
  ): void {
    if (
      !getState().originalCompositeData.indexed.labels.find(lbl => lbl.label === changedLabel.label)
    ) {
      patchState({
        ...getState(),
        originalCompositeData: {
          ...getState().originalCompositeData,
          indexed: {
            ...getState().originalCompositeData.indexed,
            labels: [...getState().originalCompositeData.indexed.labels, changedLabel],
          },
        },
      });
    }

    patchState({
      changedLabels: this.indexingHelperService.updateChangedLabels(
        changedLabel.label,
        getState().originalCompositeData.indexed,
        getState().changedLabels
      ),
    });
  }

  @Action(actions.QueryNextDocument)
  queryNextDocument(
    { dispatch }: StateContext<IndexingPageStateModel>,
    { requestBody }: actions.QueryNextDocument
  ): Observable<CompositeDocument> {
    const store = this.store.snapshot();
    const username = store.core.userAccount.preferred_username;

    return this.xdcService.getNextUnindexedDocument(username, requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((document: CompositeDocument) => {
        dispatch(new actions.HandleNextDocumentGiven(document));
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.indexingHelperService.handleNoMoreInvoices();
        }

        switch (store.core.currentPage) {
          case AppPages.Queue:
            this.router.navigate([AppPages.Queue]);
            break;
          case AppPages.Research:
            this.router.navigate([AppPages.Research]);
            break;
          case AppPages.RecycleBin:
            this.router.navigate([AppPages.RecycleBin]);
            break;
          default:
            this.router.navigate([AppPages.Queue]);
            break;
        }
        throw err;
      })
    );
  }

  @Action(actions.SkipDocument, { cancelUncompleted: true })
  skipDocument(
    { dispatch, setState }: StateContext<IndexingPageStateModel>,
    { docId, index }: actions.SkipDocument
  ): Observable<CompositeDocument> {
    const store = this.store.snapshot();
    const storeSnapShot = this.store.selectSnapshot(state => state);
    const currentPage = store.core.currentPage;
    const username = store.core.userAccount.preferred_username;

    if (currentPage) {
      const dataPage = this.indexingHelperService.getPageData(storeSnapShot, currentPage);
      if (dataPage && dataPage.invoices) {
        const currentIndex: number = dataPage.invoices.findIndex(inv => inv.documentId === docId);
        const newIndex = currentIndex + index;
        if (dataPage.invoices[newIndex]) {
          return this.xdcService
            .getUnindexedDocument(dataPage.invoices[newIndex].documentId, username)
            .pipe(
              tap((document: CompositeDocument) => {
                if (document.userLock.indexer.toLowerCase() !== username.toLowerCase()) {
                  dispatch(new actions.SkipDocument(dataPage.invoices[newIndex].documentId, index));
                  return;
                } else {
                  setState({
                    ...defaults,
                    changedLabels: [],
                    disableHighlight: JSON.parse(
                      localStorage.getItem('indexingPage.disableHighlight')
                    ),
                    isReadOnly:
                      document?.unindexed?.pages?.length === 0 ||
                      !document?.unindexed?.pages?.length
                        ? true
                        : false,
                  });
                  dispatch([
                    new actions.HandleNextDocumentGiven(document),
                    new UnlockDocument(dataPage.invoices[currentIndex].documentId),
                  ]);
                  return;
                }
              }),
              catchError((err: HttpErrorResponse) => {
                if (err.status === 409) {
                  dispatch(new actions.SkipDocument(dataPage.invoices[newIndex].documentId, index));
                }

                throw err;
              })
            );
        } else {
          if (dataPage.invoices.length < dataPage.invoicesPageCount && newIndex > -1) {
            switch (currentPage) {
              case AppPages.Queue:
                dispatch(new actionsQueue.QueryQueueInvoices());
                break;
              case AppPages.UploadsQueue:
                dispatch(new actionsMyUploads.QueryUploadedInvoices());
                break;
              case AppPages.Research:
                dispatch(new actionsResearch.QueryResearchInvoices());
                break;
              case AppPages.RecycleBin:
                dispatch(new actionsRecycleBin.QueryRecycleBinDocuments());
                break;
            }

            setTimeout(() => {
              dispatch(new actions.SkipDocument(dataPage.invoices[currentIndex].documentId, index));
            }, 200);

            return;
          } else {
            this.indexingHelperService.handleNoMoreInvoices();
            return;
          }
        }
      }
    }
    dispatch(
      index > 0 ? new actions.SkipToNextDocument(docId) : new actions.SkipToPreviousDocument(docId)
    );
  }

  @Action(actions.GetNextDocument, { cancelUncompleted: true })
  getNextDocument(
    { dispatch }: StateContext<IndexingPageStateModel>,
    { documentId, requestBody, action }: actions.GetNextDocument
  ): Observable<CompositeDocument> {
    const store = this.store.snapshot();
    const storeSnapShot = this.store.selectSnapshot(state => state);
    const currentPage = store.core.currentPage;
    const username = store.core.userAccount.preferred_username;
    const dataPage = this.indexingHelperService.getPageData(storeSnapShot, currentPage);

    if (dataPage) {
      const currentIndex: number = dataPage.invoices.findIndex(
        inv => inv.documentId === documentId
      );
      const newIndex =
        currentIndex + 1 == dataPage.invoicesPageCount ? currentIndex - 1 : currentIndex + 1;

      if (dataPage.invoices[newIndex]) {
        return this.xdcService
          .getUnindexedDocument(dataPage.invoices[newIndex].documentId, username)
          .pipe(
            tap((document: CompositeDocument) => {
              if (document.userLock.indexer.toLowerCase() !== username.toLowerCase()) {
                dispatch(
                  new actions.GetNextDocument(
                    dataPage.invoices[newIndex].documentId,
                    requestBody,
                    action
                  )
                );
                return EMPTY;
              } else {
                dispatch(new actions.HandleNextDocumentGiven(document));
                if (
                  action === EscalationCategoryTypes.RecycleBin ||
                  action === ActivityTypes.Submit
                ) {
                  switch (currentPage) {
                    case AppPages.Queue:
                      dispatch(new actionsQueue.UpdateQueueOnInvoiceSubmit(documentId));
                      break;
                    case AppPages.UploadsQueue:
                      dispatch(new actionsMyUploads.UpdateMyUploadsInvoiceSubmit(documentId));
                      break;
                    case AppPages.Research:
                      dispatch(new actionsResearch.UpdateResearchQueueOnInvoiceSubmit(documentId));
                      break;
                    case AppPages.RecycleBin:
                      dispatch(
                        new actionsRecycleBin.UpdateRecycleBinQueueOnInvoiceSubmit(documentId)
                      );
                      break;
                  }
                }
                return EMPTY;
              }
            }),
            catchError((err: HttpErrorResponse) => {
              if (err.status === 409) {
                dispatch(
                  new actions.GetNextDocument(
                    dataPage.invoices[newIndex].documentId,
                    requestBody,
                    action
                  )
                );
              }
              throw err;
            })
          );
      } else {
        if (dataPage.invoices.length === 0) {
          this.router.navigate([currentPage]);
          return EMPTY;
        }

        if (dataPage.invoices.length < dataPage.invoicesPageCount && newIndex > -1) {
          switch (currentPage) {
            case AppPages.Queue:
              dispatch(new actionsQueue.QueryQueueInvoices());
              break;
            case AppPages.UploadsQueue:
              dispatch(new actionsMyUploads.QueryUploadedInvoices());
              break;
            case AppPages.Research:
              dispatch(new actionsResearch.QueryResearchInvoices());
              break;
            case AppPages.RecycleBin:
              dispatch(new actionsRecycleBin.QueryRecycleBinDocuments());
              break;
          }
          setTimeout(() => {
            dispatch(
              new actions.GetNextDocument(
                dataPage.invoices[currentIndex].documentId,
                requestBody,
                action
              )
            );
          }, 200);

          return EMPTY;
        } else {
          this.indexingHelperService.handleNoMoreInvoices();
          this.router.navigate([currentPage]);
          return EMPTY;
        }
      }
    }
    dispatch(new actions.QueryNextDocument(requestBody));
  }

  @Action(actions.SkipToPreviousDocument, { cancelUncompleted: true })
  skipToPreviousDocument(
    { dispatch, setState }: StateContext<IndexingPageStateModel>,
    { docId }: actions.SkipToPreviousDocument
  ): Observable<CompositeDocument> {
    const store = this.store.snapshot();
    const username = store.core.userAccount.preferred_username;
    const requestBody: SearchBodyRequest =
      this.indexingHelperService.getNextDocumentRequestBody(store);

    return this.xdcService
      .getSkipUnindexedDocument(username, docId, SkipDocumentDirection.Previous, requestBody)
      .pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap((document: CompositeDocument) => {
          setState({
            ...defaults,
            changedLabels: [],
            disableHighlight: JSON.parse(localStorage.getItem('indexingPage.disableHighlight')),
            isReadOnly:
              document?.unindexed?.pages?.length === 0 || !document?.unindexed?.pages?.length
                ? true
                : false,
          });
          dispatch([new actions.HandleNextDocumentGiven(document), new UnlockDocument(docId)]);
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.indexingHelperService.handleNoMoreInvoices();
          }
          throw err;
        })
      );
  }

  @Action(actions.SkipToNextDocument, { cancelUncompleted: true })
  skipToNextDocument(
    { dispatch, setState }: StateContext<IndexingPageStateModel>,
    { docId }: actions.SkipToNextDocument
  ): Observable<CompositeDocument> {
    const store = this.store.snapshot();
    const username = store.core.userAccount.preferred_username;
    const requestBody: SearchBodyRequest =
      this.indexingHelperService.getNextDocumentRequestBody(store);

    return this.xdcService
      .getSkipUnindexedDocument(username, docId, SkipDocumentDirection.Next, requestBody)
      .pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap((document: CompositeDocument) => {
          setState({
            ...defaults,
            changedLabels: [],
            disableHighlight: JSON.parse(localStorage.getItem('indexingPage.disableHighlight')),
            isReadOnly:
              document?.unindexed?.pages?.length === 0 || !document?.unindexed?.pages?.length
                ? true
                : false,
          });
          dispatch([new actions.HandleNextDocumentGiven(document), new UnlockDocument(docId)]);
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.indexingHelperService.handleNoMoreInvoices();
          }
          throw err;
        })
      );
  }

  @Action(actions.SetBuyerId)
  setBuyerId(
    { patchState }: StateContext<IndexingPageStateModel>,
    { buyerId }: actions.SetBuyerId
  ): void {
    patchState({ buyerId: Number(buyerId) });
  }

  @Action(actions.RoundCurrencyValues)
  roundCurrencyValues({ patchState, getState }: StateContext<IndexingPageStateModel>): void {
    const compositeData = getState().compositeData;
    const invoiceAmount = compositeData.indexed.labels.find(
      (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceAmount
    )?.value?.text;
    const prevousBalance = compositeData.indexed.labels.find(
      (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.PreviousBalance
    )?.value?.text;

    if (invoiceAmount) {
      compositeData.indexed.labels.find(
        (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceAmount
      ).value.text = this.formatterService.getCurrencyDouble(invoiceAmount);
    }

    if (prevousBalance) {
      compositeData.indexed.labels.find(
        (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.PreviousBalance
      ).value.text = this.formatterService.getCurrencyDouble(prevousBalance);
    }

    invoiceAmount || prevousBalance ? patchState({ compositeData }) : null;
  }

  @Action(actions.RemoveLatestFieldAssociation)
  removeLatestFieldAssociation({ patchState }: StateContext<IndexingPageStateModel>): void {
    patchState({ latestFieldAssociation: null });
  }

  @Action(actions.SetPdfFileValue)
  setPdfFileValue({ getState, patchState }: StateContext<IndexingPageStateModel>): void {
    const token = this.store.selectSnapshot(state => state.core.token);
    const documentId = getState().compositeData.indexed.documentId;

    patchState({
      pdfFile: this.pageHelperService.getPdfFileRequest(documentId, token),
    });
  }

  @Action(actions.SetPdfSecret)
  setPdfPassword(
    { getState, patchState }: StateContext<IndexingPageStateModel>,
    { secret }: actions.SetPdfSecret
  ): void {
    patchState({
      pdfFile: {
        ...getState().pdfFile,
        password: secret,
      },
      isReadOnly: true,
    });
  }

  @Action(actions.UpdateLookupFieldAssociationValue)
  updateLookupFieldAssociationValue(
    { patchState }: StateContext<IndexingPageStateModel>,
    { field }: actions.UpdateLookupFieldAssociationValue
  ): void {
    patchState({
      associatedLookupFieldValue: field,
    });
  }

  @Action(actions.ResetIndexingState)
  resetIndexingState({ setState }: StateContext<IndexingPageStateModel>): void {
    sessionStorage.setItem('indexingPage.pageFilters', null);
    defaults.pageFilters = null;

    setState({
      ...defaults,
      changedLabels: [],
    });
  }

  @Action(actions.UpdateLabelsAfterThresholdCheck)
  updateLabelsAfterThresholdCheck({
    dispatch,
    getState,
    patchState,
  }: StateContext<IndexingPageStateModel>): Observable<void> {
    const supplierPredictionIsActive$ = this.store.selectOnce(
      FeatureFlagTargetQueries.supplierPredictionIsActive
    );
    const fields$ = this.store.select(state => state.indexingDocumentFields?.formFields || []);
    const token = this.store.selectSnapshot(state => state.core.token);
    const isSponsorUser = jwt_decode(token)[UserPermissions.SponsorUser] ? true : false;
    const hasEscalation$ = this.store.select(IndexingPageSelectors.activityToDisplay);

    return combineLatest([fields$, hasEscalation$, supplierPredictionIsActive$]).pipe(
      filter(([fields]) => fields.length !== 0),
      tap(
        ([fields, hasEscalation, supplierPredictionIsActive]: [
          FieldBase<string>[],
          Activity,
          boolean
        ]) => {
          const updatedLabels = this.indexingHelperService.updateLabelValueUponThresholdCheck(
            getState().compositeData.indexed.labels,
            fields,
            isSponsorUser,
            hasEscalation != null,
            supplierPredictionIsActive
          );

          patchState({
            ...getState(),
            compositeData: {
              ...getState().compositeData,
              indexed: {
                ...getState().compositeData.indexed,
                labels: updatedLabels,
              },
            },
          });
        }
      ),
      mergeMap(() => dispatch([new ParseDocumentFormFields(), new actions.EnableQueueSockets()])),
      take(1)
    );
  }

  @Action(actions.UpdateSupplierAddressLabel)
  updateSupplierAddressLabel(
    { dispatch, getState }: StateContext<IndexingPageStateModel>,
    { supplierAddressFormValue, boundingBoxCoordinates }: actions.UpdateSupplierAddressLabel
  ): void {
    const labels = getState().compositeData.indexed.labels;
    const supplierAddressLabel = labels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.SupplierAddress
    );

    if (!supplierAddressLabel) {
      return;
    }

    supplierAddressLabel.value.text = supplierAddressFormValue.value;
    supplierAddressLabel.value.confidence = 1;
    supplierAddressLabel.value.boundingBox = boundingBoxCoordinates;

    dispatch([
      new actions.UpdateChangedLabels(supplierAddressLabel),
      new actions.UpdateCompositeDataLabel(supplierAddressLabel),
    ]);
  }

  @Action(actions.UpdateShipToAddressLabel)
  updateShipToAddressLabel(
    { dispatch, getState }: StateContext<IndexingPageStateModel>,
    { shipToAddressFormValue, boundingBoxCoordinates }: actions.UpdateShipToAddressLabel
  ): void {
    const labels = getState().compositeData.indexed.labels;
    const shipToAddressLabel = labels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.ShipToAddress
    );

    if (!shipToAddressLabel) {
      return;
    }

    shipToAddressLabel.value.text = shipToAddressFormValue.value;
    shipToAddressLabel.value.confidence = 1;
    shipToAddressLabel.value.boundingBox = boundingBoxCoordinates;

    dispatch(new actions.UpdateCompositeDataLabel(shipToAddressLabel));
  }

  @Action(actions.AddAutoFormatActivity)
  addAutoFormatActivity(
    { getState }: StateContext<IndexingPageStateModel>,
    { indexedDocument, error }: actions.AddAutoFormatActivity
  ): void {
    const duplicateDetectionError = error;
    const invoiceLabel = indexedDocument.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceNumber
    );

    // This should only add when it is a trimmed or auto formatted invoice number
    if (!invoiceLabel || !invoiceLabel.value || error.reason.indexOf('number') < 0) {
      return;
    }

    invoiceLabel.value.text = duplicateDetectionError.invoiceNumber;

    this.indexingHelperService.addActivity(
      indexedDocument,
      [invoiceLabel],
      ActivityTypes.Update,
      'System',
      null,
      getState().startDate,
      this.indexingHelperService.generateChangeLog(indexedDocument, [invoiceLabel])
    );
  }

  @Action(actions.UpdateSwappedDocument)
  updateSwappedDocument(
    { getState, setState }: StateContext<IndexingPageStateModel>,
    { indexedDocument }: actions.UpdateSwappedDocument
  ): void {
    const token = this.store.selectSnapshot(state => state.core.token);

    setState({
      ...getState(),
      compositeData: {
        ...getState().compositeData,
        indexed: indexedDocument,
      },
      swappedDocument: this.pageHelperService.getPdfFileRequest(indexedDocument.documentId, token),
    });
  }

  @Action(actions.HandleNextDocumentGiven)
  handleNextDocumentGiven(
    { dispatch, patchState }: StateContext<IndexingPageStateModel>,
    { document }: actions.HandleNextDocumentGiven
  ): void {
    const coreStore = this.store.selectSnapshot(state => state.core);
    const buyerId = document.indexed.labels.find(
      (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.BuyerId
    )?.value?.text;

    const originalCompositeData = JSON.parse(JSON.stringify(document));

    patchState({
      compositeData: document,
      pdfFile: this.pageHelperService.getPdfFileRequest(
        document.indexed.documentId,
        coreStore.token
      ),
      hasNewEscalations: false,
      originalCompositeData,
      associatedErrorMessage: null,
      startDate: DateTime.local().toString(),
    });

    this.router.navigate([AppPages.IndexingPage, document.indexed.documentId]);
    dispatch([
      new QueryDocumentCardSetCounts(),
      new actions.SetBuyerId(buyerId),
      new actions.SetPdfFileValue(),
      new SendLockMessage(
        coreStore.userAccount.preferred_username,
        document.indexed.documentId,
        buyerId
      ),
      new StartLockHeartbeat(document.unindexed.documentId, buyerId),
      new actions.UpdateLabelsAfterThresholdCheck(),
      new SetExistingProperty(),
      new SetExistingSupplier(),
      new actions.InitialInvoiceTypeLabelValueCheck(),
    ]);
  }

  @Action(actions.UpdateFontFace)
  updateFontFace(
    { patchState }: StateContext<IndexingPageStateModel>,
    { updateFontFace }: actions.UpdateFontFace
  ): void {
    patchState({ updateFontFace });
  }

  @Action(actions.DisableHighlight)
  disableHighlight(
    { patchState }: StateContext<IndexingPageStateModel>,
    { disableHighlight }: actions.DisableHighlight
  ): void {
    patchState({ disableHighlight });
  }

  @Action(actions.StorePageFilters)
  storePageFilters(
    { patchState }: StateContext<IndexingPageStateModel>,
    { pageFilters }: actions.StorePageFilters
  ): void {
    sessionStorage.setItem('indexingPage.pageFilters', JSON.stringify(pageFilters));
    defaults.pageFilters = pageFilters;

    patchState({ pageFilters });
  }

  @Action(actions.InitialInvoiceTypeLabelValueCheck)
  initialInvoiceTypeLabelValueCheck({
    dispatch,
    getState,
  }: StateContext<IndexingPageStateModel>): void {
    const invoiceTypeLabel = getState().compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
    );

    if (invoiceTypeLabel) {
      if (!invoiceTypeLabel.value.text) {
        invoiceTypeLabel.value.text = InvoiceTypes.Standard;
        invoiceTypeLabel.value.confidence = 1;

        dispatch(new actions.UpdateCompositeDataLabel(invoiceTypeLabel));
      }
    } else {
      const newLabel = {
        id: '00000000-0000-0000-0000-000000000000',
        label: DocumentLabelKeys.nonLookupLabels.InvoiceType,
        page: 0,
        value: {
          boundingBox: [],
          confidence: 1,
          incomplete: false,
          incompleteReason: null,
          required: false,
          text: InvoiceTypes.Standard,
          type: FieldTypes.String,
          verificationState: 'NotRequired',
        },
      };

      dispatch(new actions.AddCompositeDataLabel(newLabel));
    }
  }

  @Action(actions.EnableQueueSockets)
  enableQueueSockets({ dispatch }: StateContext<IndexingPageStateModel>): void {
    const currentPage = this.store.selectSnapshot(state => state.core.currentPage);

    switch (currentPage) {
      case AppPages.Queue:
        dispatch(new actionsQueue.SetPendingPageSignalEvents());
        break;
      case AppPages.Research:
        dispatch(new actionsResearch.SetResearchPageSignalEvents());
        break;
      case AppPages.RecycleBin:
        dispatch(new actionsRecycleBin.SetRecycleBinPageSignalEvents());
        break;
      default:
        return;
    }
  }
}
