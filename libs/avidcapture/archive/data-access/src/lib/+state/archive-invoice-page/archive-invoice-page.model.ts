import {
  CompositeDocument,
  Field,
  FieldBase,
  LabelColor,
  PdfJsRequest,
} from '@ui-coe/avidcapture/shared/types';

export interface ArchiveInvoicePageStateModel {
  document: CompositeDocument;
  pdfFile: PdfJsRequest;
  formFields: Field[];
  fields: FieldBase<string>[];
  labelColors: LabelColor[];
  updateFontFace: boolean;
}
