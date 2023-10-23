import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { getAdvancedFilterStub, getBuyersStub } from '@ui-coe/avidcapture/shared/test';
import { SortDirection } from '@ui-coe/avidcapture/shared/types';

import * as actions from './pending-page.actions';

describe('Pending Page Actions', () => {
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
    beforeEach(() => store.dispatch(new actions.QueryQueueInvoices()));

    it('should dispatch QueryQueueInvoices action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryQueueInvoices());
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
    beforeEach(() => store.dispatch(new actions.SetFilteredBuyer(getBuyersStub())));

    it('should dispatch SetFilteredBuyers action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetFilteredBuyer(getBuyersStub())
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

  describe('UpdateQueueInvoiceOnLock', () => {
    beforeEach(() => store.dispatch(new actions.UpdateQueueInvoiceOnLock('1', 'mockUser')));

    it('should dispatch UpdateQueueInvoiceOnLock action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateQueueInvoiceOnLock('1', 'mockUser')
      );
    });
  });

  describe('UpdateQueueInvoiceOnUnlock', () => {
    beforeEach(() => store.dispatch(new actions.UpdateQueueInvoiceOnUnlock('1')));

    it('should dispatch UpdateQueueInvoiceOnUnlock action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateQueueInvoiceOnUnlock('1')
      );
    });
  });

  describe('UpdateQueueOnInvoiceSubmit', () => {
    beforeEach(() => store.dispatch(new actions.UpdateQueueOnInvoiceSubmit('1')));

    it('should dispatch UpdateQueueOnInvoiceSubmit action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateQueueOnInvoiceSubmit('1')
      );
    });
  });

  describe('RemoveFilter', () => {
    beforeEach(() => store.dispatch(new actions.RemoveFilter('invoiceNumber')));

    it('should dispatch RemoveFilter action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RemoveFilter('invoiceNumber'));
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

  describe('SetPendingPageSignalEvents', () => {
    beforeEach(() => store.dispatch(new actions.SetPendingPageSignalEvents()));

    it('should dispatch SetPendingPageSignalEvents action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetPendingPageSignalEvents());
    });
  });

  describe('RemovePendingPageSignalEvents', () => {
    beforeEach(() => store.dispatch(new actions.RemovePendingPageSignalEvents()));

    it('should dispatch RemovePendingPageSignalEvents action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.RemovePendingPageSignalEvents()
      );
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
