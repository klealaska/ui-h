import { DocumentState } from '@ui-coe/avidcapture/shared/data-access';
import {
  getAdvancedFilterStub,
  getBuyersStub,
  getDocuments,
  hasAllTheClaimsTokenStub,
  hasNoClaimsTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import { SortDirection } from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import { QueryArchivedInvoices, SetAdvanceFilters } from './archive-page.actions';
import { ArchivePageState } from './archive-page.state';

describe('ArchivePageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };
  const xdcServiceStub = {
    postSearch: jest.fn(),
    postArchive: jest.fn(),
    postAggregateSearch: jest.fn(),
  };
  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };
  const documentSearchHelperServiceStub = {
    getSearchRequestBody: jest.fn(),
    getAggregateRequestBody: jest.fn(),
    getColumnSortedData: jest.fn(),
    getContainsAggregateRequest: jest.fn(),
  };
  const pageHelperServiceStub = {
    getDateRange: jest.fn(),
  };

  const bkwServiceStub = {
    postAggregateSearch: jest.fn(),
  };

  const toastServiceStub = {
    error: jest.fn(),
    success: jest.fn(),
  };

  const viewPortStub = {
    scrollToPosition: jest.fn(),
  };
  const storeStub = {
    selectSnapshot: jest.fn(cb =>
      cb({
        core: {
          filteredBuyers: [{ id: '25', name: 'test' }],
          userAccount: {
            preferred_username: 'mock@username',
          },
        },
      })
    ),
  };

  const archivePageState = new ArchivePageState(
    xdcServiceStub as any,
    retryServiceStub as any,
    documentSearchHelperServiceStub as any,
    pageHelperServiceStub as any,
    bkwServiceStub as any,
    toastServiceStub as any,
    viewPortStub as any,
    storeStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () => {
      const invoices = getDocuments();

      expect(ArchivePageState.data({ invoices } as any)).toStrictEqual({ invoices });
    });
  });

  describe('Action: ngxsOnInit', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({ filters: { buyerId: [] } });
      archivePageState.ngxsOnInit(stateContextStub);
    });

    it('should patchState for filters and default sort after orgId check', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        filters: {
          buyerId: [],
          isSubmitted: [1],
        },
        sortedColumnData: { dateSubmitted: SortDirection.Descending },
      }));
  });

  describe('Action: QueryArchivedInvoices', () => {
    const documentsStub = getDocuments();

    describe('When user does not has SponsorMgr role', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: hasNoClaimsTokenStub,
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
          },
          scrollPosition: [0, 0],
        });
        xdcServiceStub.postArchive.mockReturnValue(of(documentsStub));
      });

      it('should return documents', done => {
        archivePageState.queryArchivedInvoices(stateContextStub).subscribe(val => {
          expect(val).toEqual(documentsStub);
          done();
        });
      });
    });

    describe('When user has SponsorMgr role', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: hasAllTheClaimsTokenStub,
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
          },
          scrollPosition: [0, 0],
        });
        xdcServiceStub.postSearch.mockReturnValue(of(documentsStub));
      });

      it('should return documents', done => {
        archivePageState.queryArchivedInvoices(stateContextStub).subscribe(val => {
          expect(val).toEqual(documentsStub);
          done();
        });
      });
    });
  });

  describe('Action: QueryBuyerLookAhead', () => {
    const documentsStub = getDocuments();

    beforeEach(() => {
      bkwServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
    });

    it('should return documents', done => {
      archivePageState
        .queryBuyerLookAhead(stateContextStub, { searchValue: 'Avidxchange, Inc' })
        .subscribe(val => {
          expect(val).toEqual(documentsStub);
          done();
        });
    });
  });

  describe('Action: QueryAllBuyersLookAhead', () => {
    const documentsStub = getDocuments();

    beforeEach(() => {
      bkwServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
    });

    it('should return documents', done => {
      archivePageState
        .queryAllBuyersLookAhead(stateContextStub, { searchValue: 'Avidxchange, Inc' })
        .subscribe(val => {
          expect(val).toEqual(documentsStub);
          done();
        });
    });
  });

  describe('Action: SetFilteredBuyers', () => {
    const filteredBuyersStub = getBuyersStub();

    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setFilteredBuyers');
      archivePageState.setFilteredBuyers(stateContextStub, { filteredBuyers: filteredBuyersStub });
    });

    it('should call the parents setFilteredBuyers method', () =>
      expect(DocumentState.prototype.setFilteredBuyers).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { filteredBuyers: filteredBuyersStub }
      ));

    it('should dispatch QueryArchivedInvoices action', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryArchivedInvoices()));
  });

  describe('Action: SetAdvanceFilters', () => {
    describe('when contains search is successful', () => {
      const filtersStub = getAdvancedFilterStub();

      const existingFilters = {
        ...filtersStub,
        isSubmitted: [1],
      };

      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'setAdvanceFilters').mockImplementation(() => of([]));
        stateContextStub.getState.mockReturnValue({
          defaultPageFilters: {
            isSubmitted: [1],
          },
        });
      });

      it('should dispatch QueryArchivedInvoices action', done => {
        archivePageState
          .setAdvanceFilters(stateContextStub, {
            filters: filtersStub,
          })
          .subscribe(() => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
              1,
              new QueryArchivedInvoices()
            );
            done();
          });
      });

      it('should call the parents setAdvanceFilters method', () => {
        archivePageState.setAdvanceFilters(stateContextStub, {
          filters: filtersStub,
        });
        expect(DocumentState.prototype.setAdvanceFilters).toHaveBeenNthCalledWith(
          1,
          stateContextStub,
          { filters: existingFilters, newFilters: filtersStub }
        );
      });
    });

    describe('when contains search errors', () => {
      const filtersStub = getAdvancedFilterStub();

      beforeEach(() => {
        jest
          .spyOn(DocumentState.prototype, 'setAdvanceFilters')
          .mockImplementation(() => throwError(() => ({ status: 404 })));
      });

      it('should dispatch QueryArchivedInvoices action', done => {
        archivePageState
          .setAdvanceFilters(stateContextStub, {
            filters: filtersStub,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
                1,
                new QueryArchivedInvoices()
              );
              done();
            },
          });
      });
    });
  });

  describe('Action: SetColumnSortedData', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setColumnSortedData');
      documentSearchHelperServiceStub.getColumnSortedData.mockReturnValue({});
      stateContextStub.getState.mockReturnValue({ searchFields: [] });
      archivePageState.setColumnSortedData(stateContextStub, {
        columnData: { active: 'fileName', direction: SortDirection.Ascending },
      });
    });

    it('should call the parents setColumnSortedData method', () =>
      expect(DocumentState.prototype.setColumnSortedData).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { columnData: { active: 'fileName', direction: SortDirection.Ascending } }
      ));

    it('should dispatch QueryArchivedInvoices action', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryArchivedInvoices()));
  });

  describe('Action: SetScrollPosition', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setScrollPosition');
      archivePageState.setScrollPosition(stateContextStub, { scrollPosition: [0, 2000] });
    });

    it('should call the parents setScrollPosition method', () =>
      expect(DocumentState.prototype.setScrollPosition).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { scrollPosition: [0, 2000] }
      ));
  });

  describe('Action: ScrollToPosition', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'scrollToPosition');
      archivePageState.scrollToPosition(stateContextStub);
    });

    it('should call the parents scrollToPosition method', () =>
      expect(DocumentState.prototype.scrollToPosition).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: ResetPageNumber', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'resetPageNumber');
      archivePageState.resetPageNumber(stateContextStub);
    });

    it('should call the parents resetPageNumber method', () =>
      expect(DocumentState.prototype.resetPageNumber).toHaveBeenNthCalledWith(1, stateContextStub));
  });

  describe('Action: SetSearchFields', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setSearchFields').mockImplementation();
      archivePageState.setSearchFields(stateContextStub, { searchFields: [] });
    });

    it('should call the parents setSearchFields method', () =>
      expect(DocumentState.prototype.setSearchFields).toHaveBeenNthCalledWith(1, stateContextStub, {
        searchFields: [],
      }));
  });

  describe('Action: RemoveFilter', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'removeFilter').mockImplementation();
      stateContextStub.getState.mockReturnValue({ filters: getAdvancedFilterStub() });
      archivePageState.removeFilter(stateContextStub, { filterKey: '' });
    });

    it('should call the parents removeFilter method', () =>
      expect(DocumentState.prototype.removeFilter).toHaveBeenNthCalledWith(1, stateContextStub, {
        filterKey: '',
      }));

    it('should dispatch SetAdvanceFilters action', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
        1,
        new SetAdvanceFilters(getAdvancedFilterStub())
      ));
  });

  describe('Action: EnablePageRefresh', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'enablePageRefresh').mockImplementation();
      archivePageState.enablePageRefresh(stateContextStub);
    });

    it('should call the parents enablePageRefresh method', () =>
      expect(DocumentState.prototype.enablePageRefresh).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: DisablePageRefresh', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'disablePageRefresh').mockImplementation();
      archivePageState.disablePageRefresh(stateContextStub);
    });

    it('should call the parents disablePageRefresh method', () =>
      expect(DocumentState.prototype.disablePageRefresh).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: UpdateArchiveQueueWithNoSUBuyers', () => {
    beforeEach(() => {
      archivePageState.updateArchiveQueueWithNoSUBuyers(stateContextStub);
    });

    it('should patchState for invoices to empty array and loadMoreHidden to true', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        invoices: [],
        loadMoreHidden: true,
      }));
  });
});
