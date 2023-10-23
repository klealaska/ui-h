import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { getAdvancedFilterStub, getBuyersStub } from '@ui-coe/avidcapture/shared/test';
import { SearchFilters, SortDirection } from '@ui-coe/avidcapture/shared/types';

import * as actions from './document.actions';
import { DocumentStateModel } from './document.model';

const stateStub: DocumentStateModel = {
  invoices: [],
  buyers: [],
  filteredBuyers: [],
  filters: {
    buyerId: [],
  },
  defaultPageFilters: {
    buyerId: [],
  },
  aggregateFilters: null,
  sortedColumnData: {},
  loadMoreHidden: false,
  pageNumber: 1,
  scrollPosition: [0, 0],
  searchFields: [],
  canRefreshPage: true,
  needsDefaultDateRange: false,
};

describe('Document Actions', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    store.reset(stateStub);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  describe('QueryDocuments', () => {
    beforeEach(() => store.dispatch(new actions.QueryDocuments()));

    it('should dispatch QueryDocuments action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryDocuments());
    });
  });

  describe('QueryArchiveDocuments', () => {
    beforeEach(() => store.dispatch(new actions.QueryArchiveDocuments()));

    it('should dispatch QueryArchiveDocuments action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryArchiveDocuments());
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

  describe('SetFilteredBuyers', () => {
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
    const searchFilters: SearchFilters = {
      invoiceNumber: 1,
    } as any;

    beforeEach(() => store.dispatch(new actions.SetAdvanceFilters(advFilters, searchFilters)));

    it('should dispatch SetAdvanceFilters action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetAdvanceFilters(advFilters, searchFilters)
      );
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
