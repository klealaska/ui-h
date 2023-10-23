import { getCompositeDataStub, getIndexedLabelStub } from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys } from '@ui-coe/avidcapture/shared/types';

import { IndexingUtilitySelectors } from './indexing-utility.selectors';

describe('IndexingUtilitySelectors', () => {
  it('should select labelColors from state', () =>
    expect(IndexingUtilitySelectors.labelColors({ labelColors: [] } as any)).toEqual([]));

  it('should select duplicateDetectionError from state', () =>
    expect(
      IndexingUtilitySelectors.duplicateDetectionError({
        duplicateDetectionError: { documentId: '1', sourceDoucmentId: null },
      } as any)
    ).toEqual({ documentId: '1', sourceDoucmentId: null }));

  it('should select selectedDocumentText from state', () => {
    const labelStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);

    expect(
      IndexingUtilitySelectors.selectedDocumentText({
        selectedDocumentText: labelStub,
      } as any)
    ).toEqual(labelStub);
  });

  it('should select rejectToSenderTemplates from state', () => {
    expect(
      IndexingUtilitySelectors.rejectToSenderTemplates({
        rejectToSenderTemplates: [],
      } as any)
    ).toEqual([]);
  });

  it('should select only custom rejectToSenderTemplates from state', () => {
    const templatesStub = [
      {
        sourceSystemBuyerId: null,
        templateId: 1,
      },
      {
        sourceSystemBuyerId: 1,
        templateId: 2,
      },
      {
        sourceSystemBuyerId: '',
        templateId: 3,
      },
    ];

    expect(
      IndexingUtilitySelectors.customRejectToSenderTemplates({
        rejectToSenderTemplates: templatesStub,
      } as any)
    ).toEqual([
      {
        sourceSystemBuyerId: 1,
        templateId: 2,
      },
    ]);
  });

  it('should select duplicateIndexedData from state', () => {
    expect(
      IndexingUtilitySelectors.duplicateIndexedData({
        duplicateIndexedData: getCompositeDataStub().indexed,
      } as any)
    ).toEqual(getCompositeDataStub().indexed);
  });

  it('should select canSubmit from state', () => {
    expect(
      IndexingUtilitySelectors.canSubmit({
        canSubmit: true,
      } as any)
    ).toBeTruthy();
  });
});
