import { Selector } from '@ngxs/store';
import {
  CompositeDocument,
  DocumentLabelKeys,
  FieldBase,
  IndexedLabel,
  InvoiceTypes,
  LabelColor,
  PdfJsRequest,
} from '@ui-coe/avidcapture/shared/types';

import { ArchiveInvoicePageStateModel } from './archive-invoice-page.model';
import { ArchiveInvoicePageState } from './archive-invoice-page.state';

export class ArchiveInvoicePageSelectors {
  @Selector([ArchiveInvoicePageState.data])
  static archivedDocument(state: ArchiveInvoicePageStateModel): CompositeDocument {
    return state.document;
  }

  @Selector([ArchiveInvoicePageState.data])
  static pdfFile(state: ArchiveInvoicePageStateModel): PdfJsRequest {
    return state.pdfFile;
  }

  @Selector([ArchiveInvoicePageState.data])
  static buyerName(state: ArchiveInvoicePageStateModel): string {
    const label: IndexedLabel = state.document?.indexed?.labels?.find(
      (lbl: IndexedLabel) => lbl.label === DocumentLabelKeys.nonLookupLabels.BuyerName
    );
    return label?.value?.text ?? '';
  }

  @Selector([ArchiveInvoicePageState.data])
  static fields(state: ArchiveInvoicePageStateModel): FieldBase<string>[] {
    return state.fields.filter(field => {
      if (
        field.key !== DocumentLabelKeys.lookupLabels.ShipToAddress &&
        field.key !== DocumentLabelKeys.lookupLabels.SupplierAddress
      ) {
        return field;
      }
    });
  }

  @Selector([ArchiveInvoicePageState.data])
  static formFields(state: ArchiveInvoicePageStateModel): FieldBase<string>[] {
    return state.formFields;
  }

  @Selector([ArchiveInvoicePageState.data])
  static labelColors(state: ArchiveInvoicePageStateModel): LabelColor[] {
    return state.labelColors;
  }

  @Selector([ArchiveInvoicePageState.data])
  static supplierAddressField(state: ArchiveInvoicePageStateModel): FieldBase<string> {
    return state.fields.find(field => field.key === DocumentLabelKeys.lookupLabels.SupplierAddress);
  }

  @Selector([ArchiveInvoicePageState.data])
  static shipToAddressField(state: ArchiveInvoicePageStateModel): FieldBase<string> {
    return state.fields.find(field => field.key === DocumentLabelKeys.lookupLabels.ShipToAddress);
  }

  @Selector([ArchiveInvoicePageState.data])
  static updateFontFace(state: ArchiveInvoicePageStateModel): boolean {
    return state.updateFontFace;
  }

  @Selector([ArchiveInvoicePageState.data])
  static utilityFields(state: ArchiveInvoicePageStateModel): string[] {
    const utilityFields = [];
    state.formFields.forEach(fld => {
      if (fld.fieldType === InvoiceTypes.Utility) {
        utilityFields.push(fld.key);
      }
    });

    return utilityFields;
  }
}
