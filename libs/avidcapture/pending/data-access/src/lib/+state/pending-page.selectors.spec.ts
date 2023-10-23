import { buyerStub, getBuyersStub, getDocuments } from '@ui-coe/avidcapture/shared/test';

import { PendingPageSelectors } from './pending-page.selectors';

describe('PendingPageSelectors', () => {
  it('should select queueInvoices from state', () =>
    expect(PendingPageSelectors.invoices({ invoices: [getDocuments()[0]] } as any)).toEqual([
      getDocuments()[0],
    ]));

  it('should select buyers from state and return all buyers', () =>
    expect(
      PendingPageSelectors.buyers({
        buyers: getBuyersStub(),
        filters: { buyerId: [{ id: '25', name: 'Avidxchange' }] },
      } as any)
    ).toEqual(getBuyersStub()));

  it('should select buyers from state return all buyers that are not filtered', () => {
    const buyers = getBuyersStub();

    expect(
      PendingPageSelectors.buyers({ buyers, filters: { buyerId: [buyerStub] } } as any)
    ).toEqual([buyers[1], buyers[2]]);
  });

  it('should select filteredBuyers from state', () =>
    expect(PendingPageSelectors.filteredBuyers({ filteredBuyers: getBuyersStub() } as any)).toEqual(
      getBuyersStub()
    ));

  it('should select advancedFilters from state', () =>
    expect(
      PendingPageSelectors.advancedFilters({
        filters: { buyerId: getBuyersStub() },
      } as any)
    ).toEqual({
      buyerId: getBuyersStub(),
    }));

  it('should select loadMoreHidden from state', () =>
    expect(PendingPageSelectors.loadMoreHidden({ loadMoreHidden: false } as any)).toBeFalsy());

  it('should select sortedColumnData from state', () =>
    expect(PendingPageSelectors.sortedColumnData({ sortedColumnData: {} } as any)).toEqual({}));

  it('should select appliedFilters from state and return an object with some values', () =>
    expect(
      PendingPageSelectors.appliedFilters({
        filters: { invoiceNumber: ['1'] },
      } as any)
    ).toEqual({
      invoiceNumber: ['1'],
    }));

  it('should select canRefreshPage from state', () =>
    expect(PendingPageSelectors.canRefreshPage({ canRefreshPage: true } as any)).toBeTruthy());
});
