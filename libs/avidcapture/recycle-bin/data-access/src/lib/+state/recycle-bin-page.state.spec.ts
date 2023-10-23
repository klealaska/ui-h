import { DocumentState } from '@ui-coe/avidcapture/shared/data-access';
import {
  getAdvancedFilterStub,
  getBuyersStub,
  getDocuments,
} from '@ui-coe/avidcapture/shared/test';
import { AppPages, EscalationCategoryTypes, SortDirection } from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import {
  QueryRecycleBinDocuments,
  SetAdvanceFilters,
  UpdateRecycleBinQueueInvoiceOnLock,
  UpdateRecycleBinQueueInvoiceOnUnlock,
  UpdateRecycleBinQueueOnInvoiceSubmit,
} from './recycle-bin-page.actions';
import { RecycleBinPageState } from './recycle-bin-page.state';

const hubConnectionSpy = { on: jest.fn(), off: jest.fn() };

describe('RecycleBinPageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };

  const xdcServiceStub = {
    postSearch: jest.fn(),
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
    select: jest.fn(),
    selectSnapshot: jest.fn(cb =>
      cb({
        core: {
          filteredBuyers: [{ id: '25', name: 'test' }],
          hubConnection: hubConnectionSpy,
        },
      })
    ),
  };

  const recycleBinPageState = new RecycleBinPageState(
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
    it('should select all data from state', () =>
      expect(RecycleBinPageState.data({ invoices: [getDocuments()[0]] } as any)).toStrictEqual({
        invoices: [getDocuments()[0]],
      }));
  });

  describe('Action: QueryRecycleBinDocuments', () => {
    const documentsStub = getDocuments();
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        invoices: [],
        pageNumber: 1,
        sortedColumnData: {},
        filters: {
          buyerId: [],
        },
        searchFields: [],
        scrollPosition: [0, 0],
        core: {
          orgIds: ['1'],
          currentPage: AppPages.RecycleBin,
        },
      });
      xdcServiceStub.postSearch.mockReturnValue(of(documentsStub));
    });

    it('should return documents', done => {
      recycleBinPageState.queryRecycleBinDocuments(stateContextStub).subscribe(val => {
        expect(val).toEqual(documentsStub);
        done();
      });
    });
  });

  describe('Action: QueryBuyerLookAhead', () => {
    const documentsStub = getDocuments();

    beforeEach(() => {
      bkwServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
    });

    it('should return documents', done => {
      recycleBinPageState
        .queryBuyerLookAhead(stateContextStub, { searchValue: 'Avidxchange' })
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
      recycleBinPageState
        .queryAllBuyersLookAhead(stateContextStub, { searchValue: 'Avidxchange' })
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
      recycleBinPageState.setFilteredBuyers(stateContextStub, {
        filteredBuyers: filteredBuyersStub,
      });
    });

    it('should call the parents setFilteredBuyers method', () =>
      expect(DocumentState.prototype.setFilteredBuyers).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { filteredBuyers: filteredBuyersStub }
      ));

    it('should dispatch QueryRecycleBinDocuments action', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryRecycleBinDocuments()));
  });

  describe('Action: SetAdvanceFilters', () => {
    describe('when contains search is successful', () => {
      const filtersStub = getAdvancedFilterStub();
      delete filtersStub.escalationCategoryIssue;

      const existingFilters = {
        ...filtersStub,
        escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
        isSubmitted: [0],
      };

      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'setAdvanceFilters').mockImplementation(() => of([]));
        stateContextStub.getState.mockReturnValue({
          defaultPageFilters: {
            escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
            isSubmitted: [0],
          },
        });
      });

      it('should dispatch QueryRecycleBinDocuments action', done => {
        recycleBinPageState
          .setAdvanceFilters(stateContextStub, {
            filters: filtersStub,
          })
          .subscribe(() => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
              1,
              new QueryRecycleBinDocuments()
            );
            done();
          });
      });

      it('should patchState for needsDefaultDateRange as true', () => {
        recycleBinPageState.setAdvanceFilters(stateContextStub, {
          filters: filtersStub,
        });

        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          needsDefaultDateRange: false,
        });
      });

      it('should call the parents setAdvanceFilters method', () => {
        recycleBinPageState.setAdvanceFilters(stateContextStub, {
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

      it('should dispatch QueryRecycleBinDocuments action', done => {
        recycleBinPageState
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
                new QueryRecycleBinDocuments()
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
      recycleBinPageState.setColumnSortedData(stateContextStub, {
        columnData: { active: 'fileName', direction: SortDirection.Ascending },
      });
    });

    it('should call the parents setColumnSortedData method', () =>
      expect(DocumentState.prototype.setColumnSortedData).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { columnData: { active: 'fileName', direction: SortDirection.Ascending } }
      ));
  });

  describe('Action: ResetPageNumber', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'resetPageNumber');
      recycleBinPageState.resetPageNumber(stateContextStub);
    });

    it('should call the parents resetPageNumber method', () =>
      expect(DocumentState.prototype.resetPageNumber).toHaveBeenNthCalledWith(1, stateContextStub));
  });

  describe('Action: SetScrollPosition', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setScrollPosition');
      recycleBinPageState.setScrollPosition(stateContextStub, { scrollPosition: [0, 2000] });
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
      recycleBinPageState.scrollToPosition(stateContextStub);
    });

    it('should call the parents scrollToPosition method', () =>
      expect(DocumentState.prototype.scrollToPosition).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: SetSearchFields', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setSearchFields').mockImplementation();
      recycleBinPageState.setSearchFields(stateContextStub, { searchFields: [] });
    });

    it('should call the parents setSearchFields method', () =>
      expect(DocumentState.prototype.setSearchFields).toHaveBeenNthCalledWith(1, stateContextStub, {
        searchFields: [],
      }));
  });

  describe('Action: UpdateRecycleBinQueueInvoiceOnLock', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueInvoiceOnLock');
      stateContextStub.getState.mockReturnValue({
        invoices: [getDocuments()[0]],
      });
      recycleBinPageState.updateRecycleBinQueueInvoiceOnLock(stateContextStub, {
        documentId: '1',
        lockedBy: 'mock man',
      });
    });

    it('should call the parents updateQueueInvoiceOnLock method', () =>
      expect(DocumentState.prototype.updateQueueInvoiceOnLock).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        {
          documentId: '1',
          lockedBy: 'mock man',
        }
      ));
  });

  describe('Action: UpdateRecycleBinQueueInvoiceOnUnlock', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueInvoiceOnUnlock');
      stateContextStub.getState.mockReturnValue({
        invoices: [getDocuments()[0]],
      });
      recycleBinPageState.updateRecycleBinQueueInvoiceOnUnlock(stateContextStub, {
        documentId: '1',
      });
    });

    it('should call the parents updateQueueInvoiceOnUnlock method', () =>
      expect(DocumentState.prototype.updateQueueInvoiceOnUnlock).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        {
          documentId: '1',
        }
      ));
  });

  describe('Action: UpdateRecycleBinQueueOnInvoiceSubmit', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueOnInvoiceSubmit').mockImplementation();
      recycleBinPageState.updateRecycleBinQueueOnInvoiceSubmit(stateContextStub, {
        documentId: '1',
      });
    });

    it('should call the parents updateQueueOnInvoiceSubmit method', () =>
      expect(DocumentState.prototype.updateQueueOnInvoiceSubmit).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        {
          documentId: '1',
        }
      ));
  });

  describe('Action: RemoveFilter', () => {
    describe('when filters.dateReceived IS UNDEFINED', () => {
      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'removeFilter').mockImplementation();
        stateContextStub.getState.mockReturnValue({ filters: { buyerId: ['25'] } });
        recycleBinPageState.removeFilter(stateContextStub, { filterKey: '' });
      });

      it('should call the parents removeFilter method', () =>
        expect(DocumentState.prototype.removeFilter).toHaveBeenNthCalledWith(1, stateContextStub, {
          filterKey: '',
        }));

      it('should patchState for needsDefaultDateRange as true', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          needsDefaultDateRange: true,
        }));

      it('should dispatch SetAdvanceFilters action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetAdvanceFilters({ buyerId: ['25'] as any })
        ));
    });

    describe('when filters.dateReceived IS NOT UNDEFINED', () => {
      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'removeFilter').mockImplementation();
        stateContextStub.getState.mockReturnValue({
          filters: { buyerId: ['25'], dateReceived: ['1/25/22', '1/26/22'] },
        });
        recycleBinPageState.removeFilter(stateContextStub, { filterKey: '' });
      });

      it('should call the parents removeFilter method', () =>
        expect(DocumentState.prototype.removeFilter).toHaveBeenNthCalledWith(1, stateContextStub, {
          filterKey: '',
        }));

      it('should patchState for needsDefaultDateRange as false', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          needsDefaultDateRange: false,
        }));

      it('should dispatch SetAdvanceFilters action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetAdvanceFilters({ buyerId: ['25'] as any, dateReceived: ['1/25/22', '1/26/22'] })
        ));
    });
  });

  describe('Action: EnablePageRefresh', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'enablePageRefresh').mockImplementation();
      recycleBinPageState.enablePageRefresh(stateContextStub);
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
      recycleBinPageState.disablePageRefresh(stateContextStub);
    });

    it('should call the parents disablePageRefresh method', () =>
      expect(DocumentState.prototype.disablePageRefresh).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: SetRecycleBinPageSignalEvents', () => {
    describe('when hubconnection is NOT NULL', () => {
      beforeEach(() => {
        hubConnectionSpy.on
          .mockImplementationOnce((obj, cb) => {
            cb('docId', 'mockUser');
          })
          .mockImplementationOnce((obj, cb) => {
            cb('docId');
          })
          .mockImplementationOnce((obj, cb) => {
            cb('docId');
          })
          .mockImplementationOnce((obj, cb) => {
            cb('docId');
          });
        recycleBinPageState.setRecycleBinPageSignalEvents(stateContextStub);
      });

      it('should dispatch UpdateRecycleBinQueueInvoiceOnLock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new UpdateRecycleBinQueueInvoiceOnLock('docId', 'mockUser')
        ));

      it('should dispatch UpdateRecycleBinQueueInvoiceOnUnlock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new UpdateRecycleBinQueueInvoiceOnUnlock('docId')
        ));

      it('should dispatch UpdateRecycleBinQueueOnInvoiceSubmit action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new UpdateRecycleBinQueueOnInvoiceSubmit('docId')
        ));

      it('should dispatch UpdateRecycleBinQueueOnInvoiceSubmit action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          4,
          new UpdateRecycleBinQueueOnInvoiceSubmit('docId')
        ));
    });

    describe('when hubconnection is NULL', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '1337', name: 'test' }],
              userAccount: {
                preferred_username: 'sourceEmail',
              },
              hubConnection: null,
            },
          })
        );

        recycleBinPageState.setRecycleBinPageSignalEvents(stateContextStub);
      });

      it('should NOT call hubConnections on method', () =>
        expect(hubConnectionSpy.on).not.toHaveBeenCalled());
    });
  });

  describe('Action: RemoveRecycleBinPageSignalEvents', () => {
    beforeEach(() => {
      recycleBinPageState.removeRecycleBinPageSignalEvents();
    });

    it('should call hubConnections off fn for onRecycleBinLock', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(1, 'onRecycleBinLock'));

    it('should call hubConnections off fn for onRecycleBinUnlock', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(2, 'onRecycleBinUnlock'));

    it('should call hubConnections off fn for onInvoiceSubmit', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(3, 'onInvoiceSubmit'));

    it('should call hubConnections off fn for onEscalationSubmit', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(4, 'onEscalationSubmit'));
  });
});
