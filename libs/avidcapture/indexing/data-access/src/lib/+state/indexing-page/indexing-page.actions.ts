import {
  Activity,
  AdvancedFilter,
  CompositeDocument,
  DuplicateDetectionError,
  Escalation,
  FieldBase,
  IndexedData,
  IndexedLabel,
  IndexingPageAction,
  SearchBodyRequest,
} from '@ui-coe/avidcapture/shared/types';

export class InitIndexingPage {
  static readonly type = '[IndexingPageState] InitIndexingPage';
  constructor(public documentId: string) {}
}

export class QueryUnindexedDocument {
  static readonly type = '[IndexingPageState] QueryUnindexedDocument';
  constructor(public documentId: string) {}
}

export class PutInEscalation {
  static readonly type = '[IndexingPageState] PutInEscalation';
  constructor(
    public indexedDocument: IndexedData,
    public action: IndexingPageAction,
    public documentId: string
  ) {}
}

export class SaveIndexedDocument {
  static readonly type = '[IndexingPageState] SaveIndexedDocument';
  constructor(
    public indexedDocument: IndexedData,
    public action: IndexingPageAction,
    public redirectQueue = false
  ) {}
}

export class SubmitIndexedDocument {
  static readonly type = '[IndexingPageState] SubmitIndexedDocument';
  constructor(
    public indexedDocument: IndexedData,
    public action: IndexingPageAction,
    public documentId: string
  ) {}
}

export class AddCompositeDataActivity {
  static readonly type = '[IndexingPageState] AddCompositeDataActivity';
  constructor(public activity: Activity) {}
}

export class RemoveCustomerAccountActivity {
  static readonly type = '[IndexingPageState] RemoveCustomerAccountActivity';
}

export class UpdateOnLookupFieldAssociation {
  static readonly type = '[IndexingPageState] UpdateOnLookupFieldAssociation';
  constructor(public indexedLabel: IndexedLabel) {}
}

export class UpdateOnNonLookupFieldAssociation {
  static readonly type = '[IndexingPageState] UpdateOnNonLookupFieldAssociation';
  constructor(public indexedLabel: IndexedLabel) {}
}

export class UpdateOnManualIntervention {
  static readonly type = '[IndexingPageState] UpdateOnManualIntervention';
  constructor(public formValue: FieldBase<string>) {}
}

export class UpdateCompositeDataLabel {
  static readonly type = '[IndexingPageState] UpdateCompositeDataLabel';
  constructor(public indexedLabel: IndexedLabel) {}
}

export class AddCompositeDataLabel {
  static readonly type = '[IndexingPageState] AddCompositeDataLabel';
  constructor(public indexedLabel: IndexedLabel) {}
}

export class UpdateChangedLabels {
  static readonly type = '[IndexingPageState] UpdateChangedLabels';
  constructor(public changedLabel: IndexedLabel) {}
}

export class QueryNextDocument {
  static readonly type = '[IndexingPageState] QueryNextDocument';
  constructor(public requestBody: SearchBodyRequest) {}
}

export class SkipToPreviousDocument {
  static readonly type = '[IndexingPageState] SkipToPreviousDocument';
  constructor(public docId: string) {}
}

export class SkipToNextDocument {
  static readonly type = '[IndexingPageState] SkipToNextDocument';
  constructor(public docId: string) {}
}

export class SkipDocument {
  static readonly type = '[IndexingPageState] SkipDocument';
  constructor(public docId: string, public index: number) {}
}

export class GetNextDocument {
  static readonly type = '[IndexingPageState] GetNextDocument';
  constructor(
    public documentId: string,
    public requestBody: SearchBodyRequest,
    public action: string
  ) {}
}

export class SetBuyerId {
  static readonly type = '[IndexingPageState] SetBuyerId';
  constructor(public buyerId: string) {}
}

export class RemoveLatestFieldAssociation {
  static readonly type = '[IndexingPageState] RemoveLatestFieldAssociation';
}

export class SetEscalation {
  static readonly type = '[IndexingPageState] SetEscalation';
  constructor(public escalation: Escalation) {}
}

export class OverrideEscalation {
  static readonly type = '[IndexingPageState] OverrideEscalation';
}

export class SetPdfFileValue {
  static readonly type = '[IndexingPageState] SetPdfFileValue';
}

export class SetPdfSecret {
  static readonly type = '[IndexingPageState] SetPdfSecret';
  constructor(public secret: string) {}
}

export class UpdateLookupFieldAssociationValue {
  static readonly type = '[IndexingPageState] UpdateLookupFieldAssociationValue';
  constructor(public field: FieldBase<string>) {}
}

export class ResetIndexingState {
  static readonly type = '[IndexingPageState] ResetIndexingState';
}

export class UpdateLabelsAfterThresholdCheck {
  static readonly type = '[IndexingPageState] UpdateLabelsAfterThresholdCheck';
}

export class UpdateSupplierAddressLabel {
  static readonly type = '[IndexingPageState] UpdateSupplierAddressLabel';
  constructor(
    public supplierAddressFormValue: FieldBase<string>,
    public boundingBoxCoordinates: number[]
  ) {}
}

export class UpdateShipToAddressLabel {
  static readonly type = '[IndexingPageState] UpdateShipToAddressLabel';
  constructor(
    public shipToAddressFormValue: FieldBase<string>,
    public boundingBoxCoordinates: number[]
  ) {}
}

export class AddAutoFormatActivity {
  static readonly type = '[IndexingPageState] AddAutoFormatActivity';
  constructor(public indexedDocument: IndexedData, public error: DuplicateDetectionError) {}
}

export class UpdateSwappedDocument {
  static readonly type = '[IndexingPageState] UpdateSwappedDocument';
  constructor(public indexedDocument: IndexedData) {}
}

export class HandleNextDocumentGiven {
  static readonly type = '[IndexingPageState] HandleNextDocumentGiven';
  constructor(public document: CompositeDocument) {}
}

export class UpdateFontFace {
  static readonly type = '[IndexingPageState] updateFontFace';
  constructor(public updateFontFace: boolean) {}
}

export class DisableHighlight {
  static readonly type = '[IndexingPageState] DisableHighlight';
  constructor(public disableHighlight: boolean) {}
}

export class StorePageFilters {
  static readonly type = '[IndexingPageState] StorePageFilters';
  constructor(public pageFilters: AdvancedFilter) {}
}

export class RoundCurrencyValues {
  static readonly type = '[IndexingPageState] RoundCurrencyValues';
}

export class InitialInvoiceTypeLabelValueCheck {
  static readonly type = '[IndexingPageState] InitialInvoiceTypeLabelValueCheck';
}

export class EnableQueueSockets {
  static readonly type = '[IndexingPageState] Enable Queue Sockets';
}
