import {
  getAdvancedFilterStub,
  getAggregateBodyRequest,
  getBuyersStub,
  getContainsAggregateBodyRequest,
  getDocuments,
  getEscalationStub,
  getSearchBodyRequest,
} from '@ui-coe/avidcapture/shared/test';
import {
  AdvancedFiltersKeys,
  AppPages,
  EscalationCategoryTypes,
  EscalationLevelTypes,
  IngestionTypes,
  SearchApplyFunction,
  SearchContext,
  SortDirection,
  escalationCategoryReasonTypes,
} from '@ui-coe/avidcapture/shared/types';
import * as fs from 'file-saver';
import { of, throwError } from 'rxjs';

import { ScrollToPosition } from './document.actions';
import { DocumentState } from './document.state';

describe('DocumentState', () => {
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
    postMassEscalation: jest.fn(),
    getFile: jest.fn(),
  };
  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };
  const documentSearchHelperServiceStub = {
    getSearchRequestBody: jest.fn(),
    getAggregateRequestBody: jest.fn(),
    getColumnSortedData: jest.fn(),
    getContainsAggregateRequest: jest.fn(),
    getMultipleContainsAggregateRequest: jest.fn(),
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
          currentPage: AppPages.Queue,
          userAccount: {
            preferred_username: 'mock@username',
          },
        },
      })
    ),
  };

  const documentState = new DocumentState(
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

  describe('Action: QueryDocuments', () => {
    describe('on initial page load', () => {
      const documentsStub = getDocuments();
      const bodyRequestStub = getAggregateBodyRequest({ buyerId: [], isSubmitted: [0] });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
        });
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postSearch.mockReturnValue(of(documentsStub));
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should of called xdcService postSearch api', () =>
        expect(xdcServiceStub.postSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for invoices', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          invoices: documentsStub,
          loadMoreHidden: false,
          pageNumber: 2,
        }));
    });

    describe('when loading more invoices', () => {
      const documentsStub = getDocuments();
      const bodyRequestStub = getSearchBodyRequest({ buyerId: [], isSubmitted: [0] });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: documentsStub,
          pageNumber: 2,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
        });
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postSearch.mockReturnValue(of(documentsStub));
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should of called xdcService postSearch api', () =>
        expect(xdcServiceStub.postSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for invoices', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          invoices: [...documentsStub, ...documentsStub],
          loadMoreHidden: false,
          pageNumber: 3,
        }));
    });

    describe('when there are existing buyerIds', () => {
      const documentsStub = getDocuments();

      const bodyRequestStub = getSearchBodyRequest({ buyerId: [], isSubmitted: [0] });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [{ id: '25', name: 'Avidxchange Inc.' }],
            isSubmitted: [0],
          },
          searchFields: ['documentId'],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        pageHelperServiceStub.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValueOnce(bodyRequestStub);
        xdcServiceStub.postSearch.mockReturnValue(of(documentsStub));
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should call getSearchRequestBody using existing buyerIds', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          filters: { buyerId: ['25'], dateReceived: undefined, isSubmitted: [0] },
          page: 1,
          pageSize: 30,
          sortDirection: null,
          sortField: '',
          sourceId: SearchContext.AvidSuite,
        }));
    });

    describe('when scrollPosition is [0, 0]', () => {
      const documentsStub = getDocuments();
      const bodyRequestStub = getAggregateBodyRequest({ buyerId: [], isSubmitted: [0] });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: documentsStub,
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          scrollPosition: [0, 0],
          searchFields: [],
        });
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should NOT dispatch ScrollToPosition action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(1, new ScrollToPosition()));
    });

    describe('when scrollPosition is NOT [0, 0]', () => {
      const documentsStub = getDocuments();
      const bodyRequestStub = getSearchBodyRequest({ buyerId: [], isSubmitted: [0] });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: documentsStub,
          pageNumber: 2,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          scrollPosition: [0, 2000],
          searchFields: [],
        });
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postSearch.mockReturnValue(of(documentsStub));
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should dispatch ScrollToPosition action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new ScrollToPosition()));
    });

    describe('when needsDefaultDateRange is true', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: true,
        });
        pageHelperServiceStub.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function with returned default date range', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: '',
          sortDirection: null,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: ['1/1/22', '2/1/22'],
            isSubmitted: [0],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when needsDefaultDateRange is false', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function with states dateReceived date range', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: '',
          sortDirection: null,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when aggregateFilters is NOT null', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
          },
          aggregateFilters: {
            fileName: ['mock'],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function with the additional aggregateFilters in the filters obj', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: '',
          sortDirection: null,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
            fileName: ['mock'],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when currentPage is RecycleBin & needsDefaultPageRange is TRUE', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '25', name: 'test' }],
              currentPage: AppPages.RecycleBin,
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            dateRecycled: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: true,
        });
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      afterEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '25', name: 'test' }],
              currentPage: AppPages.Queue,
            },
          })
        );
      });

      it('should call documentSearchHelperService getSearchRequestBody function with states dateReceived date range', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: '',
          sortDirection: null,
          filters: {
            buyerId: ['25'] as any,
            dateRecycled: ['1/1/22', '1/31/22'],
            dateReceived: ['1/1/22', '2/1/22'],
            isSubmitted: [0],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when currentPage is RecycleBin & needsDefaultPageRange is FALSE', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '25', name: 'test' }],
              currentPage: AppPages.RecycleBin,
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      afterEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '25', name: 'test' }],
              currentPage: AppPages.Queue,
            },
          })
        );
      });

      it('should call documentSearchHelperService getSearchRequestBody function with states dateReceived date range', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: '',
          sortDirection: null,
          filters: {
            buyerId: ['25'] as any,
            dateRecycled: ['1/1/22', '1/31/22'],
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when sortedColumnData has a key', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {
            dateReceived: SortDirection.Ascending,
          },
          filters: {
            buyerId: [],
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        documentState.queryDocuments(stateContextStub).subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function with sortField & sortDirection having values', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: AdvancedFiltersKeys.DateReceived,
          sortDirection: SortDirection.Ascending,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [0],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when receiving a 404', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: true,
        });
        xdcServiceStub.postSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState loadMoreHidden as true', done => {
        documentState.queryDocuments(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              loadMoreHidden: true,
            });
            done();
          },
        });
      });
    });

    describe('when receiving an error status code other than 404', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: true,
        });
        xdcServiceStub.postSearch.mockReturnValue(throwError(() => ({ status: 400 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 400 })));
      });

      it('should NOT patchState for loadMoreHidden', done => {
        documentState.queryDocuments(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(stateContextStub.patchState).not.toHaveBeenCalled();
            done();
          },
        });
      });
    });
  });

  describe('Action: QueryArchiveDocuments', () => {
    describe('on initial page load', () => {
      const documentsStub = getDocuments();
      const bodyRequestStub = getAggregateBodyRequest({
        buyerId: [],
        isSubmitted: [1],
        sourceEmail: ['mock@username'],
      });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [1],
          },
          searchFields: [],
          scrollPosition: [0, 0],
        });
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postArchive.mockReturnValue(of(documentsStub));
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should of called xdcService postArchive api', () =>
        expect(xdcServiceStub.postArchive).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for invoices', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          invoices: documentsStub,
          loadMoreHidden: false,
          pageNumber: 2,
        }));
    });

    describe('when loading more invoices', () => {
      const documentsStub = getDocuments();
      const bodyRequestStub = getSearchBodyRequest({
        buyerId: [],
        isSubmitted: [1],
        sourceEmail: ['mock@username'],
      });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: documentsStub,
          pageNumber: 2,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [1],
          },
          searchFields: [],
          scrollPosition: [0, 0],
        });
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postArchive.mockReturnValue(of(documentsStub));
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should of called xdcService postArchive api', () =>
        expect(xdcServiceStub.postArchive).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for invoices', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          invoices: [...documentsStub, ...documentsStub],
          loadMoreHidden: false,
          pageNumber: 3,
        }));
    });

    describe('when there are existing buyerIds', () => {
      const documentsStub = getDocuments();

      const bodyRequestStub = getSearchBodyRequest({
        buyerId: [],
        isSubmitted: [1],
        sourceEmail: ['mock@username'],
      });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [{ id: '25', name: 'Avidxchange Inc.' }],
            isSubmitted: [1],
          },
          searchFields: ['documentId'],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        pageHelperServiceStub.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValueOnce(bodyRequestStub);
        xdcServiceStub.postArchive.mockReturnValue(of(documentsStub));
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should call getSearchRequestBody using existing buyerIds', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          filters: {
            buyerId: ['25'],
            dateReceived: undefined,
            isSubmitted: [1],
            sourceEmail: ['mock@username'],
          },
          page: 1,
          pageSize: 30,
          sortDirection: null,
          sortField: '',
          sourceId: SearchContext.AvidSuite,
        }));
    });

    describe('when scrollPosition is [0, 0]', () => {
      const documentsStub = getDocuments();
      const bodyRequestStub = getAggregateBodyRequest({
        buyerId: [],
        isSubmitted: [1],
        sourceEmail: ['mock@username'],
      });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: documentsStub,
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          scrollPosition: [0, 0],
          searchFields: [],
        });
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should NOT dispatch ScrollToPosition action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(1, new ScrollToPosition()));
    });

    describe('when scrollPosition is NOT [0, 0]', () => {
      const documentsStub = getDocuments();
      const bodyRequestStub = getSearchBodyRequest({
        buyerId: [],
        isSubmitted: [1],
        sourceEmail: ['mock@username'],
      });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: documentsStub,
          pageNumber: 2,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          scrollPosition: [0, 2000],
          searchFields: [],
        });
        documentSearchHelperServiceStub.getSearchRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postArchive.mockReturnValue(of(documentsStub));
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should dispatch ScrollToPosition action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new ScrollToPosition()));
    });

    describe('when needsDefaultDateRange is true', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [1],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: true,
        });
        pageHelperServiceStub.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function with returned default date range', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: '',
          sortDirection: null,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: ['1/1/22', '2/1/22'],
            isSubmitted: [1],
            sourceEmail: ['mock@username'],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when needsDefaultDateRange is false', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [1],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function with states dateReceived date range', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: '',
          sortDirection: null,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [1],
            sourceEmail: ['mock@username'],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when aggregateFilters is NOT null', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [1],
          },
          aggregateFilters: {
            fileName: ['mock'],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function with the additional aggregateFilters in the filters obj', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: '',
          sortDirection: null,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [1],
            sourceEmail: ['mock@username'],
            fileName: ['mock'],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when sortedColumnData has a key', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {
            dateReceived: SortDirection.Ascending,
          },
          filters: {
            buyerId: [],
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [1],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: false,
        });
        documentState.queryArchiveDocuments(stateContextStub).subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function with sortField & sortDirection having values', () =>
        expect(documentSearchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          sortField: AdvancedFiltersKeys.DateReceived,
          sortDirection: SortDirection.Ascending,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: ['1/1/22', '1/31/22'],
            isSubmitted: [1],
            sourceEmail: ['mock@username'],
          },
          page: 1,
          pageSize: 30,
        }));
    });

    describe('when receiving a 404', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: true,
        });
        xdcServiceStub.postArchive.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState loadMoreHidden as true', done => {
        documentState.queryArchiveDocuments(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              loadMoreHidden: true,
            });
            done();
          },
        });
      });
    });

    describe('when receiving an error status code other than 404', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [],
          pageNumber: 1,
          sortedColumnData: {},
          filters: {
            buyerId: [],
            isSubmitted: [0],
          },
          searchFields: [],
          scrollPosition: [0, 0],
          needsDefaultDateRange: true,
        });
        xdcServiceStub.postArchive.mockReturnValue(throwError(() => ({ status: 400 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 400 })));
      });

      it('should NOT patchState for loadMoreHidden', done => {
        documentState.queryArchiveDocuments(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(stateContextStub.patchState).not.toHaveBeenCalled();
            done();
          },
        });
      });
    });
  });

  describe('Action: QueryBuyerLookAhead', () => {
    const documentsStub = getDocuments();
    const buyersStub = [{ id: '25', name: 'AVIDXCHANGE, INC' }];
    const bodyRequestStub = getAggregateBodyRequest({ buyerId: [], isSubmitted: [0] });

    describe('when receiving data back from the API', () => {
      beforeEach(() => {
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        bkwServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
        documentState
          .queryBuyerLookAhead(stateContextStub, { searchValue: 'AVIDXCHANGE, INC' })
          .subscribe();
      });

      it('should of called xdcService postAggregateSearch api', () =>
        expect(bkwServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState buyers with buyersStub', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          buyers: buyersStub,
        }));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        bkwServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState loadMoreHidden as true', () => {
        documentState.queryBuyerLookAhead(stateContextStub, { searchValue: 'bu' }).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, 'bu');
            expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
              buyers: buyersStub,
            });
          },
        });
      });
    });
  });

  describe('Action: QueryAllBuyersLookAhead', () => {
    const documentsStub = getDocuments();
    const buyersStub = [{ id: '25', name: 'AVIDXCHANGE, INC' }];
    const bodyRequestStub = getAggregateBodyRequest({ buyerId: [], isSubmitted: [0] });

    describe('when receiving data back from the API', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '1337', name: 'leet' }],
              currentPage: AppPages.Queue,
            },
          })
        );
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        bkwServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
        documentState
          .queryAllBuyersLookAhead(stateContextStub, { searchValue: 'AVIDXCHANGE, INC' })
          .subscribe();
      });

      it('should call documentSearchHelperService getAggregateRequestBody fn', () =>
        expect(documentSearchHelperServiceStub.getAggregateRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            indexingSolutionId: ['2'],
            portalStatus: ['active'],
          },
          groupBy: [AdvancedFiltersKeys.BuyerName, AdvancedFiltersKeys.SourceSystemBuyerId],
          applyFields: [
            {
              ParameterName: 'buyerName',
              ParameterValue: 'AVIDXCHANGE, INC',
              Function: SearchApplyFunction.Contains,
              Alias: 'buyer',
            },
          ],
          resultFilters: [
            {
              ParameterName: 'buyer',
              ParameterValue: '1',
              Operation: '==',
              Chain: null,
            },
          ],
        }));

      it('should of called xdcService postAggregateSearch api', () =>
        expect(bkwServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState buyers with buyersStub', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          buyers: buyersStub,
        }));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState loadMoreHidden as true', () => {
        documentState.queryAllBuyersLookAhead(stateContextStub, { searchValue: 'bu' }).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, 'bu');
            expect(stateContextStub.patchState).not.toHaveBeenCalled();
          },
        });
      });
    });
  });

  describe('Action: SetFilteredBuyers', () => {
    const buyersStub = getBuyersStub();

    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        filters: { isSubmitted: [0] },
        defaultPageFilters: { isSubmitted: [0] },
      });
      documentState.setFilteredBuyers(stateContextStub, { filteredBuyers: buyersStub });
    });

    it('should patchState for filters buyerId, filteredBuyers, & pageNumber', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        filters: {
          buyerId: buyersStub,
          isSubmitted: [0],
        },
        defaultPageFilters: {
          buyerId: buyersStub,
          isSubmitted: [0],
        },
        filteredBuyers: buyersStub,
        pageNumber: 1,
      }));
  });

  describe('Action: SetAdvanceFilters', () => {
    const defaultPageFilters = {
      buyerId: [],
      escalationCategoryIssue: [EscalationCategoryTypes.None],
      ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
      isSubmitted: [0],
    };

    describe('when getting a single result back from the postAggregateSearch api', () => {
      const advanceSearchFiltersStub = getAdvancedFilterStub();

      const bodyRequestStub = getContainsAggregateBodyRequest({
        ...advanceSearchFiltersStub,
        buyerId: ['25'] as any,
      });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          defaultPageFilters,
        });
        documentSearchHelperServiceStub.getMultipleContainsAggregateRequest.mockReturnValueOnce(
          bodyRequestStub
        );
        xdcServiceStub.postAggregateSearch.mockReturnValue(of([{ fileName: 'testmock' }]));
        documentState
          .setAdvanceFilters(stateContextStub, {
            filters: advanceSearchFiltersStub,
            newFilters: { fileName: ['mock'] } as any,
          })
          .subscribe();
      });

      it('should call documentSearchHelperService getMultipleContainsAggregateRequest fn', () =>
        expect(
          documentSearchHelperServiceStub.getMultipleContainsAggregateRequest
        ).toHaveBeenNthCalledWith(
          1,
          SearchContext.AvidSuite,
          {
            ...defaultPageFilters,
            buyerId: ['25'] as any,
          },
          [
            {
              ParameterName: 'fileName',
              ParameterValue: 'mock',
              Function: SearchApplyFunction.Contains,
              Alias: 'fileNameFlag',
            },
          ],
          [
            {
              ParameterName: 'fileNameFlag',
              ParameterValue: '1',
              Operation: '==',
              Chain: null,
            },
          ],
          ['fileName']
        ));

      it('should call xdcService postAggregateSearch fn', () =>
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for filters and set pageNumber to 0', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: advanceSearchFiltersStub,
          aggregateFilters: {
            fileName: ['testmock'],
          },
          filteredBuyers: advanceSearchFiltersStub.buyerId,
          pageNumber: 1,
        }));
    });

    describe('when getting multiple results back from the postAggregateSearch api', () => {
      const advanceSearchFiltersStub = getAdvancedFilterStub();
      const bodyRequestStub = getContainsAggregateBodyRequest({
        ...advanceSearchFiltersStub,
        buyerId: ['25'] as any,
      });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          defaultPageFilters,
        });
        documentSearchHelperServiceStub.getMultipleContainsAggregateRequest.mockReturnValueOnce(
          bodyRequestStub
        );
        xdcServiceStub.postAggregateSearch.mockReturnValue(
          of([
            { fileName: 'testmock', sourceEmail: 'mock@avidxchange.com' },
            { fileName: 'testmock', sourceEmail: 'test@avidxchange.com' },
          ])
        );
        documentState
          .setAdvanceFilters(stateContextStub, {
            filters: advanceSearchFiltersStub,
            newFilters: { fileName: ['mock'], sourceEmail: ['avidxchange'] } as any,
          })
          .subscribe();
      });

      it('should call documentSearchHelperService getMultipleContainsAggregateRequest fn', () =>
        expect(
          documentSearchHelperServiceStub.getMultipleContainsAggregateRequest
        ).toHaveBeenNthCalledWith(
          1,
          SearchContext.AvidSuite,
          {
            ...defaultPageFilters,
            buyerId: ['25'] as any,
          },
          [
            {
              ParameterName: 'fileName',
              ParameterValue: 'mock',
              Function: SearchApplyFunction.Contains,
              Alias: 'fileNameFlag',
            },
            {
              ParameterName: 'sourceEmail',
              ParameterValue: 'avidxchange',
              Function: SearchApplyFunction.Contains,
              Alias: 'sourceEmailFlag',
            },
          ],
          [
            {
              ParameterName: 'fileNameFlag',
              ParameterValue: '1',
              Operation: '==',
              Chain: null,
            },
            {
              ParameterName: 'sourceEmailFlag',
              ParameterValue: '1',
              Operation: '==',
              Chain: null,
            },
          ],
          ['fileName', 'sourceEmail']
        ));

      it('should call xdcService postAggregateSearch fn', () =>
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for filters and set pageNumber to 0', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: advanceSearchFiltersStub,
          aggregateFilters: {
            fileName: ['testmock'],
            sourceEmail: ['mock@avidxchange.com', 'test@avidxchange.com'],
          },
          filteredBuyers: advanceSearchFiltersStub.buyerId,
          pageNumber: 1,
        }));
    });

    describe('when getting no results back from the postAggregateSearch api', () => {
      const advanceSearchFiltersStub = getAdvancedFilterStub();

      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState loadMoreHidden as true', () => {
        documentState
          .setAdvanceFilters(stateContextStub, {
            filters: advanceSearchFiltersStub,
            newFilters: { invoiceNumber: ['123'] } as any,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                filters: advanceSearchFiltersStub,
                aggregateFilters: null,
                filteredBuyers: advanceSearchFiltersStub.buyerId,
                pageNumber: 1,
              });
            },
          });
      });
    });

    describe('when buyerIds are included in the filters that were passed', () => {
      const defaultPageFilters = {
        buyerId: ['25'] as any,
        escalationCategoryIssue: [EscalationCategoryTypes.None],
        ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
        isSubmitted: [0],
      };
      const advanceSearchFiltersStub = getAdvancedFilterStub();

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          defaultPageFilters,
        });
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        documentState
          .setAdvanceFilters(stateContextStub, {
            filters: advanceSearchFiltersStub,
            newFilters: { invoiceNumber: ['123'] } as any,
          })
          .subscribe();
      });

      it('should call documentSearchHelperService getMultipleContainsAggregateRequest fn', () =>
        expect(
          documentSearchHelperServiceStub.getMultipleContainsAggregateRequest
        ).toHaveBeenNthCalledWith(
          1,
          SearchContext.AvidSuite,
          defaultPageFilters,
          [
            {
              ParameterName: 'invoiceNumber',
              ParameterValue: '123',
              Function: SearchApplyFunction.Contains,
              Alias: 'invoiceNumberFlag',
            },
          ],
          [
            {
              ParameterName: 'invoiceNumberFlag',
              ParameterValue: '1',
              Operation: '==',
              Chain: null,
            },
          ],
          ['invoiceNumber']
        ));
    });
  });

  describe('Action: SetColumnSortedData', () => {
    beforeEach(() => {
      documentSearchHelperServiceStub.getColumnSortedData.mockReturnValue({});
      documentState.setColumnSortedData(stateContextStub, {
        columnData: { active: 'fileName', direction: SortDirection.Ascending },
      });
    });

    it('should patchState for sortedColumnData', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        sortedColumnData: { fileName: SortDirection.Ascending },
        pageNumber: 1,
      }));
  });

  describe('Action: SetScrollPosition', () => {
    beforeEach(() => {
      documentState.setScrollPosition(stateContextStub, {
        scrollPosition: [0, 2000],
      });
    });

    it('should patchState for scrollPosition', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        scrollPosition: [0, 2000],
      }));
  });

  describe('Action: ScrollToPosition', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({ scrollPosition: [0, 2000] });
      documentState.scrollToPosition(stateContextStub);
    });

    it('should call viewPort scrollToPosition with scrollPosition in state', () =>
      expect(viewPortStub.scrollToPosition).toHaveBeenNthCalledWith(1, [0, 2000]));

    it('should patchState for scrollPosition', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        scrollPosition: [0, 0],
      }));
  });

  describe('Action: ResetPageNumber', () => {
    beforeEach(() => {
      documentState.resetPageNumber(stateContextStub);
    });

    it('should patchState for pageNumber and set it to 0', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        pageNumber: 1,
      }));
  });

  describe('Action: SetSearchFields', () => {
    describe('when documentId search field has not been added yet', () => {
      beforeEach(() => {
        documentState.setSearchFields(stateContextStub, { searchFields: [] });
      });

      it('should patchState for searchFields and add DocumentId to fields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          searchFields: ['documentId'],
        }));
    });

    describe('when documentId search field has already been added', () => {
      beforeEach(() => {
        documentState.setSearchFields(stateContextStub, {
          searchFields: ['documentId', 'supplier'],
        });
      });

      it('should patchState searchFields with only 1 DocumentId field', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          searchFields: ['documentId', 'supplier'],
        }));
    });
  });

  describe('Action: UpdateQueueInvoiceOnLock', () => {
    describe('when documentIds match', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [getDocuments()[0]],
        });
        documentState.updateQueueInvoiceOnLock(stateContextStub, {
          documentId: 'MockDocumentId',
          lockedBy: 'none',
        });
      });

      it('should patchState for getDocuments and set lockedBy to MockTest', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          invoices: [
            {
              ...getDocuments()[0],
              lockedBy: 'none',
            },
          ],
        }));
    });

    describe('when documentIds do not match', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [getDocuments()[0]],
        });
        documentState.updateQueueInvoiceOnLock(stateContextStub, {
          documentId: 'docId',
          lockedBy: 'MockTest',
        });
      });

      it('should patchState with getDocuments', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          invoices: [
            {
              ...getDocuments()[0],
            },
          ],
        }));
    });
  });

  describe('Action: UpdateQueueInvoiceOnUnlock', () => {
    describe('when documentIds match', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [getDocuments()[0]],
        });
        documentState.updateQueueInvoiceOnUnlock(stateContextStub, {
          documentId: 'MockDocumentId',
        });
      });

      it('should patchState for getDocuments and set lockedBy to MockTest', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          invoices: [
            {
              ...getDocuments()[0],
              lockedBy: 'none',
            },
          ],
        }));
    });

    describe('when documentIds do not match', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [getDocuments()[0]],
        });
        documentState.updateQueueInvoiceOnUnlock(stateContextStub, {
          documentId: 'docId',
        });
      });

      it('should patchState with getDocuments', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          invoices: [
            {
              ...getDocuments()[0],
            },
          ],
        }));
    });
  });

  describe('Action: UpdateQueueOnInvoiceSubmit', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        invoices: [getDocuments()[0]],
      });
      documentState.updateQueueOnInvoiceSubmit(stateContextStub, {
        documentId: '1',
      });
    });

    it('should patchState for queueInvoices', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        invoices: [getDocuments()[0]],
      }));
  });

  describe('Action: RemoveFilter', () => {
    describe('when aggregateFilters is NOT null', () => {
      const advanceSearchFiltersStub = getAdvancedFilterStub();
      const expectedValue = getAdvancedFilterStub();
      delete expectedValue.fileName;

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: advanceSearchFiltersStub,
          aggregateFilters: { fileName: ['mock'], invoiceNumber: ['123'] },
        });
        documentState.removeFilter(stateContextStub, { filterKey: 'fileName' });
      });

      it('should patchState for searchFields and add DocumentId to fields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: expectedValue,
          aggregateFilters: {
            invoiceNumber: ['123'],
          },
          pageNumber: 1,
        }));
    });

    describe('when aggregateFilters is null', () => {
      const advanceSearchFiltersStub = getAdvancedFilterStub();
      const expectedValue = getAdvancedFilterStub();
      delete expectedValue.invoiceNumber;

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: advanceSearchFiltersStub,
          aggregateFilters: null,
        });
        documentState.removeFilter(stateContextStub, { filterKey: 'invoiceNumber' });
      });

      it('should patchState for searchFields and add DocumentId to fields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: expectedValue,
          aggregateFilters: null,
          pageNumber: 1,
        }));
    });
  });

  describe('Action: EnablePageRefresh', () => {
    beforeEach(() => {
      documentState.enablePageRefresh(stateContextStub);
    });

    it('should patchState for canRefreshPage as true', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        canRefreshPage: true,
      }));
  });

  describe('Action: DisablePageRefresh', () => {
    beforeEach(() => {
      documentState.disablePageRefresh(stateContextStub);
    });

    it('should patchState for canRefreshPage as false', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        canRefreshPage: false,
      }));
  });

  describe('Action: BatchDeletion', () => {
    describe('when batch deletion is successful', () => {
      const escalationStub = getEscalationStub(EscalationCategoryTypes.RecycleBin);
      escalationStub.category.reason = escalationCategoryReasonTypes.reason.Other;
      escalationStub.description = 'Document deleted via mass deletion.';
      escalationStub.escalationLevel = EscalationLevelTypes.InternalXdc;

      beforeEach(() => {
        xdcServiceStub.postMassEscalation.mockReturnValueOnce(of(null));
        documentState.batchDeletion(stateContextStub, { documentIds: ['1'] }).subscribe();
      });

      it('should call xdcService postMassDeletion', () =>
        expect(xdcServiceStub.postMassEscalation).toHaveBeenNthCalledWith(1, {
          docIds: ['1'],
          escalation: escalationStub,
        }));

      it('should open a success toast message', () =>
        expect(toastServiceStub.success).toHaveBeenNthCalledWith(1, 'Files were deleted.'));
    });

    describe('when batch deletion is fails', () => {
      beforeEach(() => {
        xdcServiceStub.postMassEscalation.mockReturnValue(throwError(() => ({ status: 500 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should patchState loadMoreHidden as true', done => {
        documentState.batchDeletion(stateContextStub, { documentIds: [] }).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(toastServiceStub.error).toHaveBeenNthCalledWith(1, 'Files failed to delete.');
            done();
          },
        });
      });
    });
  });

  describe('Action: BatchDownload', () => {
    const documentsStub = getDocuments();
    const blobMock = new Blob();

    beforeEach(() => {
      xdcServiceStub.getFile.mockReturnValue(of(blobMock));
      documentState.batchDownload(stateContextStub, { documents: documentsStub }).subscribe();
    });

    it('should call xdcService getFile', () => {
      expect(xdcServiceStub.getFile).toHaveBeenNthCalledWith(1, documentsStub[0].documentId);
    });
  });
});
