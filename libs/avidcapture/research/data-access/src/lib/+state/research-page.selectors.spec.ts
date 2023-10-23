import { getBuyersStub, getDocuments } from '@ui-coe/avidcapture/shared/test';
import { EscalationCategoryTypes } from '@ui-coe/avidcapture/shared/types';

import { ResearchPageSelectors } from './research-page.selectors';

describe('ResearchPageSelectors', () => {
  it('should select researchInvoices from state', () => {
    const invoices = getDocuments();

    expect(ResearchPageSelectors.researchInvoices({ invoices } as any)).toEqual(invoices);
  });

  it('should select buyers from state', () => {
    const buyers = getBuyersStub();

    expect(ResearchPageSelectors.buyers({ buyers } as any)).toEqual(buyers);
  });

  it('should select filteredBuyers from state', () => {
    expect(ResearchPageSelectors.filteredBuyers({ filteredBuyers: [] } as any)).toEqual([]);
  });

  it('should select advancedFilters from state', () => {
    expect(
      ResearchPageSelectors.advancedFilters({ filters: { buyerId: getBuyersStub() } } as any)
    ).toEqual({
      buyerId: getBuyersStub(),
    });
  });

  it('should select loadMoreHidden from state', () => {
    expect(ResearchPageSelectors.loadMoreHidden({ loadMoreHidden: false } as any)).toBeFalsy();
  });

  it('should select sortedColumnData from state', () =>
    expect(ResearchPageSelectors.sortedColumnData({ sortedColumnData: {} } as any)).toEqual({}));

  it('should select appliedFilters from state and return an object with some values', () =>
    expect(
      ResearchPageSelectors.appliedFilters({
        filters: { invoiceNumber: ['1'] },
      } as any)
    ).toEqual({
      invoiceNumber: ['1'],
    }));

  it('should select canRefreshPage from state', () =>
    expect(ResearchPageSelectors.canRefreshPage({ canRefreshPage: true } as any)).toBeTruthy());

  it('should select queuesNotAllowedList from state', () =>
    expect(ResearchPageSelectors.queuesNotAllowedList({ queuesNotAllowedList: [] } as any)).toEqual(
      []
    ));

  describe('exposedFilters', () => {
    describe('when exposedFilters has data with counts of 0', () => {
      const exposedFiltersStub = [
        {
          name: EscalationCategoryTypes.SupplierResearch,
          count: 1,
          show: true,
        },
        {
          name: EscalationCategoryTypes.DuplicateResearch,
          count: 2,
          show: true,
        },
        {
          name: EscalationCategoryTypes.ImageIssue,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.NonInvoiceDocument,
          count: 3,
          show: true,
        },
        {
          name: EscalationCategoryTypes.ShipToResearch,
          count: 0,
          show: false,
        },
      ];

      it('should select exposedFilters from state that have counts > 0', () =>
        expect(
          ResearchPageSelectors.exposedFilters({ exposedFilters: exposedFiltersStub } as any, [])
        ).toEqual(
          expect.arrayContaining([
            {
              name: EscalationCategoryTypes.SupplierResearch,
              count: 1,
              show: true,
            },
            {
              name: EscalationCategoryTypes.DuplicateResearch,
              count: 2,
              show: true,
            },
            {
              name: EscalationCategoryTypes.NonInvoiceDocument,
              count: 3,
              show: true,
            },
          ])
        ));
    });

    describe('when exposedFilters has data with counts above 0 but are not allowed allowed to see that queue', () => {
      const exposedFiltersStub = [
        {
          name: EscalationCategoryTypes.SupplierResearch,
          count: 1,
          show: true,
        },
        {
          name: EscalationCategoryTypes.DuplicateResearch,
          count: 2,
          show: true,
        },
        {
          name: EscalationCategoryTypes.ImageIssue,
          count: 1,
          show: true,
        },
        {
          name: EscalationCategoryTypes.NonInvoiceDocument,
          count: 3,
          show: true,
        },
        {
          name: EscalationCategoryTypes.ShipToResearch,
          count: 4,
          show: true,
        },
      ];
      const queuesNotAllowedListStub = [`-${EscalationCategoryTypes.ShipToResearch}`];

      it('should select exposedFilters from state that have counts > 0', () =>
        expect(
          ResearchPageSelectors.exposedFilters(
            { exposedFilters: exposedFiltersStub } as any,
            queuesNotAllowedListStub
          )
        ).toEqual(
          expect.arrayContaining([
            {
              name: EscalationCategoryTypes.SupplierResearch,
              count: 1,
              show: true,
            },
            {
              name: EscalationCategoryTypes.DuplicateResearch,
              count: 2,
              show: true,
            },
            {
              name: EscalationCategoryTypes.ImageIssue,
              count: 1,
              show: true,
            },
            {
              name: EscalationCategoryTypes.NonInvoiceDocument,
              count: 3,
              show: true,
            },
          ])
        ));
    });

    describe('when exposedFilters has data with counts above 0 but SHOW flag is off', () => {
      const exposedFiltersStub = [
        {
          name: EscalationCategoryTypes.SupplierResearch,
          count: 5,
          show: true,
        },
        {
          name: EscalationCategoryTypes.DuplicateResearch,
          count: 2,
          show: false,
        },
        {
          name: EscalationCategoryTypes.ImageIssue,
          count: 1,
          show: true,
        },
        {
          name: EscalationCategoryTypes.NonInvoiceDocument,
          count: 3,
          show: false,
        },
        {
          name: EscalationCategoryTypes.ShipToResearch,
          count: 0,
          show: true,
        },
      ];

      it('should select exposedFilters from state that have counts > 0 && SHOW flag on', () =>
        expect(
          ResearchPageSelectors.exposedFilters({ exposedFilters: exposedFiltersStub } as any, [])
        ).toEqual(
          expect.arrayContaining([
            {
              name: EscalationCategoryTypes.SupplierResearch,
              count: 5,
              show: true,
            },
            {
              name: EscalationCategoryTypes.ImageIssue,
              count: 1,
              show: true,
            },
          ])
        ));
    });
  });
});
