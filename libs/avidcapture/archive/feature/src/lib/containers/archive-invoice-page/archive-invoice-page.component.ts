import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import {
  ArchiveInvoicePageSelectors,
  InitArchiveInvoicePage,
  QueryArchivedDocument,
  UpdateFontFace,
  SkipToNextDocument,
  SkipToPreviousDocument,
} from '@ui-coe/avidcapture/archive/data-access';
import {
  AddMenuOptions,
  ClaimsQueries,
  CoreSelectors,
  FeatureFlagTargetQueries,
  RemoveMenuOptions,
} from '@ui-coe/avidcapture/core/data-access';
import { XdcService } from '@ui-coe/avidcapture/core/util';
import {
  ActivityTypes,
  CompositeDocument,
  DocumentLabelKeys,
  Environment,
  FieldBase,
  IndexedLabel,
  InvoiceTypes,
  LabelColor,
  UserMenuOptions,
} from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';
import { Observable, Subscription } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-archive-invoice-page',
  templateUrl: './archive-invoice-page.component.html',
  styleUrls: ['./archive-invoice-page.component.scss'],
})
export class ArchiveInvoicePageComponent implements OnInit, OnDestroy {
  @Select(ArchiveInvoicePageSelectors.archivedDocument)
  archivedDocument$: Observable<CompositeDocument>;
  @Select(ArchiveInvoicePageSelectors.buyerName) buyerName$: Observable<string>;
  @Select(ArchiveInvoicePageSelectors.pdfFile) pdfFile$: Observable<string>;
  @Select(ArchiveInvoicePageSelectors.fields) fields$: Observable<FieldBase<string>[]>;
  @Select(ArchiveInvoicePageSelectors.formFields) formFields$: Observable<FieldBase<string>[]>;
  @Select(ArchiveInvoicePageSelectors.labelColors) labelColors$: Observable<LabelColor[]>;
  @Select(ArchiveInvoicePageSelectors.supplierAddressField) supplierAddressField$: Observable<
    FieldBase<string>
  >;
  @Select(ArchiveInvoicePageSelectors.shipToAddressField) shipToAddressField$: Observable<
    FieldBase<string>
  >;
  @Select(ArchiveInvoicePageSelectors.utilityFields) utilityFields$: string[];
  @Select(ArchiveInvoicePageSelectors.updateFontFace) updateFontFace$: Observable<boolean>;
  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.isLoading) isLoading$: Observable<boolean>;
  @Select(ClaimsQueries.canDownloadPdf) canDownloadPdf$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAllBuyers) canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.canViewGetNextDocument) canViewGetNextDocument$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.multipleDisplayThresholdsIsActive)
  multipleDisplayThresholdsIsActive$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.supplierPredictionIsActive)
  supplierPredictionIsActive$: Observable<boolean>;

  boundingBoxCoordinatesToHighlight = '';
  fieldToHighlight = '';
  documentLabelKeys = DocumentLabelKeys; // for template
  maxUnindexedPages = 1;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private xdcService: XdcService,
    @Inject('environment') private environment: Environment
  ) {}

  ngOnInit(): void {
    this.maxUnindexedPages = Number(this.environment.maxUnindexedPages);
    this.subscriptions.push(
      this.currentUsername$
        .pipe(
          filter(username => username != null),
          mergeMap(() => this.route.paramMap),
          tap(params => {
            this.store.dispatch([
              new InitArchiveInvoicePage(params.get('docId')),
              new AddMenuOptions({ text: UserMenuOptions.HotkeyGuide }),
            ]);
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.store.dispatch(new RemoveMenuOptions({ text: UserMenuOptions.HotkeyGuide }));
  }

  getInvoiceType(labels: IndexedLabel[]): string {
    const invoiceTypeLabel = labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
    );

    return invoiceTypeLabel?.value.text ?? InvoiceTypes.Standard;
  }

  getPredictedValue(labels: IndexedLabel[]): boolean {
    return (
      Boolean(
        Number(
          labels.find(lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues)
            ?.value.text
        )
      ) ?? false
    );
  }

  getIsUtilityField(label: FieldBase<string>, fields: string[]): boolean {
    return fields.find(field => field === label.key) ? true : false;
  }

  boundingBoxToHighlight(boundingBoxId: string): void {
    this.boundingBoxCoordinatesToHighlight = boundingBoxId;
  }

  highlightField(boundingBoxInformation: string): void {
    this.fieldToHighlight = boundingBoxInformation;
  }

  getSubmittedDate(archivedDocument: CompositeDocument): string {
    const activity = archivedDocument.indexed.activities.find(
      activity => activity.activity === ActivityTypes.Submit
    );

    if (!activity) {
      return '';
    }

    const submittedDate = DateTime.fromISO(activity.endDate).toFormat('dd MMM y h:mma ZZZZ');

    return `Submitted on ${submittedDate} by ${activity.indexer}`;
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

  updateFontFace(updateFontFace: boolean, documentId: string): void {
    this.store.dispatch([
      new UpdateFontFace(updateFontFace),
      new QueryArchivedDocument(documentId),
    ]);
  }

  skipToPreviousDocument(): void {
    this.store.dispatch(new SkipToPreviousDocument(this.route.snapshot.params.docId));
  }

  skipToNextDocument(): void {
    this.store.dispatch(new SkipToNextDocument(this.route.snapshot.params.docId));
  }
}
