import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  RetryStrategyService,
  SocketService,
  UpdatePendingQueueCount,
  UpdateRecycleBinQueueCount,
  UpdateResearchQueueCount,
  UpdateUploadsQueueCount,
} from '@ui-coe/avidcapture/core/data-access';
import {
  BuyerKeywordService,
  DocumentSearchHelperService,
  FormatterService,
  InvoiceIngestionService,
  PageHelperService,
  ToastService,
  XdcService,
} from '@ui-coe/avidcapture/core/util';
import { IndexingHelperService, LookupApiService } from '@ui-coe/avidcapture/indexing/util';
import {
  Activity,
  ActivityTypes,
  CompositeDocument,
  DocumentLabelKeys,
  Escalation,
  EscalationLevelTypes,
  IndexedData,
  IndexedLabel,
  IndexingPageAction,
  LookupCustomerAccountResponse,
  RejectToSenderTemplate,
  UserPermissions,
} from '@ui-coe/avidcapture/shared/types';
import { documentLabelColors } from '@ui-coe/avidcapture/shared/util';
import jwt_decode from 'jwt-decode';
import { DateTime } from 'luxon';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { UpdateFormattedFields } from '../indexing-document-fields/indexing-document-fields.actions';
import * as pageActions from '../indexing-page/indexing-page.actions';
import * as actions from './indexing-utility.actions';
import { IndexingUtilityStateModel } from './indexing-utility.model';
import { UpdateQueueInvoiceOnUnlock } from '@ui-coe/avidcapture/shared/data-access';

const defaults: IndexingUtilityStateModel = {
  labelColors: documentLabelColors,
  customerAccountExists: false,
  selectedDocumentText: null,
  duplicateDetectionError: null,
  oldBoundingBoxCoordinates: [],
  rejectToSenderTemplates: [],
  duplicateIndexedData: undefined,
  canSubmit: true,
};

@State<IndexingUtilityStateModel>({
  name: 'indexingUtility',
  defaults,
})
@Injectable()
export class IndexingUtilityState {
  constructor(
    private xdcService: XdcService,
    private toast: ToastService,
    private indexingHelperService: IndexingHelperService,
    private retryStrategyService: RetryStrategyService,
    private socketService: SocketService,
    private lookupApiService: LookupApiService,
    private formatterService: FormatterService,
    private store: Store,
    private documentSearchHelperService: DocumentSearchHelperService,
    private pageHelperService: PageHelperService,
    private bkwsService: BuyerKeywordService,
    private invoiceIngestionService: InvoiceIngestionService
  ) {}

  @Selector()
  static data(state: IndexingUtilityStateModel): IndexingUtilityStateModel {
    return state;
  }

  @Action(actions.LockDocument)
  lockDocument(
    _: StateContext<IndexingUtilityStateModel>,
    { documentId }: actions.LockDocument
  ): Observable<void> {
    return this.xdcService.lockDocument(documentId).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.CreateLabelColors)
  createLabelColors({ patchState }: StateContext<IndexingUtilityStateModel>): void {
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const labelColors = this.indexingHelperService.createLabelColors(compositeData.indexed);

    patchState({ labelColors });
  }

  @Action(actions.HandleEscalationSubmission)
  handleEscalationSubmission(
    { dispatch }: StateContext<IndexingUtilityStateModel>,
    { hasNewEscalations }: actions.HandleEscalationSubmission
  ): void {
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);

