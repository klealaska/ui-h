import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { getAdvancedFilterStub, getBuyersStub } from '@ui-coe/avidcapture/shared/test';
import { SortDirection } from '@ui-coe/avidcapture/shared/types';

import * as actions from './research-page.actions';

describe('Research Page Actions', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  describe('QueryQueueInvoices', () => {
    beforeEach(() => store.dispatch(new actions.QueryResearchInvoices()));

    it('should dispatch QueryQueueInvoices action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryResearchInvoices());
    });
  });

  describe('QueryBuyerLookAhead', () => {
    beforeEach(() => store.dispatch(new actions.QueryBuyerLookAhead('test')));

    it('should dispatch QueryBuyerLookAhead action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryBuyerLookAhead('test'));
    });
  });

  describe('QueryAllBuyersLookAhead', () => {
    beforeEach(() => store.dispatch(new actions.QueryAllBuyersLookAhead('test')));

    it('should dispatch QueryAllBuyersLookAhead action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.QueryAllBuyersLookAhead('test')
      );
    });
  });

  describe('SetFilteredBuyer', () => {
    beforeEach(() => store.dispatch(new actions.SetFilteredBuyers(getBuyersStub())));

    it('should dispatch SetFilteredBuyers action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetFilteredBuyers(getBuyersStub())
      );
    });
  });

  describe('SetAdvanceFilters', () => {
    const advFilters = getAdvancedFilterStub();

    beforeEach(() => store.dispatch(new actions.SetAdvanceFilters(advFilters)));

    it('should dispatch SetAdvanceFilters action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetAdvanceFilters(advFilters));
    });
  });

  describe('SetColumnSortedData', () => {
    beforeEach(() =>
      store.dispatch(
        new actions.SetColumnSortedData({ active: 'fileName', direction: SortDirection.Ascending })
      )
    );

    it('should dispatch SetColumnSortedData action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetColumnSortedData({ active: 'fileName', direction: SortDirection.Ascending })
      );
    });
  });

  describe('SetScrollPosition', () => {
    beforeEach(() => store.dispatch(new actions.SetScrollPosition([0, 0])));

    it('should dispatch SetScrollPosition action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetScrollPosition([0, 0]));
    });
  });

  describe('ScrollToPosition', () => {
    beforeEach(() => store.dispatch(new actions.ScrollToPosition()));

    it('should dispatch ScrollToPosition action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ScrollToPosition());
    });
  });

  describe('ResetPageNumber', () => {
    beforeEach(() => store.dispatch(new actions.ResetPageNumber()));

    it('should dispatch ResetPageNumber action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ResetPageNumber());
    });
  });

  describe('SetSearchFields', () => {
    beforeEach(() => store.dispatch(new actions.SetSearchFields(['mock'])));

    it('should dispatch SetSearchFields action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetSearchFields(['mock']));
    });
  });

  describe('UpdateResearchQueueInvoiceOnLock', () => {
    beforeEach(() => store.dispatch(new actions.UpdateResearchQueueInvoiceOnLock('1', 'mockUser')));

    it('should dispatch UpdateResearchQueueInvoiceOnLock action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateResearchQueueInvoiceOnLock('1', 'mockUser')
      );
    });
  });

  describe('UpdateResearchQueueInvoiceOnUnlock', () => {
    beforeEach(() => store.dispatch(new actions.UpdateResearchQueueInvoiceOnUnlock('1')));

    it('should dispatch UpdateResearchQueueInvoiceOnUnlock action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateResearchQueueInvoiceOnUnlock('1')
      );
    });
  });

  describe('UpdateResearchQueueOnInvoiceSubmit', () => {
    beforeEach(() => store.dispatch(new actions.UpdateResearchQueueOnInvoiceSubmit('1')));

    it('should dispatch UpdateResearchQueueOnInvoiceSubmit action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateResearchQueueOnInvoiceSubmit('1')
      );
    });
  });

  describe('RemoveFilter', () => {
    beforeEach(() => store.dispatch(new actions.RemoveFilter('invoiceNumber')));

    it('should dispatch RemoveFilter action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RemoveFilter('invoiceNumber'));
    });
  });

  describe('RemoveEscalationFilter', () => {
    beforeEach(() => store.dispatch(new actions.RemoveEscalationFilter('mock')));

    it('should dispatch RemoveEscalationFilter action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RemoveEscalationFilter('mock'));
    });
  });

  describe('RemoveExposedFilter', () => {
    describe('when string is passed in', () => {
      beforeEach(() => store.dispatch(new actions.RemoveExposedFilter('mock')));

      it('should dispatch RemoveExposedFilter action with passed in string', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RemoveExposedFilter('mock'));
      });
    });

    describe('when string is NOT passed in', () => {
      beforeEach(() => store.dispatch(new actions.RemoveExposedFilter()));

      it('should dispatch RemoveExposedFilter action with an empty string', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RemoveExposedFilter(''));
      });
    });
  });

  describe('EnablePageRefresh', () => {
    beforeEach(() => store.dispatch(new actions.EnablePageRefresh()));

    it('should dispatch EnablePageRefresh action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.EnablePageRefresh());
    });
  });

  describe('DisablePageRefresh', () => {
    beforeEach(() => store.dispatch(new actions.DisablePageRefresh()));

    it('should dispatch DisablePageRefresh action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.DisablePageRefresh());
    });
  });

  describe('CreateQueuesNotAllowedList', () => {
    beforeEach(() => store.dispatch(new actions.CreateQueuesNotAllowedList(['mock'])));

    it('should dispatch CreateQueuesNotAllowedList action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.CreateQueuesNotAllowedList(['mock'])
      );
    });
  });

  describe('SetResearchPageSignalEvents', () => {
    beforeEach(() => store.dispatch(new actions.SetResearchPageSignalEvents()));

    it('should dispatch SetResearchPageSignalEvents action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetResearchPageSignalEvents());
    });
  });

  describe('RemoveResearchPageSignalEvents', () => {
    beforeEach(() => store.dispatch(new actions.RemoveResearchPageSignalEvents()));

    it('should dispatch RemoveResearchPageSignalEvents action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.RemoveResearchPageSignalEvents()
      );
    });
  });

  describe('QueryExposedFiltersCounts', () => {
    beforeEach(() => store.dispatch(new actions.QueryExposedFiltersCounts()));

    it('should dispatch QueryExposedFiltersCounts action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryExposedFiltersCounts());
    });
  });

  describe('BatchDeletion', () => {
    beforeEach(() => store.dispatch(new actions.BatchDeletion([])));

    it('should dispatch BatchDeletion action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.BatchDeletion([]));
    });
  });

  describe('BatchDownload', () => {
    beforeEach(() => store.dispatch(new actions.BatchDownload([])));

    it('should dispatch BatchDownload action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.BatchDownload([]));
    });
  });
});
