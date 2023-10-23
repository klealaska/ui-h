import {
  QueryDocumentCardSetCounts,
  UpdateRecycleBinQueueCount,
  UpdateResearchQueueCount,
} from '@ui-coe/avidcapture/core/data-access';
import { DocumentState } from '@ui-coe/avidcapture/shared/data-access';
import {
  getAdvancedFilterStub,
  getBuyersStub,
  getDocuments,
} from '@ui-coe/avidcapture/shared/test';
import {
  EscalationCategoryTypes,
  SearchContext,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import {
  QueryResearchInvoices,
  SetAdvanceFilters,
  UpdateResearchQueueInvoiceOnLock,
  UpdateResearchQueueInvoiceOnUnlock,
  UpdateResearchQueueOnInvoiceSubmit,
} from './research-page.actions';
import { ResearchPageState } from './research-page.state';

const hubConnectionSpy = { on: jest.fn(), off: jest.fn() };

describe('ResearchPageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };
  const xdcServiceStub = {
    postSearch: jest.fn(),
    postAggregateSearch: jest.fn(),
    postAggregateBulkSearch: jest.fn(),
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
    getCountAggregateRequest: jest.fn(),
    getCountAggregateWithAliasRequest: jest.fn(),
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
          filteredBuyers: [],
          hubConnection: hubConnectionSpy,
        },
      })
    ),
  };

  const researchPageState = new ResearchPageState(
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
      expect(ResearchPageState.data({ invoices: [getDocuments()[0]] } as any)).toStrictEqual({
        invoices: [getDocuments()[0]],
      }));
  });

  describe('Action: QueryResearchInvoices', () => {
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
      });
      xdcServiceStub.postSearch.mockReturnValue(of(documentsStub));
    });

    it('should return documents', done => {
      researchPageState.queryResearchInvoices(stateContextStub).subscribe(val => {
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
      researchPageState
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
      researchPageState
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
      researchPageState.setFilteredBuyers(stateContextStub, { filteredBuyers: filteredBuyersStub });
    });

    it('should call the parents setFilteredBuyers method', () =>
      expect(DocumentState.prototype.setFilteredBuyers).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { filteredBuyers: filteredBuyersStub }
      ));

    it('should dispatch QueryResearchInvoices & QueryDocumentCardSetCounts actions', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new QueryResearchInvoices(),
        new QueryDocumentCardSetCounts(),
      ]));
  });

  describe('Action: SetAdvanceFilters', () => {
    describe('when there are filtered buyers', () => {
      const filtersStub = getAdvancedFilterStub();

      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'setAdvanceFilters').mockImplementation(() => of([]));
        stateContextStub.getState.mockReturnValue({
          searchFields: [],
          queuesNotAllowedList: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
          ],
          defaultPageFilters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
            isSubmitted: [0],
          },
        });
      });

      it('should call the parents setAdvanceFilters method with buyer filter passed in', () => {
        researchPageState.setAdvanceFilters(stateContextStub, { filters: filtersStub });
        expect(DocumentState.prototype.setAdvanceFilters).toHaveBeenNthCalledWith(
          1,
          stateContextStub,
          {
            filters: {
              ...filtersStub,
              isSubmitted: [0],
              escalationCategoryIssue: [
                ...filtersStub.escalationCategoryIssue,
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
              ],
            },
            newFilters: filtersStub,
          }
        );
      });

      it('should dispatch QueryResearchInvoices & QueryDocumentCardSetCounts actions', done => {
        researchPageState
          .setAdvanceFilters(stateContextStub, { filters: filtersStub })
          .subscribe(() => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
              new QueryResearchInvoices(),
              new QueryDocumentCardSetCounts(),
            ]);
            done();
          });
      });
    });

    describe('when there are filtered escalation category issues', () => {
      let filtersStub = getAdvancedFilterStub();
      filtersStub = {
        ...filtersStub,
        escalationCategoryIssue: [EscalationCategoryTypes.IndexingOpsQc],
      };

      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'setAdvanceFilters').mockImplementation(() => of([]));
        stateContextStub.getState.mockReturnValue({
          searchFields: [],
          queuesNotAllowedList: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
          ],
          defaultPageFilters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
            isSubmitted: [0],
          },
        });
      });

      it('should call the parents setAdvanceFilters method with buyer filter passed in', () => {
        researchPageState.setAdvanceFilters(stateContextStub, { filters: filtersStub });
        expect(DocumentState.prototype.setAdvanceFilters).toHaveBeenNthCalledWith(
          1,
          stateContextStub,
          {
            filters: {
              ...filtersStub,
              isSubmitted: [0],
            },
            newFilters: filtersStub,
          }
        );
      });

      it('should dispatch QueryResearchInvoices & QueryDocumentCardSetCounts actions', done => {
        researchPageState
          .setAdvanceFilters(stateContextStub, { filters: filtersStub })
          .subscribe(() => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
              new QueryResearchInvoices(),
              new QueryDocumentCardSetCounts(),
            ]);
            done();
          });
      });
    });

    describe('when filtered escalation category issues are empty array', () => {
      let filtersStub = getAdvancedFilterStub();
      filtersStub = {
        ...filtersStub,
        escalationCategoryIssue: [],
      };

      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'setAdvanceFilters').mockImplementation(() => of([]));
        stateContextStub.getState.mockReturnValue({
          searchFields: [],
          queuesNotAllowedList: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
          ],
          defaultPageFilters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
            isSubmitted: [0],
          },
        });
      });

      it('should call the parents setAdvanceFilters method with buyer filter passed in', () => {
        researchPageState.setAdvanceFilters(stateContextStub, { filters: filtersStub });
        expect(DocumentState.prototype.setAdvanceFilters).toHaveBeenNthCalledWith(
          1,
          stateContextStub,
          {
            filters: {
              ...filtersStub,
              isSubmitted: [0],
              escalationCategoryIssue: [
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
              ],
            },
            newFilters: filtersStub,
          }
        );
      });

      it('should dispatch QueryResearchInvoices & QueryDocumentCardSetCounts actions', done => {
        researchPageState
          .setAdvanceFilters(stateContextStub, { filters: filtersStub })
          .subscribe(() => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
              new QueryResearchInvoices(),
              new QueryDocumentCardSetCounts(),
            ]);
            done();
          });
      });
    });

    describe('when filtered escalation category issues are NULL', () => {
      let filtersStub = getAdvancedFilterStub();
      filtersStub = {
        ...filtersStub,
        escalationCategoryIssue: null,
      };

      beforeEach(() => {
        jest.spyOn(DocumentState.prototype, 'setAdvanceFilters').mockImplementation(() => of([]));
        stateContextStub.getState.mockReturnValue({
          searchFields: [],
          queuesNotAllowedList: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
          ],
          defaultPageFilters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
            isSubmitted: [0],
          },
        });
      });

      it('should call the parents setAdvanceFilters method with buyer filter passed in', () => {
        researchPageState.setAdvanceFilters(stateContextStub, { filters: filtersStub });

        expect(DocumentState.prototype.setAdvanceFilters).toHaveBeenNthCalledWith(
          1,
          stateContextStub,
          {
            filters: {
              ...filtersStub,
              isSubmitted: [0],
              escalationCategoryIssue: [
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
              ],
            },
            newFilters: filtersStub,
          }
        );
      });

      it('should dispatch QueryResearchInvoices & QueryDocumentCardSetCounts actions', done => {
        researchPageState
          .setAdvanceFilters(stateContextStub, { filters: filtersStub })
          .subscribe(() => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
              new QueryResearchInvoices(),
              new QueryDocumentCardSetCounts(),
            ]);
            done();
          });
      });
    });

    describe('when contains search errors', () => {
      const filtersStub = getAdvancedFilterStub();

      beforeEach(() => {
        jest
          .spyOn(DocumentState.prototype, 'setAdvanceFilters')
          .mockImplementation(() => throwError(() => ({ status: 404 })));
        stateContextStub.getState.mockReturnValue({
          searchFields: [],
          queuesNotAllowedList: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
          ],
          defaultPageFilters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
            isSubmitted: [0],
          },
        });
      });

      it('should dispatch QueryResearchInvoices & QueryDocumentCardSetCounts actions', done => {
        researchPageState
          .setAdvanceFilters(stateContextStub, {
            filters: filtersStub,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
                new QueryResearchInvoices(),
                new QueryDocumentCardSetCounts(),
              ]);
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
      researchPageState.setColumnSortedData(stateContextStub, {
        columnData: { active: 'fileName', direction: SortDirection.Ascending },
      });
    });

    it('should call the parents setColumnSortedData method', () =>
      expect(DocumentState.prototype.setColumnSortedData).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { columnData: { active: 'fileName', direction: SortDirection.Ascending } }
      ));

    it('should dispatch QueryResearchInvoices action', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryResearchInvoices()));
  });

  describe('Action: SetScrollPosition', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setScrollPosition');
      researchPageState.setScrollPosition(stateContextStub, { scrollPosition: [0, 2000] });
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
      researchPageState.scrollToPosition(stateContextStub);
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
      researchPageState.resetPageNumber(stateContextStub);
    });

    it('should call the parents resetPageNumber method', () =>
      expect(DocumentState.prototype.resetPageNumber).toHaveBeenNthCalledWith(1, stateContextStub));
  });

  describe('Action: SetSearchFields', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setSearchFields').mockImplementation();
      researchPageState.setSearchFields(stateContextStub, { searchFields: [] });
    });

    it('should call the parents setSearchFields method', () =>
      expect(DocumentState.prototype.setSearchFields).toHaveBeenNthCalledWith(1, stateContextStub, {
        searchFields: [],
      }));
  });

  describe('Action: UpdateResearchQueueInvoiceOnLock', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueInvoiceOnLock');
      stateContextStub.getState.mockReturnValue({
        invoices: [getDocuments()[0]],
      });
      researchPageState.updateResearchQueueInvoiceOnLock(stateContextStub, {
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

  describe('Action: UpdateResearchQueueInvoiceOnUnlock', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueInvoiceOnUnlock');
      stateContextStub.getState.mockReturnValue({
        invoices: [getDocuments()[0]],
      });
      researchPageState.updateResearchQueueInvoiceOnUnlock(stateContextStub, {
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

  describe('Action: UpdateResearchQueueOnInvoiceSubmit', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueOnInvoiceSubmit').mockImplementation();
      researchPageState.updateResearchQueueOnInvoiceSubmit(stateContextStub, {
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
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'removeFilter').mockImplementation();
      stateContextStub.getState.mockReturnValue({ filters: getAdvancedFilterStub() });
      researchPageState.removeFilter(stateContextStub, { filterKey: '' });
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

  describe('Action: RemoveEscalationFilter', () => {
    describe('when escalationCategoryIssue has other filters left over', () => {
      const exposedFiltersStub = [
        {
          name: EscalationCategoryTypes.SupplierResearch,
          count: 5,
          show: false,
        },
        {
          name: EscalationCategoryTypes.IndexingOpsQc,
          count: 1,
          show: false,
        },
      ];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: {
            buyerId: [],
            escalationCategoryIssue: [
              EscalationCategoryTypes.IndexingOpsQc,
              EscalationCategoryTypes.DuplicateResearch,
            ],
          },
          exposedFilters: exposedFiltersStub,
        });
        researchPageState.removeEscalationFilter(stateContextStub, {
          escalationType: EscalationCategoryTypes.IndexingOpsQc,
        });
      });

      it('should patchState escalationCategoryIssue without passed in escalation & reset pageNumber back to 1 and has to change IndexingOpsQc show flag to true ', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: {
            buyerId: [],
            escalationCategoryIssue: [EscalationCategoryTypes.DuplicateResearch],
          },
          pageNumber: 1,
          exposedFilters: [
            {
              name: EscalationCategoryTypes.SupplierResearch,
              count: 5,
              show: false,
            },
            {
              name: EscalationCategoryTypes.IndexingOpsQc,
              count: 1,
              show: true,
            },
          ],
        }));

      it('should dispatch QueryRecycleBinDocuments & QueryDocumentCardSetCounts actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryResearchInvoices(),
          new QueryDocumentCardSetCounts(),
        ]));
    });

    describe('when escalationCategoryIssue has all of its filters removed', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: {
            buyerId: [],
            escalationCategoryIssue: [EscalationCategoryTypes.IndexingOpsQc],
          },
          queuesNotAllowedList: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
          ],
        });
        researchPageState.removeEscalationFilter(stateContextStub, {
          escalationType: EscalationCategoryTypes.IndexingOpsQc,
        });
      });

      it('should patchState escalationCategoryIssue with -Recycle Bin & -none & reset pageNumber back to 1', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: {
            buyerId: [],
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
          },
          pageNumber: 1,
        }));

      it('should dispatch QueryResearchInvoices & QueryDocumentCardSetCounts actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryResearchInvoices(),
          new QueryDocumentCardSetCounts(),
        ]));
    });
  });

  describe('Action: RemoveExposedFilter', () => {
    describe('When receives an EscalationType', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: {
            buyerId: [],
            escalationCategoryIssue: [EscalationCategoryTypes.IndexingOpsQc],
          },
          exposedFilters: [
            { name: EscalationCategoryTypes.SupplierResearch, count: 5, show: true },
            { name: EscalationCategoryTypes.DuplicateResearch, count: 0, show: false },
          ],
        });
        researchPageState.removeExposedFilter(stateContextStub, {
          filterName: EscalationCategoryTypes.SupplierResearch,
        });
      });

      it('should patchState for exposedFilters with the show flag in false', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          exposedFilters: [
            { name: EscalationCategoryTypes.SupplierResearch, count: 5, show: false },
            { name: EscalationCategoryTypes.DuplicateResearch, count: 0, show: false },
          ],
        }));
    });
    describe('When receives an empty EscalationType and count is above 0', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: {
            buyerId: [],
            escalationCategoryIssue: [],
          },
          exposedFilters: [
            { name: EscalationCategoryTypes.SupplierResearch, count: 5, show: false },
            { name: EscalationCategoryTypes.DuplicateResearch, count: 10, show: false },
          ],
        });
        researchPageState.removeExposedFilter(stateContextStub, {
          filterName: '',
        });
      });
      it('should reset all the show flags to true', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          exposedFilters: [
            { name: EscalationCategoryTypes.SupplierResearch, count: 5, show: true },
            { name: EscalationCategoryTypes.DuplicateResearch, count: 10, show: true },
          ],
        });
      });
    });

    describe('When receives an empty EscalationType and count is  0', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: {
            buyerId: [],
            escalationCategoryIssue: [],
          },
          exposedFilters: [
            { name: EscalationCategoryTypes.SupplierResearch, count: 5, show: false },
            { name: EscalationCategoryTypes.DuplicateResearch, count: 0, show: false },
          ],
        });
        researchPageState.removeExposedFilter(stateContextStub, {
          filterName: '',
        });
      });
      it('should reset all the show flags to true', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          exposedFilters: [
            { name: EscalationCategoryTypes.SupplierResearch, count: 5, show: true },
            { name: EscalationCategoryTypes.DuplicateResearch, count: 0, show: false },
          ],
        });
      });
    });
  });

  describe('Action: EnablePageRefresh', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'enablePageRefresh').mockImplementation();
      researchPageState.enablePageRefresh(stateContextStub);
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
      researchPageState.disablePageRefresh(stateContextStub);
    });

    it('should call the parents disablePageRefresh method', () =>
      expect(DocumentState.prototype.disablePageRefresh).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: CreateQueuesNotAllowedList', () => {
    describe('when userQueuePermissionList is an empty object', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          defaultPageFilters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
          },
          filters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
          },
        });
        researchPageState.createQueuesNotAllowedList(stateContextStub, {
          escalationCategoryList: [],
        });
      });

      it('should patchState for filters and queuesNotAllowedList with filters that are currently in state', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
          },
          queuesNotAllowedList: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
          ],
        }));
    });

    describe('when userQueuePermissionList has some values', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          defaultPageFilters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
          },
          filters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
            ],
          },
        });
        researchPageState.createQueuesNotAllowedList(stateContextStub, {
          escalationCategoryList: [
            `-${EscalationCategoryTypes.DataExceptionAU}`,
            `-${EscalationCategoryTypes.ScanningOpsQC}`,
          ],
        });
      });

      it('should patchState for filters and queuesNotAllowedList with filters that are currently in state', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
              `-${EscalationCategoryTypes.DataExceptionAU}`,
              `-${EscalationCategoryTypes.ScanningOpsQC}`,
            ],
          },
          queuesNotAllowedList: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.DataExceptionAU}`,
            `-${EscalationCategoryTypes.ScanningOpsQC}`,
          ],
        }));
    });
  });

  describe('Action: SetResearchPageSignalEvents', () => {
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
        researchPageState.setResearchPageSignalEvents(stateContextStub);
      });

      it('should dispatch UpdateResearchQueueInvoiceOnLock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new UpdateResearchQueueInvoiceOnLock('docId', 'mockUser')
        ));

      it('should dispatch UpdateResearchQueueInvoiceOnUnlock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new UpdateResearchQueueInvoiceOnUnlock('docId')
        ));

      it('should dispatch UpdateResearchQueueOnInvoiceSubmit action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new UpdateResearchQueueOnInvoiceSubmit('docId')
        ));

      it('should dispatch UpdateResearchQueueOnInvoiceSubmit action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          4,
          new UpdateResearchQueueOnInvoiceSubmit('docId')
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

        researchPageState.setResearchPageSignalEvents(stateContextStub);
      });

      it('should NOT call hubConnections on method', () =>
        expect(hubConnectionSpy.on).not.toHaveBeenCalled());
    });
  });

  describe('Action: RemoveResearchPageSignalEvents', () => {
    beforeEach(() => {
      researchPageState.removeResearchPageSignalEvents();
    });

    it('should call hubConnections off fn for onResearchLock', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(1, 'onResearchLock'));

    it('should call hubConnections off fn for onResearchUnlock', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(2, 'onResearchUnlock'));

    it('should call hubConnections off fn for onInvoiceSubmit', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(3, 'onInvoiceSubmit'));

    it('should call hubConnections off fn for onEscalationSubmit', () =>
      expect(hubConnectionSpy.off).toHaveBeenNthCalledWith(4, 'onEscalationSubmit'));
  });

  describe('Action: QueryExposedFiltersCount', () => {
    const exposedFilterNames = [
      EscalationCategoryTypes.SupplierResearch,
      EscalationCategoryTypes.DuplicateResearch,
      EscalationCategoryTypes.ImageIssue,
      EscalationCategoryTypes.NonInvoiceDocument,
    ];

    describe('when successful', () => {
      const exposedFiltersStub = [
        {
          name: EscalationCategoryTypes.SupplierResearch,
          count: 0,
          show: true,
        },
        {
          name: EscalationCategoryTypes.DuplicateResearch,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.ImageIssue,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.NonInvoiceDocument,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.ShipToResearch,
          count: 0,
          show: false,
        },
      ];

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '25', name: 'AVIDXCHANGE, INC' }],
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          filters: {
            buyerId: [],
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.None}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.RecycleBin}`,
              EscalationCategoryTypes.SupplierResearch,
            ],
            isSubmitted: [0],
          },
          exposedFilters: exposedFiltersStub,
        });
        xdcServiceStub.postAggregateBulkSearch.mockReturnValueOnce(
          of([
            { isSubmitted: [0], [EscalationCategoryTypes.SupplierResearch]: 1 },
            { isSubmitted: [0], [EscalationCategoryTypes.DuplicateResearch]: 1 },
            { isSubmitted: [0], [EscalationCategoryTypes.ImageIssue]: 1 },
            { isSubmitted: [0], [EscalationCategoryTypes.NonInvoiceDocument]: 1 },
            { isSubmitted: [0], [EscalationCategoryTypes.ShipToResearch]: 1 },
          ])
        );

        researchPageState.queryExposedFiltersCounts(stateContextStub).subscribe();
      });

      exposedFilterNames.forEach((filterName, index) => {
        it(`should call documentSearchHelperService getCountAggregateRequest for ${filterName}`, () =>
          expect(
            documentSearchHelperServiceStub.getCountAggregateWithAliasRequest
          ).toHaveBeenNthCalledWith(
            index + 1,
            SearchContext.AvidSuite,
            {
              buyerId: ['25'],
              escalationCategoryIssue: [filterName],
              isSubmitted: [0],
            },
            filterName
          ));
      });

      it(`should patchState for exposedFilters`, () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          exposedFilters: [
            {
              name: EscalationCategoryTypes.SupplierResearch,
              count: 1,
              show: false,
            },
            {
              name: EscalationCategoryTypes.DuplicateResearch,
              count: 1,
              show: true,
            },
            {
              name: EscalationCategoryTypes.ImageIssue,
              count: 1,
              show: true,
            },
            {
              name: EscalationCategoryTypes.NonInvoiceDocument,
              count: 1,
              show: true,
            },
            {
              name: EscalationCategoryTypes.ShipToResearch,
              count: 1,
              show: true,
            },
          ],
        });
      });
    });

    describe('when successful & research page already has buyers stored in state', () => {
      const exposedFiltersStub = [
        {
          name: EscalationCategoryTypes.SupplierResearch,
          count: 0,
          show: true,
        },
        {
          name: EscalationCategoryTypes.DuplicateResearch,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.ImageIssue,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.NonInvoiceDocument,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.ShipToResearch,
          count: 0,
          show: false,
        },
      ];

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '25', name: 'AVIDXCHANGE, INC' }],
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          filters: {
            buyerId: [{ id: '25', name: 'AVIDXCHANGE, INC' }],
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.None}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.RecycleBin}`,
              EscalationCategoryTypes.SupplierResearch,
            ],
            isSubmitted: [0],
          },
          exposedFilters: exposedFiltersStub,
        });
        xdcServiceStub.postAggregateBulkSearch.mockReturnValueOnce(
          of([
            { isSubmitted: [0], [EscalationCategoryTypes.SupplierResearch]: 1 },
            { isSubmitted: [0], [EscalationCategoryTypes.DuplicateResearch]: 1 },
            { isSubmitted: [0], [EscalationCategoryTypes.ImageIssue]: 1 },
            { isSubmitted: [0], [EscalationCategoryTypes.NonInvoiceDocument]: 1 },
          ])
        );

        researchPageState.queryExposedFiltersCounts(stateContextStub).subscribe();
      });

      exposedFilterNames.forEach((filterName, index) => {
        it(`should call documentSearchHelperService getCountAggregateRequest for ${filterName}`, () =>
          expect(
            documentSearchHelperServiceStub.getCountAggregateWithAliasRequest
          ).toHaveBeenNthCalledWith(
            index + 1,
            SearchContext.AvidSuite,
            {
              buyerId: ['25'],
              escalationCategoryIssue: [filterName],
              isSubmitted: [0],
            },
            filterName
          ));
      });

      it(`should patchState for exposedFilters`, () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          exposedFilters: [
            {
              name: EscalationCategoryTypes.SupplierResearch,
              count: 1,
              show: false,
            },
            {
              name: EscalationCategoryTypes.DuplicateResearch,
              count: 1,
              show: true,
            },
            {
              name: EscalationCategoryTypes.ImageIssue,
              count: 1,
              show: true,
            },

            {
              name: EscalationCategoryTypes.NonInvoiceDocument,
              count: 1,
              show: true,
            },
            {
              name: EscalationCategoryTypes.ShipToResearch,
              count: 0,
              show: false,
            },
          ],
        });
      });
    });

    describe('when bulk aggregate request fails', () => {
      const exposedFiltersStub = [
        {
          name: EscalationCategoryTypes.SupplierResearch,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.DuplicateResearch,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.ImageIssue,
          count: 0,
          show: false,
        },
        {
          name: EscalationCategoryTypes.NonInvoiceDocument,
          count: 0,
          show: false,
        },
      ];

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '25', name: 'AVIDXCHANGE, INC' }],
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          filters: {
            buyerId: [{ id: '25', name: 'AVIDXCHANGE, INC' }],
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.None}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.RecycleBin}`,
              EscalationCategoryTypes.SupplierResearch,
            ],
            isSubmitted: [0],
          },
          exposedFilters: exposedFiltersStub,
        });
        xdcServiceStub.postAggregateBulkSearch.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should patchState for all exposed filters as 0', done => {
        researchPageState.queryExposedFiltersCounts(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              exposedFilters: exposedFiltersStub,
            });
            done();
          },
        });
      });
    });
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
      researchPageState
        .batchResearchDeletion(stateContextStub, { documentIds: ['1'] })
        .subscribe(() => {
          expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
            invoices: documentsStub.filter(inv => !['1'].includes(inv.documentId)),
          });
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
            new UpdateResearchQueueCount(),
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
      researchPageState
        .batchResearchDownload(stateContextStub, { documents: documentsStub })
        .subscribe(() => {
          expect(xdcServiceStub.getFile).toHaveBeenCalledTimes(3);
          done();
        });
    });
  });
});
