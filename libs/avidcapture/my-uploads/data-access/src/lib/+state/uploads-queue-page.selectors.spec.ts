import { getDocuments } from '@ui-coe/avidcapture/shared/test';

import { UploadsQueuePageSelectors } from './uploads-queue-page.selectors';

describe('UploadsQueuePageSelectors', () => {
  it('should select uploadedInvoices from state', () => {
    const invoices = getDocuments();

    expect(UploadsQueuePageSelectors.invoices({ invoices } as any)).toEqual(invoices);
  });

  it('should select uploadedInvoices from state', () => {
    const invoices = getDocuments();

    expect(UploadsQueuePageSelectors.uploadedInvoices({ invoices } as any)).toEqual(invoices);
  });

  it('should select loadMoreHidden from state', () => {
    expect(UploadsQueuePageSelectors.loadMoreHidden({ loadMoreHidden: false } as any)).toBeFalsy();
  });

  it('should select sortedColumnData from state', () =>
    expect(UploadsQueuePageSelectors.sortedColumnData({ sortedColumnData: {} } as any)).toEqual(
      {}
    ));

  it('should select canRefreshPage from state', () =>
    expect(UploadsQueuePageSelectors.canRefreshPage({ canRefreshPage: true } as any)).toBeTruthy());

  it('should select uploadedDocumentMessages from state', () =>
    expect(
      UploadsQueuePageSelectors.uploadedDocumentMessages({ uploadedDocumentMessages: [] } as any)
    ).toEqual([]));

  it('should select searchByFileNameValue from state', () =>
    expect(
      UploadsQueuePageSelectors.searchByFileNameValue({ searchByFileNameValue: [] } as any)
    ).toEqual([]));
});
