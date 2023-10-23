import {
  QueryDocumentCardSetCounts,
  UpdatePendingQueueCount,
  UpdateRecycleBinQueueCount,
} from '@ui-coe/avidcapture/core/data-access';
import { DocumentState } from '@ui-coe/avidcapture/shared/data-access';
import {
  getAdvancedFilterStub,
  getBuyersStub,
  getDocuments,
} from '@ui-coe/avidcapture/shared/test';
import {
  EscalationCategoryTypes,
  IngestionTypes,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import {
  QueryQueueInvoices,
  SetAdvanceFilters,
  UpdateQueueInvoiceOnLock,
  UpdateQueueInvoiceOnUnlock,
  UpdateQueueOnInvoiceSubmit,
} from './pending-page.actions';
import { PendingPageState } from './pending-page.state';

const hubConnectionSpy = { on: jest.fn(), off: jest.fn() };

describe('PendingPageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };
  const xdcServiceStub = {
    postSearch: jest.fn(),
    postAggregateSearch: jest.fn(),
    postMassEscalation: jest.fn(),
    getFile: jest.fn(),
  };
  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };
  const storeStub = {
    select: jest.fn(),
    selectSnapshot: jest.fn(cb =>
      cb({
        core: {
          filteredBuyers: [{ id: '1337', name: 'test' }],
          userAccount: {
            preferred_username: 'sourceEmail',
          },
          hubConnection: hubConnectionSpy,
        },
      })
    ),
  };
  const viewPortStub = {
    scrollToPosition: jest.fn(),
  };
  const documentSearchHelperServiceStub = {
    getSearchRequestBody: jest.fn(),
    getAggregateRequestBody: jest.fn(),
    getColumnSortedData: jest.fn(),
    getContainsAggregateRequest: jest.fn(),
    getMultipleContainsAggregateRequest: jest.fn(),
    getCountAggregateRequest: jest.fn(),
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

  const socketServiceStub = {
    getQueueCount: jest.fn(),
  };

  const queuePageState = new PendingPageState(
    xdcServiceStub as any,
    retryServiceStub as any,
    documentSearchHelperServiceStub as any,
    pageHelperServiceStub as any,
    bkwServiceStub as any,
    toastServiceStub as any,
    viewPortStub as any,
    storeStub as any,
    socketServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () =>
      expect(PendingPageState.data({ invoices: [getDocuments()[0]] } as any)).toStrictEqual({
        invoices: [getDocuments()[0]],
      }));
  });

  describe('Action: ngxsOnInit', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        filters: {
          buyerId: [{ id: '1', name: 'mock' }],
          isSubmitted: [0],
        },
      });
      queuePageState.ngxsOnInit(stateContextStub);
    });

    it('should patchState for filteredBuyers', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        filteredBuyers: [{ id: '1', name: 'mock' }],
      }));
  });

  describe('Action: QueryQueueInvoices', () => {
    const documentsStub = getDocuments();
    beforeEach(() => {
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
      queuePageState.queryQueueInvoices(stateContextStub).subscribe(val => {
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
      queuePageState
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
      queuePageState
        .queryAllBuyersLookAhead(stateContextStub, { searchValue: 'Avidxchange' })
        .subscribe(val => {
          expect(val).toEqual(documentsStub);
          done();
        });
    });
  });

  describe('Action: SetAdvanceFilters', () => {
    describe('when contains search is successful', () => {
      const filtersStub = getAdvancedFilterStub();
      delete filtersStub.escalationCategoryIssue;

      const existingFilters = {
        ...filtersStub,
        buyerId: [],
        escalationCategoryIssue: [EscalationCategoryTypes.None],
        ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
        // escalationLevel: [`-${EscalationLevelTypes.CustomerFacing}`],
        isSubmitted: [0],
      };

      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'setAdvanceFilters').mockImplementation(() => of([]));
        stateContextStub.getState.mockReturnValue({
          defaultPageFilters: {
            escalationCategoryIssue: [EscalationCategoryTypes.None],
            ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
            // escalationLevel: [`-${EscalationLevelTypes.CustomerFacing}`],
            isSubmitted: [0],
          },
        });
      });

      it('should dispatch QueryQueueInvoices & QueryDocumentCardSetCounts actions', done => {
        queuePageState
          .setAdvanceFilters(stateContextStub, {
            filters: filtersStub,
          })
          .subscribe(() => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
              new QueryQueueInvoices(),
              new QueryDocumentCardSetCounts(),
            ]);
            done();
          });
      });

      it('should call the parents setAdvanceFilters method', () => {
        queuePageState.setAdvanceFilters(stateContextStub, {
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

      it('should dispatch QueryQueueInvoices & QueryDocumentCardSetCounts actions', done => {
        queuePageState
          .setAdvanceFilters(stateContextStub, {
            filters: filtersStub,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
                new QueryQueueInvoices(),
                new QueryDocumentCardSetCounts(),
              ]);
              done();
            },
          });
      });
    });
  });

  describe('Action: SetFilteredBuyer', () => {
    const filteredBuyersStub = getBuyersStub();

    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setFilteredBuyers');
      stateContextStub.getState.mockReturnValue({ searchFields: [] });
      queuePageState.setFilteredBuyer(stateContextStub, {
        filteredBuyers: filteredBuyersStub,
      });
    });

    it('should call the parents setFilteredBuyers method', () =>
      expect(DocumentState.prototype.setFilteredBuyers).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { filteredBuyers: filteredBuyersStub }
      ));

    // it('should update logoutService initialState queue page filters buyerId', () =>
    //   expect(logoutServiceStub.initialState.queuePage.filters.buyerId).toEqual(filteredBuyersStub));

    it('should dispatch QueryQueueInvoices & QueryDocumentCardSetCounts actions', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new QueryQueueInvoices(),
        new QueryDocumentCardSetCounts(),
      ]));
  });

  describe('Action: setColumnSortedData', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setColumnSortedData');
      documentSearchHelperServiceStub.getColumnSortedData.mockReturnValue({});
      stateContextStub.getState.mockReturnValue({ searchFields: [] });
      queuePageState.setColumnSortedData(stateContextStub, {
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
      queuePageState.resetPageNumber(stateContextStub);
    });

    it('should call the parents resetPageNumber method', () =>
      expect(DocumentState.prototype.resetPageNumber).toHaveBeenNthCalledWith(1, stateContextStub));
  });

  describe('Action: UpdateQueueInvoiceOnLock', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueInvoiceOnLock');
      stateContextStub.getState.mockReturnValue({
        invoices: [getDocuments()[0]],
      });
      queuePageState.updateQueueInvoiceOnLock(stateContextStub, {
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

  describe('Action: UpdateQueueInvoiceOnUnlock', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueInvoiceOnUnlock');
      stateContextStub.getState.mockReturnValue({
        invoices: [getDocuments()[0]],
      });
      queuePageState.updateQueueInvoiceOnUnlock(stateContextStub, {
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

  describe('Action: UpdateQueueOnInvoiceSubmit', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueOnInvoiceSubmit').mockImplementation();
      queuePageState.updateQueueOnInvoiceSubmit(stateContextStub, {
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

  describe('Action: SetScrollPosition', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setScrollPosition');
      queuePageState.setScrollPosition(stateContextStub, { scrollPosition: [0, 2000] });
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
      queuePageState.scrollToPosition(stateContextStub);
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
      queuePageState.setSearchFields(stateContextStub, { searchFields: [] });
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
      queuePageState.removeFilter(stateContextStub, { filterKey: '' });
    });

    it('should call the parents removeFilter method', () =>
      expect(DocumentState.prototype.removeFilter).toHaveBeenNthCalledWith(1, stateContextStub, {
        filterKey: '',
      }));

    it('should dispatch SetAdvanceFilters actions', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
        1,
        new SetAdvanceFilters(getAdvancedFilterStub())
      ));
  });

  describe('Action: EnablePageRefresh', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'enablePageRefresh').mockImplementation();
      queuePageState.enablePageRefresh(stateContextStub);
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
      queuePageState.disablePageRefresh(stateContextStub);
    });

    it('should call the parents disablePageRefresh method', () =>
      expect(DocumentState.prototype.disablePageRefresh).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: SetPendingPageSignalEvents', () => {
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
        queuePageState.setPendingPageSignalEvents(stateContextStub);
      });

      it('should dispatch UpdateQueueInvoiceOnLock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new UpdateQueueInvoiceOnLock('docId', 'mockUser')
        ));

      it('should dispatch UpdateQueueInvoiceOnUnlock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new UpdateQueueInvoiceOnUnlock('docId')
        ));

      it('should dispatch UpdateQueueOnInvoiceSubmit action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new UpdateQueueOnInvoiceSubmit('docId')
        ));

      it('should dispatch UpdateQueueOnInvoiceSubmit action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          4,
          new UpdateQueueOnInvoiceSubmit('docId')
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

        queuePageState.setPendingPageSignalEvents(stateContextStub);
      });

      it('should NOT call hubConnections on method', () =>
        expect(hubConnectionSpy.on).not.toHaveBeenCalled());
    });
  });

  describe('Action: RemovePendingPageSignalEvents', () => {
    beforeEach(() => {
      queuePageState.removePendingPageSignalEvents();
    });

    it('should call hubConnections off fn for onPendingLock', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(1, 'onPendingLock'));

    it('should call hubConnections off fn for onPendingUnlock', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(2, 'onPendingUnlock'));

    it('should call hubConnections off fn for onInvoiceSubmit', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(3, 'onInvoiceSubmit'));

    it('should call hubConnections off fn for onEscalationSubmit', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(4, 'onEscalationSubmit'));
  });

  describe('Action: BatchDeletion', () => {
    const documentsStub = [
      {
        documentId: '1',
      },
      {
        documentId: '2',
      },
      {
        documentId: '3',
      },
    ];

    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        invoices: documentsStub,
      });
      xdcServiceStub.postMassEscalation.mockReturnValue(of(null));
    });

    it('should filter out the documentIds passed in', done => {
      queuePageState
        .batchPendingDeletion(stateContextStub, { documentIds: ['1'] })
        .subscribe(() => {
          expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
            invoices: documentsStub.filter(inv => !['1'].includes(inv.documentId)),
          });
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
            new UpdatePendingQueueCount(),
            new UpdateRecycleBinQueueCount(),
          ]);

          done();
        });
    });
  });

  describe('Action: BatchDownload', () => {
    const documentsStub = [
      {
        documentId: '1',
      },
      {
        documentId: '2',
      },
      {
        documentId: '3',
      },
    ];

    beforeEach(() => {
      xdcServiceStub.getFile.mockReturnValue(of(null));
    });

    it('should call getFile for each document passed in', done => {
      queuePageState
        .batchPendingDownload(stateContextStub, { documents: documentsStub })
        .subscribe(() => {
          expect(xdcServiceStub.getFile).toHaveBeenCalledTimes(3);
          done();
        });
    });
  });
});
