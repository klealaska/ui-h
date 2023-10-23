import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import {
  AddMenuOptions,
  ClaimsQueries,
  CoreSelectors,
  FeatureFlagTargetQueries,
  RefreshToken,
  RemoveMenuOptions,
  SetCurrentPage,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import { IdleService, ToastService, XdcService } from '@ui-coe/avidcapture/core/util';
import {
  CheckForDuplicateDocument,
  DisableHighlight,
  EnableSubmitButton,
  IndexingDocumentFieldsSelectors,
  IndexingPageSelectors,
  IndexingUtilitySelectors,
  InitIndexingPage,
  LockDocument,
  PostRejectToSender,
  PutInEscalation,
  QueryRejectToSenderTemplates,
  ResetIndexingState,
  SaveIndexedDocument,
  SetEscalation,
  SetPdfFileValue,
  SetPdfSecret,
  SkipDocument,
  SubmitIndexedDocument,
  SwapDocument,
  UpdateFontFace,
  UpdateSelectedDocumentText,
} from '@ui-coe/avidcapture/indexing/data-access';
import {
  DocumentSwapComponent,
  EscalationSelectionComponent,
  RejectToSenderComponent,
} from '@ui-coe/avidcapture/indexing/ui';
import { HotkeysService, IndexingHelperService } from '@ui-coe/avidcapture/indexing/util';
import { RemovePendingPageSignalEvents } from '@ui-coe/avidcapture/pending/data-access';
import { RemoveRecycleBinPageSignalEvents } from '@ui-coe/avidcapture/recycle-bin/data-access';
import { RemoveResearchPageSignalEvents } from '@ui-coe/avidcapture/research/data-access';
import {
  Activity,
  CompositeDocument,
  DocumentLabelKeys,
  DuplicateDetectionError,
  Environment,
  Escalation,
  EscalationCategoryTypes,
  EscalationLevelTypes,
  FieldBase,
  IndexedData,
  IndexedLabel,
  IndexingPageAction,
  LabelColor,
  MoreActions,
  PdfJsRequest,
  RejectToSenderPayload,
  RejectToSenderTemplate,
  UserMenuOptions,
} from '@ui-coe/avidcapture/shared/types';
import { ConfirmComponent, PdfPasswordComponent } from '@ui-coe/avidcapture/shared/ui';
import {
  dataExceptionIssueTypes,
  imageIssueTypes,
  internalEscalationChoices,
  invoiceTypeChoices,
  recycleIssueTypes,
  scanningOpsQcTypes,
} from '@ui-coe/avidcapture/shared/util';
import { DropdownOptions } from '@ui-coe/shared/types';
import { MenuOption } from '@ui-coe/shared/ui';
import { DateTime } from 'luxon';
import { Observable, Subject, Subscription, combineLatest } from 'rxjs';
import { filter, mergeMap, take, takeUntil, tap } from 'rxjs/operators';

import { DuplicateDetectionComponent } from '../../modals/duplicate-detection/duplicate-detection.component';
import { RejectToSenderCrudComponent } from '../../modals/reject-to-sender-crud/reject-to-sender-crud.component';
import { DocumentFieldsComponent } from '../document-fields/document-fields.component';

@Component({
  selector: 'xdc-indexing-page',
  templateUrl: './indexing-page.component.html',
  styleUrls: ['./indexing-page.component.scss'],
})
export class IndexingPageComponent implements OnInit, OnDestroy {
  @Select(IndexingPageSelectors.compositeData)
  compositeData$: Observable<CompositeDocument>;
  @Select(IndexingPageSelectors.pdfFile) pdfFile$: Observable<PdfJsRequest>;
  @Select(IndexingPageSelectors.hasNewEscalations)
  hasNewEscalations$: Observable<boolean>;
  @Select(IndexingPageSelectors.buyerName) buyerName$: Observable<string>;
  @Select(IndexingPageSelectors.hasActivities) hasActivities$: Observable<boolean>;
  @Select(IndexingPageSelectors.markAsChoices) markAsChoices$: Observable<MenuOption[]>;
  @Select(IndexingPageSelectors.isSwappedDocument) isSwappedDocument$: Observable<boolean>;
  @Select(IndexingPageSelectors.isReadOnly) isReadOnly$: Observable<boolean>;
  @Select(IndexingPageSelectors.swappedDocument) swappedDocument$: Observable<PdfJsRequest>;
  @Select(IndexingPageSelectors.updateFontFace) updateFontFace$: Observable<boolean>;
  @Select(IndexingPageSelectors.disableHighlight) disableHighlight$: Observable<boolean>;
  @Select(IndexingPageSelectors.hasChangedLabels) hasChangedLabels$: Observable<boolean>;
  @Select(IndexingPageSelectors.activityToDisplay) activityToDisplay$: Observable<Activity>;
  @Select(IndexingPageSelectors.saveInvoiceIsActive) saveInvoiceIsActive$: Observable<boolean>;
  @Select(IndexingPageSelectors.moreActionsIsActive) moreActionsIsActive$: Observable<boolean>;

  @Select(IndexingDocumentFieldsSelectors.isLookupLoading) isLookupLoading$: Observable<boolean>;
  @Select(IndexingDocumentFieldsSelectors.formGroupInstance)
  formGroupInstance$: Observable<UntypedFormGroup>;
  @Select(IndexingDocumentFieldsSelectors.fields) fields$: Observable<FieldBase<string>[]>;
  @Select(IndexingDocumentFieldsSelectors.formFields) formFields$: Observable<FieldBase<string>[]>;
  @Select(IndexingDocumentFieldsSelectors.utilityFields) utilityFields$: string[];

  @Select(IndexingUtilitySelectors.labelColors) labelColors$: Observable<LabelColor[]>;
  @Select(IndexingUtilitySelectors.duplicateDetectionError)
  duplicateDetectionError$: Observable<DuplicateDetectionError>;
  @Select(IndexingUtilitySelectors.canSubmit) canSubmit$: Observable<boolean>;

  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.isLoading) isLoading$: Observable<boolean>;
  @Select(ClaimsQueries.canDownloadPdf) canDownloadPdf$: Observable<boolean>;
  @Select(ClaimsQueries.canSwapImage) canSwapImage$: Observable<boolean>;
  @Select(ClaimsQueries.canCreateAccount) canCreateAccount$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAllBuyers) canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.canViewGetNextDocument) canViewGetNextDocument$: Observable<boolean>;
  @Select(ClaimsQueries.canRecycleDocument) canRecycleDocument$: Observable<boolean>;
  @Select(ClaimsQueries.canRejectToSender) canRejectToSender$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.multipleDisplayThresholdsIsActive)
  multipleDisplayThresholdsIsActive$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.supplierPredictionIsActive)
  supplierPredictionIsActive$: Observable<boolean>;

  @ViewChild('fields', { static: false }) fields: DocumentFieldsComponent;

  idleTimeoutToWarning = 240; // Seconds until timeout warning box pops up
  labelColors: LabelColor[] = [];
  invoiceTypeOptions = invoiceTypeChoices;
  tooltipText = '';
  fieldToHighlight = '';
  boundingBoxCoordinatesToHighlight = '';
  maxUnindexedPages = 1;
  notifications = [];

  private subscriptions: Subscription[] = [];
  private readonly unsubscribeSubject$ = new Subject<void>();

  constructor(
    public toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private idleService: IdleService,
    private dialog: MatDialog,
    private store: Store,
    private hotkeysService: HotkeysService,
    private xdcService: XdcService,
    private indexingHelperService: IndexingHelperService,
    @Inject('environment') private environment: Environment
  ) {}

  ngOnInit(): void {
    this.maxUnindexedPages = Number(this.environment.maxUnindexedPages);
    this.subscriptions.push(
      this.currentUsername$
        .pipe(
          filter(username => username != null),
          tap(() => {
            this.store.dispatch([
              new InitIndexingPage(this.route.snapshot.params.docId),
              new AddMenuOptions({ text: UserMenuOptions.HotkeyGuide }),
            ]);
          })
        )
        .subscribe()
    );
    // Start idle timeout checking
    this.subscriptions.push(
      this.idleService
        .startWatching(this.idleTimeoutToWarning)
        .pipe(
          tap((isTimedOut: boolean) => {
            if (isTimedOut) {
              this.idleService.resetWatch();
              this.store.dispatch(new LockDocument(this.route.snapshot.params.docId));
              return '';
            }
          })
        )
        .subscribe()
    );

    this.duplicateDetectionError$
      .pipe(
        takeUntil(this.unsubscribeSubject$),
        filter(x => x != null),
        tap(duplicateDetectionError => {
          const indexingPageDate = this.store.selectSnapshot(state => state.indexingPage);
          const supplierName = indexingPageDate.compositeData.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.lookupLabels.Supplier
          ).value.text;
          const invoiceNumber = indexingPageDate.compositeData.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceNumber
          ).value.text;

          this.dialog.open(DuplicateDetectionComponent, {
            autoFocus: false,
            data: {
              duplicateDetectionError,
              canViewAllBuyers$: this.canViewAllBuyers$,
              supplierName,
              invoiceNumber,
            },
          });
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject$.next();
    this.unsubscribeSubject$.complete();

    this.idleService.stopTimer();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.store.dispatch([
      new UnlockDocument(this.route.snapshot.params.docId),
      new ResetIndexingState(),
      new RemoveMenuOptions({ text: UserMenuOptions.HotkeyGuide }),
      new RemovePendingPageSignalEvents(),
      new RemoveRecycleBinPageSignalEvents(),
      new RemoveResearchPageSignalEvents(),
    ]);

    this.dialog.closeAll();
  }

  timeoutOccurred(): void {
    this.subscriptions.push(
      this.compositeData$
        .pipe(
          take(1),
          tap(compositeData => {
            this.openTimeoutToast(compositeData.indexed);
            this.router.navigate([
              this.store.selectSnapshot(
                state =>
                  state.core.currentPage ??
                  this.indexingHelperService.determineCurrentPage(compositeData)
              ),
            ]);
          })
        )
        .subscribe()
    );
  }

  saveInvoice(indexedDocument: IndexedData, hasNewEscalations: boolean): void {
    if (this.isNewInternalEscalation(indexedDocument, hasNewEscalations)) {
      this.store.dispatch(
        new PutInEscalation(
          indexedDocument,
          IndexingPageAction.Save,
          this.route.snapshot.params.docId
        )
      );
    } else {
      this.store.dispatch(new SaveIndexedDocument(indexedDocument, IndexingPageAction.Save));
    }
  }

  submitInvoice(indexedDocument: IndexedData, hasNewEscalations: boolean): void {
    let missingRequiredFields = false;
    this.subscriptions.push(
      this.fields$.subscribe(fields => {
        missingRequiredFields = this.indexingHelperService.requiredFieldsValidation(
          indexedDocument,
          fields
        );
      })
    );

    if (missingRequiredFields) {
      return;
    }

    this.notifications = this.indexingHelperService.getNotifications(indexedDocument);
    if (this.notifications.length > 0) {
      this.handleNotifications(indexedDocument, hasNewEscalations);
    } else {
      this.handleSubmitInvoice(indexedDocument, hasNewEscalations);
    }
  }

  private handleSubmitInvoice(indexedDocument: IndexedData, hasNewEscalations: boolean): void {
    if (this.isNewInternalEscalation(indexedDocument, hasNewEscalations)) {
      this.store.dispatch(
        new PutInEscalation(
          indexedDocument,
          IndexingPageAction.Save,
          this.route.snapshot.params.docId
        )
      );
    } else {
      this.store.dispatch([
        new EnableSubmitButton(false),
        new SubmitIndexedDocument(
          indexedDocument,
          IndexingPageAction.Submit,
          this.route.snapshot.params.docId
        ),
      ]);
    }
  }

  skipToPreviousDocument(): void {
    this.store.dispatch(new SkipDocument(this.route.snapshot.params.docId, -1));
    this.dialog.closeAll();
  }

  skipToNextDocument(): void {
    this.store.dispatch(new SkipDocument(this.route.snapshot.params.docId, 1));
    this.dialog.closeAll();
  }

  markAsSelectedChange(category: string): void {
    if (category === EscalationCategoryTypes.RejectToSender) {
      this.openReturnToSenderModal();
    } else if (category === MoreActions.RejectToSenderCrud) {
      this.openReturnToSenderCrudModal();
    } else {
      this.openEscalationModal(category);
    }
  }

  selectedItemsUpdated(label: IndexedLabel): void {
    this.store.dispatch(new UpdateSelectedDocumentText(label));
  }

  getAgeStamp(indexedDocument: IndexedData): string {
    const ingestionType = indexedDocument.labels?.find(
      x => x.label === DocumentLabelKeys.nonLookupLabels.IngestionType
    )?.value?.text;

    const sourceEmail = indexedDocument.labels?.find(
      x => x.label === DocumentLabelKeys.nonLookupLabels.SourceEmail
    )?.value?.text;

    const formattedDate = DateTime.fromISO(indexedDocument.dateReceived).toFormat(
      'dd MMM y h:mma ZZZZ'
    );

    const hours = DateTime.local()
      .diff(DateTime.fromISO(indexedDocument.dateReceived), ['hours'])
      .toFormat('h');

    this.tooltipText = `This invoice was received ${hours} hours ago`;

    return ingestionType
      ? `Delivered by ${ingestionType} ( ${sourceEmail} ) on ${formattedDate}`
      : `Delivered on ${formattedDate}`;
  }

  highlightField(boundingBoxInformation: string): void {
    this.fieldToHighlight = boundingBoxInformation;
  }

  boundingBoxToHighlight(boundingBoxId: string): void {
    this.boundingBoxCoordinatesToHighlight = boundingBoxId;
  }

  lookupFieldsValid(formGroupInstance: UntypedFormGroup): boolean {
    if (!formGroupInstance) {
      return false;
    }

    return (
      Object.keys(DocumentLabelKeys.lookupLabels).filter(
        label => !formGroupInstance.controls[label]?.valid
      ).length < 1
    );
  }

  openHotKeysModal(): void {
    this.hotkeysService.openHelpModal();
  }

  refreshToken(currentPage: string): void {
    this.store.dispatch([new RefreshToken(), new SetCurrentPage(currentPage)]);
  }

  swapDocument(indexedDocument: IndexedData, username: string): void {
    const buyerId = indexedDocument.labels.find(
      (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.BuyerId
    )?.value?.text;

    this.dialog
      .open(DocumentSwapComponent, {
        autoFocus: false,
        width: '49.875em',
      })
      .afterClosed()
      .pipe(
        tap((file: File) => {
          if (file) {
            this.store.dispatch(new SwapDocument(file, buyerId));
          }
        }),
        take(1)
      )
      .subscribe();
  }

  openPasswordModal(): void {
    this.dialog
      .open(PdfPasswordComponent, {
        autoFocus: true,
        closeOnNavigation: true,
        hasBackdrop: false,
        width: '39.875em',
      })
      .afterClosed()
      .pipe(
        tap((password: string) => {
          if (password) {
            this.store.dispatch(new SetPdfSecret(password));
          }
        }),
        take(1)
      )
      .subscribe();
  }

  downloadFile(compositeData: CompositeDocument): void {
    this.subscriptions.push(
      this.xdcService.getFile(compositeData.indexed.documentId).subscribe((result: Blob) => {
        const file = new Blob([result], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');

        a.href = fileURL;
        a.target = '_blank';
        a.download = compositeData.indexed.labels.find(
          lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.FileName
        ).value.text;
        document.body.appendChild(a);
        a.click();
      })
    );
  }

  canDisplayPredictedValues(compositeData: CompositeDocument): boolean {
    return this.indexingHelperService.canDisplayPredictedValues(compositeData.indexed.labels);
  }

  private openTimeoutToast(indexedDocument: IndexedData): void {
    const formattedDate = DateTime.local().toFormat('dd MMMM yyyy');
    const formattedTime = DateTime.local().toFormat('h:mma');
    const fileName = indexedDocument?.labels.find(
      (label: IndexedLabel) => label?.label === DocumentLabelKeys.nonLookupLabels.FileName
    ).value.text;
    const toastMessage = `Due to inactivity, Invoice ${fileName} posted on ${formattedDate} at ${formattedTime} was unlocked.`;

    this.toast.warning(toastMessage);
  }

  private isNewInternalEscalation(
    indexedDocument: IndexedData,
    hasNewEscalations: boolean
  ): boolean {
    return (
      indexedDocument.activities.filter(act => act.escalation).length > 0 &&
      indexedDocument.activities.filter(act => act.escalation)[
        indexedDocument.activities.filter(act => act.escalation).length - 1
      ].escalation.category.issue === EscalationCategoryTypes.IndexerQa &&
      hasNewEscalations
    );
  }

  private openEscalationModal(category: string): void {
    const escalation: Escalation = {
      category: { issue: category, reason: '' },
      description: '',
      escalationLevel:
        category === EscalationCategoryTypes.IndexerQa
          ? EscalationLevelTypes.InternalProcess
          : EscalationLevelTypes.InternalXdc,
      resolution: '',
    };

    this.subscriptions.push(
      this.dialog
        .open(EscalationSelectionComponent, {
          width: '28.125em',
          data: {
            dropdownOptions: this.getDropdownOptions(escalation.category.issue),
            escalationCategory: escalation.category.issue,
          },
        })
        .afterClosed()
        .pipe(
          take(1),
          tap((result: { selectedValue: string; comment: string }) => {
            if (result) {
              escalation.description = result.comment;
              escalation.category.reason = result.selectedValue;

              this.store.dispatch(new SetEscalation(escalation));
            }
            this.hotkeysService.canOpenHotKeysModal = true;
            this.dialog.closeAll();
            return;
          })
        )
        .subscribe()
    );
    // disable hotkeys modal when selection modal is open
    this.hotkeysService.canOpenHotKeysModal = false;
  }

  private openReturnToSenderModal(): void {
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    this.store.dispatch([
      new QueryRejectToSenderTemplates(buyerId),
      new CheckForDuplicateDocument(),
    ]);

    const escalation: Escalation = {
      category: { issue: EscalationCategoryTypes.RecycleBin, reason: 'Other' },
      description: EscalationCategoryTypes.RejectToSender,
      escalationLevel: EscalationLevelTypes.InternalXdc,
      resolution: '',
    };
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const sourceEmail = compositeData.indexed.labels
      ?.find(x => x.label === DocumentLabelKeys.nonLookupLabels.SourceEmail)
      ?.value?.text.toLowerCase();

    this.subscriptions.push(
      combineLatest([
        this.store.select(IndexingUtilitySelectors.rejectToSenderTemplates),
        this.store.select(IndexingUtilitySelectors.duplicateIndexedData),
      ])
        .pipe(
          filter(
            ([templates, dupeIndexedData]: [RejectToSenderTemplate[], IndexedData]) =>
              templates.length > 0 && dupeIndexedData !== undefined
          ),
          take(1),
          mergeMap(([templates, duplicateIndexedData]: [RejectToSenderTemplate[], IndexedData]) => {
            return this.dialog
              .open(RejectToSenderComponent, {
                autoFocus: false,
                width: '40em',
                data: {
                  templates,
                  sourceEmail,
                  indexedData: compositeData.indexed,
                  duplicateIndexedData,
                },
              })
              .afterClosed();
          }),
          tap((payload: RejectToSenderPayload) => {
            if (payload) {
              this.store.dispatch([
                new PostRejectToSender({
                  ...payload,
                  submitterEmailAddress: this.store.selectSnapshot(CoreSelectors.currentUserEmail),
                  fileId: compositeData.indexed.fileId,
                  dateReceived: compositeData.indexed.dateReceived,
                }),
                new SetEscalation(escalation),
              ]);
            }

            this.hotkeysService.canOpenHotKeysModal = true;
            this.dialog.closeAll();
          })
        )
        .subscribe()
    );
    // disable hotkeys modal when selection modal is open
    this.hotkeysService.canOpenHotKeysModal = false;
  }

  private openReturnToSenderCrudModal(): void {
    const buyerId: number = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    this.store.dispatch(new QueryRejectToSenderTemplates(buyerId));

    this.subscriptions.push(
      this.dialog
        .open(RejectToSenderCrudComponent, {
          autoFocus: false,
          width: '40em',
          data: {
            buyerId,
          },
        })
        .afterClosed()
        .pipe(
          tap(() => {
            this.hotkeysService.canOpenHotKeysModal = true;
            this.dialog.closeAll();
          })
        )
        .subscribe()
    );

    // disable hotkeys modal when selection modal is open
    this.hotkeysService.canOpenHotKeysModal = false;
  }

  handleNotifications(indexedDocument: IndexedData, hasNewEscalations: boolean): void {
    this.subscriptions.push(
      this.dialog
        .open(ConfirmComponent, {
          data: {
            title: this.notifications[0].title,
            message: this.notifications[0].message,
          },
        })
        .afterClosed()
        .pipe(
          tap(value => {
            if (value) {
              this.notifications.shift();
              if (this.notifications.length > 0) {
                this.handleNotifications(indexedDocument, hasNewEscalations);
              } else {
                this.handleSubmitInvoice(indexedDocument, hasNewEscalations);
              }
            }
          }),
          take(1)
        )
        .subscribe()
    );
  }

  private getDropdownOptions(category: string): DropdownOptions[] {
    switch (category) {
      case EscalationCategoryTypes.IndexerQa:
        return internalEscalationChoices;
      case EscalationCategoryTypes.ImageIssue:
        return imageIssueTypes;
      case EscalationCategoryTypes.IndexingOpsQc:
        return dataExceptionIssueTypes;
      case EscalationCategoryTypes.RecycleBin:
        return recycleIssueTypes;
      case EscalationCategoryTypes.ScanningOpsQC:
        return scanningOpsQcTypes;
      default:
        return [];
    }
  }

  updateFontFace(updateFontFace: boolean): void {
    this.store.dispatch([new UpdateFontFace(updateFontFace), new SetPdfFileValue()]);
  }

  disableHighlight(disableHighlight: boolean): void {
    this.store.dispatch(new DisableHighlight(disableHighlight));
  }
}
