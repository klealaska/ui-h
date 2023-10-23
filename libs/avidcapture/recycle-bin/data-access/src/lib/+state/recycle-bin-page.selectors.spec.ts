import { buyerStub, getBuyersStub, getDocuments } from '@ui-coe/avidcapture/shared/test';

import { RecycleBinSelectors } from './recycle-bin-page.selectors';

describe('RecycleBinSelectors', () => {
  it('should select recycleBinDocuments from state', () => {
    const invoices = getDocuments();

    expect(RecycleBinSelectors.recycleBinDocuments({ invoices } as any)).toEqual(invoices);
  });

  it('should select buyers from state', () => {
    const buyers = getBuyersStub();

    expect(RecycleBinSelectors.buyers({ buyers } as any)).toEqual(buyers);
  });

  it('should select filteredBuyers from state', () => {
    expect(RecycleBinSelectors.filteredBuyers({ filteredBuyers: [] } as any)).toEqual([]);
  });

  it('should select advancedFilters from state', () => {
    expect(RecycleBinSelectors.advancedFilters({ filters: { buyerId: ['25'] } } as any)).toEqual({
      buyerId: ['25'],
    });
  });

  it('should select loadMoreHidden from state', () => {
    expect(RecycleBinSelectors.loadMoreHidden({ loadMoreHidden: false } as any)).toBeFalsy();
  });

  it('should select sortedColumnData from state', () =>
    expect(RecycleBinSelectors.sortedColumnData({ sortedColumnData: {} } as any)).toEqual({}));

  it('should select appliedFilters from state and return an object with some values', () =>
    expect(
      RecycleBinSelectors.appliedFilters({
        filters: { invoiceNumber: ['1'] },
      } as any)
    ).toEqual({
      invoiceNumber: ['1'],
    }));

  it('should select canRefreshPage from state', () =>
    expect(RecycleBinSelectors.canRefreshPage({ canRefreshPage: true } as any)).toBeTruthy());
});
