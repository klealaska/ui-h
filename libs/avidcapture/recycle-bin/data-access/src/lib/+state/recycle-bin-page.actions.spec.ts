import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { getAdvancedFilterStub, getBuyersStub } from '@ui-coe/avidcapture/shared/test';
import { SortDirection } from '@ui-coe/avidcapture/shared/types';

import * as actions from './recycle-bin-page.actions';

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

  describe('QueryRecycleBinDocuments', () => {
    beforeEach(() => store.dispatch(new actions.QueryRecycleBinDocuments()));

    it('should dispatch QueryRecycleBinDocuments action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryRecycleBinDocuments());
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

  describe('UpdateRecycleBinQueueInvoiceOnLock', () => {
    beforeEach(() =>
      store.dispatch(new actions.UpdateRecycleBinQueueInvoiceOnLock('1', 'mockUser'))
    );

    it('should dispatch UpdateRecycleBinQueueInvoiceOnLock action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateRecycleBinQueueInvoiceOnLock('1', 'mockUser')
      );
    });
  });

  describe('UpdateRecycleBinQueueInvoiceOnUnlock', () => {
    beforeEach(() => store.dispatch(new actions.UpdateRecycleBinQueueInvoiceOnUnlock('1')));

    it('should dispatch UpdateRecycleBinQueueInvoiceOnUnlock action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateRecycleBinQueueInvoiceOnUnlock('1')
      );
    });
  });

  describe('UpdateRecycleBinQueueOnInvoiceSubmit', () => {
    beforeEach(() => store.dispatch(new actions.UpdateRecycleBinQueueOnInvoiceSubmit('1')));

    it('should dispatch UpdateRecycleBinQueueOnInvoiceSubmit action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateRecycleBinQueueOnInvoiceSubmit('1')
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

  describe('SetRecycleBinPageSignalEvents', () => {
    beforeEach(() => store.dispatch(new actions.SetRecycleBinPageSignalEvents()));

    it('should dispatch SetRecycleBinPageSignalEvents action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetRecycleBinPageSignalEvents()
      );
    });
  });

  describe('RemoveRecycleBinPageSignalEvents', () => {
    beforeEach(() => store.dispatch(new actions.RemoveRecycleBinPageSignalEvents()));

    it('should dispatch RemoveRecycleBinPageSignalEvents action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.RemoveRecycleBinPageSignalEvents()
      );
    });
  });
});
