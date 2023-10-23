import { getBuyersStub, getDocuments } from '@ui-coe/avidcapture/shared/test';

import { ArchivePageSelectors } from './archive-page.selectors';

describe('ArchivePageSelectors', () => {
  it('should select recycleBinDocuments from state', () => {
    const invoices = getDocuments();

    expect(ArchivePageSelectors.archivedInvoices({ invoices } as any)).toEqual(invoices);
  });

  it('should select buyers from state', () => {
    const buyers = getBuyersStub();

    expect(ArchivePageSelectors.buyers({ buyers } as any)).toEqual(buyers);
  });

  it('should select filteredBuyers from state', () => {
    expect(ArchivePageSelectors.filteredBuyers({ filteredBuyers: [] } as any)).toEqual([]);
  });

  it('should select advancedFilters from state', () => {
    expect(ArchivePageSelectors.advancedFilters({ filters: { buyerId: ['25'] } } as any)).toEqual({
      buyerId: ['25'],
    });
  });

  it('should select loadMoreHidden from state', () => {
    expect(ArchivePageSelectors.loadMoreHidden({ loadMoreHidden: false } as any)).toBeFalsy();
  });

  it('should select sortedColumnData from state', () =>
    expect(ArchivePageSelectors.sortedColumnData({ sortedColumnData: {} } as any)).toEqual({}));

  it('should select appliedFilters from state and return an object with some values', () =>
    expect(
      ArchivePageSelectors.appliedFilters({
        filters: { invoiceNumber: ['1'] },
      } as any)
    ).toEqual({
      invoiceNumber: ['1'],
    }));

  it('should select canRefreshPage from state', () =>
    expect(ArchivePageSelectors.canRefreshPage({ canRefreshPage: true } as any)).toBeTruthy());
});