    if (hasNewEscalations) {
      dispatch(
        new pageActions.PutInEscalation(
          compositeData.indexed,
          IndexingPageAction.Save,
          compositeData.indexed.documentId
        )
      );
    } else {
      dispatch(
        new pageActions.SaveIndexedDocument(compositeData.indexed, IndexingPageAction.Save, true)
      );
    }
  }

  @Action(actions.CreateCustomerAccountActivity)
  createCustomerAccountActivity(
    { dispatch }: StateContext<IndexingUtilityStateModel>,
    { customerAccount }: actions.CreateCustomerAccountActivity
  ): void {
    const document: CompositeDocument = this.store.selectSnapshot(
      state => state.indexingPage.compositeData
    );
    const indexer: string = this.store.selectSnapshot(
      state => state.core.userAccount.preferred_username
    );
    const startDate: string = this.store.selectSnapshot(state => state.indexingPage.startDate);
    const termsLabel = document.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.Terms
    );

    const endDate = DateTime.local().toString();

    const activityOrdinal = Number(document.indexed.activities.length) + 1;
    const escalation: Escalation = {
      category: {
        issue: ActivityTypes.CreateNewAccount,
        reason: '',
      },
      description: ActivityTypes.CreateNewAccount,
      escalationLevel: EscalationLevelTypes.CustomerFacing,
      resolution: '',
    };
    const activity: Activity = {
      ordinal: activityOrdinal,
      startDate,
      endDate,
      indexer,
      activity: ActivityTypes.CreateNewAccount,
      changeLog: null,
      description: '',
      escalation,
      labels: [
        this.indexingHelperService.getActivityLabel(
          DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          document.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
          ).value.text,
          document.indexed
        ),
        termsLabel
          ? this.indexingHelperService.getActivityLabel(
              DocumentLabelKeys.nonLookupLabels.Terms,
              termsLabel.value.text,
              document.indexed
            )
          : {
              id: '00000000-0000-0000-0000-000000000000',
              label: DocumentLabelKeys.nonLookupLabels.Terms,
              page: 0,
              value: {
                text: '',
                confidence: 1,
                boundingBox: [],
                required: false,
                incomplete: false,
                incompleteReason: null,
                type: 'string',
                verificationState: 'NotRequired',
              },
            },
      ],
    };

    if (termsLabel) {
      termsLabel.value.text = customerAccount.paymentTerms;
    }

    dispatch([
      new pageActions.SetEscalation(escalation),
      new pageActions.AddCompositeDataActivity(activity),
      termsLabel
        ? new pageActions.UpdateCompositeDataLabel(termsLabel)
        : new actions.CreateIndexedLabel(
            DocumentLabelKeys.nonLookupLabels.Terms,
            customerAccount.paymentTerms
          ),
    ]);
  }

  @Action(actions.CreateIndexedLabel)
  createIndexedLabel(
    { dispatch }: StateContext<IndexingUtilityStateModel>,
    { label, labelValue }: actions.CreateIndexedLabel
  ): void {
    const newLabel = {
      id: '00000000-0000-0000-0000-000000000000',
      label,
      page: 0,
      value: {
        boundingBox: [],
        confidence: 1,
        incomplete: false,
        incompleteReason: null,
        required: false,
        text: labelValue,
        type: 'string',
        verificationState: 'NotRequired',
      },
    };

    dispatch([
      new pageActions.AddCompositeDataLabel(newLabel),
      new pageActions.UpdateChangedLabels(newLabel),
    ]);
  }

  @Action(actions.ConfirmNewAccount)
  confirmNewAccount(
    { patchState }: StateContext<IndexingUtilityStateModel>,
    { accountNumber }: actions.ConfirmNewAccount
  ): Observable<LookupCustomerAccountResponse> {
    const supplierId = this.store.selectSnapshot(
      state => state.indexingDocumentFields.selectedSupplier?.vendorID
    );
    return this.lookupApiService.getCustomerAccounts(accountNumber, supplierId, true).pipe(
      tap((response: LookupCustomerAccountResponse) =>
        patchState({
          customerAccountExists: response.records.length > 0 ? true : false,
        })
      ),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.UpdateSelectedDocumentText)
  updateSelectedDocumentText(
    { patchState }: StateContext<IndexingUtilityStateModel>,
    { selectedDocumentText }: actions.UpdateSelectedDocumentText
  ): void {
    patchState({
      selectedDocumentText,
    });
  }

  @Action(actions.SanitizeFieldValue)
  sanitizeFieldValue(
    { dispatch, getState, patchState }: StateContext<IndexingUtilityStateModel>,
    { field, isLookupField }: actions.SanitizeFieldValue
  ): void {
    const labels = this.store.selectSnapshot(
      store => store.indexingPage.compositeData.indexed.labels
    );
    const foundLabel: IndexedLabel = labels.find(lbl => lbl.label === field.key) ?? null;
    const selectedText = getState().selectedDocumentText;
    const oldBoundingBoxCoordinates: number[] = selectedText.value.boundingBox;
    const token = this.store.selectSnapshot(state => state.core.token);
    const isSponsorUser = jwt_decode(token)[UserPermissions.SponsorUser] ? true : false;

    if (foundLabel) {
      selectedText.id = foundLabel.id;
      selectedText.label = foundLabel.label;
      selectedText.value.type = foundLabel.value.type;
    } else {
      selectedText.label = field.key;
      selectedText.value.type = field.type;
    }
    selectedText.value.text = this.formatterService.getSanitizedFieldValue(
      field,
      selectedText.value.text,
      isSponsorUser
    );

    if (field.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber) {
      selectedText.value.text = this.formatterService.handleMaxFieldLength(
        selectedText.value.text,
        50
      );
    }

    field.value = selectedText.value.text;

    patchState({
      selectedDocumentText: null,
    });

    dispatch([
      isLookupField
        ? new pageActions.UpdateOnLookupFieldAssociation(selectedText)
        : new pageActions.UpdateOnNonLookupFieldAssociation(selectedText),
      new actions.UpdateOldBoundingBoxCoordinates(oldBoundingBoxCoordinates),
      new UpdateFormattedFields(field),
    ]);
  }

  @Action(actions.SetDuplicateDocumentId)
  setDuplicateDocumentId(
    { patchState }: StateContext<IndexingUtilityStateModel>,
    { duplicateDetectionError }: actions.SetDuplicateDocumentId
  ): void {
    patchState({
      duplicateDetectionError,
    });
  }

  @Action(actions.UpdateAdditionalLookupValue)
  updateAdditionalLookupValue(
    { dispatch }: StateContext<IndexingUtilityStateModel>,
    { label, lookupValue, labelName }: actions.UpdateAdditionalLookupValue
  ): void {
    if (label) {
      label.value.text = lookupValue;
      label.value.confidence = 1;

      dispatch([
        new pageActions.UpdateCompositeDataLabel(label),
        new pageActions.UpdateChangedLabels(label),
      ]);
    } else {
      dispatch(new actions.CreateIndexedLabel(labelName, lookupValue));
    }
  }

  @Action(actions.UpdateOldBoundingBoxCoordinates)
  updateOldBoundingBoxCoordinates(
    { patchState }: StateContext<IndexingUtilityStateModel>,
    { coordinates }: actions.UpdateOldBoundingBoxCoordinates
  ): void {
    patchState({
      oldBoundingBoxCoordinates: coordinates,
    });
  }

  @Action(actions.QueryRejectToSenderTemplates)
  queryRejectToSenderTemplates(
    { patchState }: StateContext<IndexingUtilityStateModel>,
    { buyerId }: actions.QueryRejectToSenderTemplates
  ): Observable<RejectToSenderTemplate[]> {
    return this.bkwsService.postRejectToSenderTemplates(buyerId).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(rejectToSenderTemplates => patchState({ rejectToSenderTemplates })),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.CheckForDuplicateDocument)
  checkForDuplicateDocument({
    patchState,
  }: StateContext<IndexingUtilityStateModel>): Observable<CompositeDocument> {
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const duplicateDocumentId = this.indexingHelperService.getDuplicateDocumentId(
      compositeData.indexed.activities
    );

    if (!duplicateDocumentId) {
      patchState({ duplicateIndexedData: null });
      return EMPTY;
    }

    return this.xdcService.getArchivedDocument(duplicateDocumentId).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(archivedDocument => patchState({ duplicateIndexedData: archivedDocument.indexed })),
      catchError((err: HttpErrorResponse) => {
        patchState({ duplicateIndexedData: null });
        throw err;
      })
    );
  }

  @Action(actions.PostRejectToSender)
  postRejectToSender(
    _: StateContext<IndexingUtilityStateModel>,
    { payload }: actions.PostRejectToSender
  ): Observable<void> {
    return this.bkwsService.postRejectToSender(payload).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(() => this.toast.success('Email submitted successfully to recipient.')),
      catchError((err: HttpErrorResponse) => {
        this.toast.error(
          'Email submission failed. Please try submitting your email again. Contact support if the problem persists.'
        );
        throw err;
      })
    );
  }

  @Action(actions.CreateRejectToSenderTemplate)
  createRejectToSenderTemplate(
    { getState, patchState }: StateContext<IndexingUtilityStateModel>,
    { payload }: actions.CreateRejectToSenderTemplate
  ): Observable<number> {
    return this.bkwsService.postRejectToSenderCreate(payload).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(templateId => {
        patchState({
          rejectToSenderTemplates: [
            ...getState().rejectToSenderTemplates,
            { ...payload, templateId: templateId.toString() },
          ],
        });

        this.toast.success('Template added.');
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.EditRejectToSenderTemplate)
  editRejectToSenderTemplate(
    { getState, patchState }: StateContext<IndexingUtilityStateModel>,
    { payload }: actions.EditRejectToSenderTemplate
  ): Observable<void> {
    return this.bkwsService.postRejectToSenderEdit(payload).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(() => {
        const templateIndex: number = getState().rejectToSenderTemplates.findIndex(
          temp => temp.templateId === payload.templateId
        );

        patchState({
          ...getState(),
          rejectToSenderTemplates: [
            ...getState().rejectToSenderTemplates.slice(0, templateIndex),
            payload,
            ...getState().rejectToSenderTemplates.slice(templateIndex + 1),
          ],
        });

        this.toast.success('Template saved.');
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.DeleteRejectToSenderTemplate)
  deleteRejectToSenderTemplate(
    { getState, patchState }: StateContext<IndexingUtilityStateModel>,
    { templateId }: actions.DeleteRejectToSenderTemplate
  ): Observable<void> {
    return this.bkwsService.postRejectToSenderDelete(templateId).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(() => {
        patchState({
          rejectToSenderTemplates: getState().rejectToSenderTemplates.filter(
            temp => temp.templateId !== templateId
          ),
        });

        this.toast.success('Template deleted.');
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.EnableSubmitButton)
  enableSubmitButton(
    { patchState }: StateContext<IndexingUtilityStateModel>,
    { canSubmit }: actions.EnableSubmitButton
  ): void {
    patchState({ canSubmit });
  }

  @Action(actions.SwapDocument)
  swapDocument(
    { dispatch }: StateContext<IndexingUtilityStateModel>,
    { file, organizationId }: actions.SwapDocument
  ): Observable<IndexedData> {
    const sourceEmail = this.store.selectSnapshot(
      state => state.core.userAccount.preferred_username
    );
    const compositeData: CompositeDocument = this.store.selectSnapshot(
      state => state.indexingPage.compositeData
    );

    return this.invoiceIngestionService
      .swapInvoice(file, organizationId, sourceEmail, compositeData.indexed)
      .pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap(res => dispatch(new pageActions.UpdateSwappedDocument(res))),
        catchError(err => {
          throw err;
        })
      );
  }

  @Action(actions.UpdateAllQueueCounts)
  updateAllQueueCounts({ dispatch }: StateContext<IndexingUtilityStateModel>): void {
    dispatch([
      new UpdatePendingQueueCount(),
      new UpdateUploadsQueueCount(),
      new UpdateResearchQueueCount(),
      new UpdateRecycleBinQueueCount(),
    ]);
  }
}
