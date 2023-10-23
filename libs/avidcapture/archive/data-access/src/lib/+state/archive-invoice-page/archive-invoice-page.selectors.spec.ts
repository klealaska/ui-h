import {
  fieldBaseStub,
  getCompositeDataStub,
  getFieldBaseStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys } from '@ui-coe/avidcapture/shared/types';

import { ArchiveInvoicePageSelectors } from './archive-invoice-page.selectors';

describe('ArchiveInvoicePageSelectors', () => {
  it('should select archivedDocument from state', () => {
    const document = getCompositeDataStub();

    expect(ArchiveInvoicePageSelectors.archivedDocument({ document } as any)).toEqual(document);
  });

  it('should select pdfFile from state', () => {
    expect(ArchiveInvoicePageSelectors.pdfFile({ pdfFile: null } as any)).toBe(null);
  });

  it('should return label name when label is found', () => {
    const labelStub = {
      indexed: {
        labels: [
          {
            label: DocumentLabelKeys.nonLookupLabels.BuyerName,
            page: 1,
            value: {
              text: 'buyerNameMock',
              confidence: 99.99,
              boundingBox: [],
              required: false,
              verificationState: '',
            },
          },
        ],
      },
    };
    expect(ArchiveInvoicePageSelectors.buyerName({ document: labelStub } as any)).toBe(
      'buyerNameMock'
    );
  });

  it('should return empty string when labels is empty', () => {
    const labelStub = {
      indexed: {
        labels: [],
      },
    };
    expect(ArchiveInvoicePageSelectors.buyerName({ document: labelStub } as any)).toBe('');
  });

  it('should return empty string when labels is null', () => {
    const labelStub = {
      indexed: {
        labels: null,
      },
    };
    expect(ArchiveInvoicePageSelectors.buyerName({ document: labelStub } as any)).toBe('');
  });

  it('should return empty string when document is null', () => {
    expect(ArchiveInvoicePageSelectors.buyerName({ document: null } as any)).toBe('');
  });

  it('should return empty string when indexed data is null', () => {
    const labelStub = {
      indexed: null,
    };
    expect(ArchiveInvoicePageSelectors.buyerName({ document: labelStub } as any)).toBe('');
  });

  it('should return empty string when label value is null', () => {
    const document = getCompositeDataStub();
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.BuyerName);
    indexedLabel.value = null;
    document.indexed.labels.push(indexedLabel);

    expect(ArchiveInvoicePageSelectors.buyerName({ document } as any)).toBe('');
  });

  it('should return buyerName label when label exists', () => {
    const document = getCompositeDataStub();
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.BuyerName);
    document.indexed.labels.push(indexedLabel);

    expect(ArchiveInvoicePageSelectors.buyerName({ document } as any)).toBe(
      indexedLabel.value.text
    );
  });

  it('should select fields from state when field.key does not equal ShipToAddress or SupplierAddress', () => {
    expect(ArchiveInvoicePageSelectors.fields({ fields: fieldBaseStub } as any)).toEqual(
      fieldBaseStub
    );
  });

  it('should not return any fields from state when field.key equals ShipToAddress && SupplierAddress', () => {
    const fieldStub = [
      getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress),
      getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
    ];
    expect(ArchiveInvoicePageSelectors.fields({ fields: fieldStub } as any)).toEqual([]);
  });

  it('should select formFields from state', () => {
    expect(ArchiveInvoicePageSelectors.formFields({ formFields: fieldBaseStub } as any)).toEqual(
      fieldBaseStub
    );
  });

  it('should select labelColors from state', () =>
    expect(ArchiveInvoicePageSelectors.labelColors({ labelColors: [] } as any)).toEqual([]));

  it('should select supplier address field from state when it exists', () => {
    const fieldStub = [
      getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress),
      getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
    ];

    expect(ArchiveInvoicePageSelectors.supplierAddressField({ fields: fieldStub } as any)).toEqual(
      getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress)
    );
  });

  it('should return undefinded when selecting supplierAddressField from state when field does not exist', () => {
    const fieldStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress)];

    expect(
      ArchiveInvoicePageSelectors.supplierAddressField({ fields: fieldStub } as any)
    ).toBeUndefined();
  });

  it('should select ship to address field from state when it exists', () => {
    const fieldStub = [
      getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress),
      getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
    ];

    expect(ArchiveInvoicePageSelectors.shipToAddressField({ fields: fieldStub } as any)).toEqual(
      getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress)
    );
  });

  it('should return undefinded when selecting shipToAddressField from state when field does not exist', () => {
    const fieldStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress)];

    expect(
      ArchiveInvoicePageSelectors.shipToAddressField({ fields: fieldStub } as any)
    ).toBeUndefined();
  });

  it('should select updateFontFace from state', () => {
    expect(ArchiveInvoicePageSelectors.updateFontFace({ updateFontFace: false } as any)).toBe(
      false
    );
  });

  it('should select utilityFields from state', () => {
    expect(
      ArchiveInvoicePageSelectors.utilityFields({
        formFields: [
          { key: 'ServiceStartDate', fieldType: 'Utility' },
          { key: 'Supplier', fieldType: 'Standard' },
        ],
      } as any)
    ).toEqual(['ServiceStartDate']);
  });
});
