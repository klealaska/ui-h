import {
  AdvancedFilter,
  AssociatedErrorMessage,
  CompositeDocument,
  Escalation,
  FieldAssociated,
  FieldBase,
  IndexedLabel,
  PdfJsRequest,
} from '@ui-coe/avidcapture/shared/types';

export interface IndexingPageStateModel {
  compositeData: CompositeDocument;
  pdfFile: PdfJsRequest;
  swappedDocument: PdfJsRequest;
  hasNewEscalations: boolean;
  buyerId: number;
  latestFieldAssociation: FieldAssociated;
  originalCompositeData: CompositeDocument;
  changedLabels: IndexedLabel[];
  associatedErrorMessage: AssociatedErrorMessage;
  escalation: Escalation;
  startDate: string;
  allowedToUnlockDocument: boolean;
  associatedLookupFieldValue: FieldBase<string>;
  isReadOnly: boolean;
  updateFontFace: boolean;
  disableHighlight: boolean;
  pageFilters: AdvancedFilter;
}
