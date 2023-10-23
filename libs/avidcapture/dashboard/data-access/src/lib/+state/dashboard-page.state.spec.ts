import {
  getAggregateBodyRequest,
  getExceptionVolumeReport,
  getHistoricalVolumeReport,
  getIngestionTypeData,
  getQueueAgingReport,
  getTopPaperSuppliers,
  getTransactionCountReport,
  transactionCountByEntityStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  ActivityTypes,
  AdvancedFiltersKeys,
  EscalationCategoryTypes,
  IngestionTypes,
  SearchAlias,
  SearchApplyFunction,
  SearchContext,
  SearchLabel,
  SearchReduceFunction,
  SortDirection,
  TimeIntervals,
} from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import { DashboardPageState } from './dashboard-page.state';

describe('DashboardPageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };

  const xdcServiceStub = {
    postAggregateSearch: jest.fn(),
  };

  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };

  const documentSearchHelperServiceStub = {
    getAggregateRequestBody: jest.fn(),
    getColumnSortedData: jest.fn(),
    getContainsAggregateRequest: jest.fn(),
  };

  const dashboardHelperServiceStub = {
    getWeekendTime: jest.fn(),
  };

  const pageHelperServiceStub = {
    getDateRange: jest.fn(),
    getAllMonthsBetweenDates: jest.fn(),
  };

  const formatterServiceStub = {
    toPascalCase: jest.fn(),
  };

  const reportsServiceStub = {
    generateTransactionCountByEntityReport: jest.fn(),
  };

  const reportHelperServiceStub = {
    handleNoReportsFound: jest.fn(),
  };

  const dashboardPageState = new DashboardPageState(
    xdcServiceStub as any,
    retryServiceStub as any,
    documentSearchHelperServiceStub as any,
    dashboardHelperServiceStub as any,
    pageHelperServiceStub as any,
    formatterServiceStub as any,
    reportsServiceStub as any,
    reportHelperServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () => {
      expect(DashboardPageState.data({ dataTransactionCountVolume: [] } as any)).toStrictEqual({
        dataTransactionCountVolume: [],
      });
    });
  });

  describe('Action: QueryTransactionCountReport', () => {
    describe('when receiving data back from the API', () => {
      const reportDataStub = getHistoricalVolumeReport();
      const bodyRequestStub = getAggregateBodyRequest({ buyerId: [], isSubmitted: [0] });

      beforeEach(() => {
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(reportDataStub));
        dashboardPageState
          .queryTransactionCountReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe();
      });

      it('should call xdcService postAggregateSearch function', () => {
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub);
      });

      it('should patchState for dataTransactionCountVolume', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          dataTransactionCountVolume: reportDataStub,
        }));
    });

    describe('when selectedDates has data', () => {
      const datesSelectedStub = ['Sun, 09 Jan 2022 18:14:21 GMT', 'Tue, 08 Feb 2022 18:14:21 GMT'];

      beforeEach(() => {
        dashboardPageState
          .queryTransactionCountReport(stateContextStub, {
            orgId: '25',
            selectedDates: datesSelectedStub,
          })
          .subscribe();
      });

      it('should NOT call pageHelperServiceStub getDateRange function', () =>
        expect(pageHelperServiceStub.getDateRange).not.toHaveBeenCalled());
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        dashboardPageState
          .queryTransactionCountReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                dataTransactionCountVolume: [],
              });

              done();
            },
          });
      });
    });
  });

  describe('Action: Query exceptionVolumeReport Report', () => {
    describe('when receiving data back from API', () => {
      const reportDataStub = getExceptionVolumeReport();
      const bodyRequestStub = getAggregateBodyRequest({ buyerId: [], isSubmitted: [0] });

      beforeEach(() => {
        jest.spyOn(formatterServiceStub, 'toPascalCase').mockReturnValue('Ship To Research');
        pageHelperServiceStub.getDateRange.mockReturnValue(['', '']);
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of([reportDataStub[0]]));
        dashboardPageState
          .exceptionVolumeReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function', () =>
        expect(documentSearchHelperServiceStub.getAggregateRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            buyerId: ['25'] as any,
            dateReceived: [expect.anything(), expect.anything()],
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.RecycleBin}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.None}`,
              `-${ActivityTypes.CreateNewAccount}`,
              `-${EscalationCategoryTypes.DataExceptionAU}`,
              `-${EscalationCategoryTypes.IndexerQa}`,
              `-${EscalationCategoryTypes.ScanningOpsQC}`,
              `-${EscalationCategoryTypes.IndexerActivity}`,
              `-${EscalationCategoryTypes.IndexingOpsQc}`,
            ],
            isSubmitted: [0],
          },
          fields: [AdvancedFiltersKeys.EscalationCategoryIssue],
          groupBy: [AdvancedFiltersKeys.EscalationCategoryIssue],
          reduceFields: [
            {
              LabelName: AdvancedFiltersKeys.EscalationCategoryIssue,
              Function: SearchReduceFunction.Count,
              Alias: SearchAlias.Count,
            },
          ],
        }));

      it('should call xdcService postAggregateSearch function', () =>
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for dataExceptionVolume', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          dataExceptionVolume: [reportDataStub[0]],
        }));
    });

    describe('when selectedDates has data', () => {
      const datesSelectedStub = ['Sun, 09 Jan 2022 18:14:21 GMT', 'Tue, 08 Feb 2022 18:14:21 GMT'];

      beforeEach(() => {
        dashboardPageState
          .exceptionVolumeReport(stateContextStub, {
            orgId: '25',
            selectedDates: datesSelectedStub,
          })
          .subscribe();
      });

      it('should NOT call pageHelperServiceStub getDateRange function', () =>
        expect(pageHelperServiceStub.getDateRange).not.toHaveBeenCalled());
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        dashboardPageState
          .exceptionVolumeReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                dataExceptionVolume: [],
              });

              done();
            },
          });
      });
    });
  });

  describe('Action: QueryAverageTimeToSubmissionReport', () => {
    describe('when receiving data back from the API', () => {
      const bodyRequestStub = getAggregateBodyRequest({
        buyerId: ['25'] as any,
        dateSubmitted: [],
        isSubmitted: [1],
      });
      const documentAverageStub = [
        {
          buyerId: '25',
          count: '15',
          sum: '30',
        },
      ];
      bodyRequestStub.GroupBy = [AdvancedFiltersKeys.BuyerId];
      bodyRequestStub.ReduceFields = [
        {
          LabelName: SearchAlias.Hours,
          Function: SearchReduceFunction.Sum,
          Alias: SearchAlias.Sum,
        },
        {
          LabelName: SearchAlias.Count,
          Function: SearchReduceFunction.Count,
          Alias: SearchAlias.Count,
        },
      ];
      bodyRequestStub.ApplyFields = [
        {
          Function: SearchApplyFunction.HoursToProcess,
          Alias: SearchAlias.Hours,
        },
      ];

      beforeEach(() => {
        pageHelperServiceStub.getDateRange.mockReturnValueOnce([
          'Sun, 09 Jan 2022 18:14:21 GMT',
          'Tue, 08 Feb 2022 18:14:21 GMT',
        ]);
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(documentAverageStub));
        dashboardHelperServiceStub.getWeekendTime.mockReturnValue(500);
        dashboardPageState
          .queryAverageTimeToSubmissionReport(stateContextStub, {
            orgId: '25',
            selectedDates: [],
            interval: TimeIntervals.Hours,
          })
          .subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function', () =>
        expect(documentSearchHelperServiceStub.getAggregateRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            buyerId: ['25'] as any,
            dateSubmitted: [expect.anything(), expect.anything()],
            isSubmitted: [1],
          },
          groupBy: [AdvancedFiltersKeys.BuyerId],
          reduceFields: [
            {
              LabelName: SearchAlias.Minutes,
              Function: SearchReduceFunction.Sum,
              Alias: SearchAlias.Sum,
            },
            {
              LabelName: SearchAlias.Count,
              Function: SearchReduceFunction.Count,
              Alias: SearchAlias.Count,
            },
          ],
          applyFields: [
            {
              Function: SearchApplyFunction.MinutesToProcess,
              Alias: SearchAlias.Minutes,
            },
          ],
        }));

      it('should call xdcService postAggregateSearch function', () =>
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for several pieces of data needed for avg time to submit', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          weekendTime: 500,
          timeInSelectedInterval: 2592000,
          averageTimeToSubmission: { buyerId: '25', count: '15', sum: '30' },
          submissionTimeInterval: TimeIntervals.Hours,
        });
      });
    });

    describe('when selectedDates has data', () => {
      const datesSelectedStub = ['Sun, 09 Jan 2022 18:14:21 GMT', 'Tue, 08 Feb 2022 18:14:21 GMT'];

      beforeEach(() => {
        dashboardPageState
          .queryAverageTimeToSubmissionReport(stateContextStub, {
            orgId: '25',
            selectedDates: datesSelectedStub,
            interval: TimeIntervals.Hours,
          })
          .subscribe();
      });

      it('should NOT call pageHelperServiceStub getDateRange function', () =>
        expect(pageHelperServiceStub.getDateRange).not.toHaveBeenCalled());
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        dashboardPageState
          .queryAverageTimeToSubmissionReport(stateContextStub, {
            orgId: '25',
            selectedDates: [],
            interval: TimeIntervals.Hours,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                averageTimeToSubmission: null,
                timeInSelectedInterval: 0,
                weekendTime: 0,
              });

              done();
            },
          });
      });
    });
  });

  describe('Action: QueryAverageTimeToIndexReport', () => {
    describe('when receiving data back from the API', () => {
      const bodyRequestStub = getAggregateBodyRequest({
        buyerId: ['25'] as any,
        dateSubmitted: [],
        isSubmitted: [1],
      });
      const documentAverageStub = [
        {
          buyerId: '25',
          average: '45.7',
        },
      ];
      bodyRequestStub.GroupBy = [];
      bodyRequestStub.ReduceFields = [
        {
          LabelName: SearchLabel.SecondsSpentIndexing,
          Function: SearchReduceFunction.Average,
          Alias: SearchAlias.Average,
        },
      ];

      beforeEach(() => {
        pageHelperServiceStub.getDateRange.mockReturnValueOnce([
          'Sun, 09 Jan 2022 18:14:21 GMT',
          'Tue, 08 Feb 2022 18:14:21 GMT',
        ]);
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(documentAverageStub));
        dashboardHelperServiceStub.getWeekendTime.mockReturnValue(500);
        dashboardPageState
          .queryAverageTimeToIndexReport(stateContextStub, {
            orgId: '25',
            selectedDates: [],
          })
          .subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function', () =>
        expect(documentSearchHelperServiceStub.getAggregateRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            buyerId: ['25'] as any,
            dateSubmitted: [expect.anything(), expect.anything()],
            isSubmitted: [1],
          },
          groupBy: [],
          reduceFields: [
            {
              LabelName: SearchLabel.SecondsSpentIndexing,
              Function: SearchReduceFunction.Average,
              Alias: SearchAlias.Average,
            },
          ],
        }));

      it('should call xdcService postAggregateSearch function', () =>
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState with average time to index data', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          averageTimeToIndex: documentAverageStub[0],
        });
      });
    });

    describe('when selectedDates has data', () => {
      const datesSelectedStub = ['Sun, 09 Jan 2022 18:14:21 GMT', 'Tue, 08 Feb 2022 18:14:21 GMT'];

      beforeEach(() => {
        dashboardPageState
          .queryAverageTimeToIndexReport(stateContextStub, {
            orgId: '25',
            selectedDates: datesSelectedStub,
          })
          .subscribe();
      });

      it('should NOT call pageHelperServiceStub getDateRange function', () =>
        expect(pageHelperServiceStub.getDateRange).not.toHaveBeenCalled());
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        dashboardPageState
          .queryAverageTimeToIndexReport(stateContextStub, {
            orgId: '25',
            selectedDates: [],
          })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                averageTimeToIndex: null,
              });

              done();
            },
          });
      });
    });
  });

  describe('Action: Query queueAging Report', () => {
    describe('receiving data from API', () => {
      const reportDataStub = getQueueAgingReport();
      const bodyRequestStub = getAggregateBodyRequest({ buyerId: ['25'] as any, isSubmitted: [0] });
      bodyRequestStub.Fields = [AdvancedFiltersKeys.BuyerName];
      bodyRequestStub.GroupBy = [AdvancedFiltersKeys.BuyerId];
      bodyRequestStub.ReduceFields = [
        { LabelName: 'hours', Function: SearchReduceFunction.Average, Alias: SearchAlias.Average },
      ];
      bodyRequestStub.ApplyFields = [
        { Function: SearchApplyFunction.HoursToProcess, Alias: SearchAlias.Hours },
      ];

      beforeEach(() => {
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(reportDataStub));
        dashboardPageState.queueAgingReport(stateContextStub, { orgId: '25' }).subscribe();
      });
      it('Should call xdcService postAggregateSearch function', () => {
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenCalledWith(bodyRequestStub);
      });

      it('should patchState for dataQueueAginin', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          dataQueueAging: getQueueAgingReport(),
        });
      });
    });

    describe('grouping data', () => {
      const reportDataStub = getQueueAgingReport();
      const bodyRequestStub = getAggregateBodyRequest({ buyerId: ['25'] as any, isSubmitted: [0] });
      bodyRequestStub.Fields = [AdvancedFiltersKeys.BuyerName];
      bodyRequestStub.GroupBy = [AdvancedFiltersKeys.BuyerId];
      bodyRequestStub.ReduceFields = [
        { LabelName: 'hours', Function: SearchReduceFunction.Average, Alias: SearchAlias.Average },
      ];
      bodyRequestStub.ApplyFields = [
        { Function: SearchApplyFunction.HoursToProcess, Alias: SearchAlias.Hours },
      ];

      beforeEach(() => {
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(reportDataStub));
        dashboardPageState.queueAgingReport(stateContextStub, { orgId: '25' }).subscribe();
      });

      it('should patch group with 3 Days Old', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          dataQueueAging: [
            {
              group: '3+ Days Old',
              count: '7',
              documentId: '',
            },
          ],
        });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        dashboardPageState.queueAgingReport(stateContextStub, { orgId: '25' }).subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 404 });
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              dataQueueAging: [],
            });

            done();
          },
        });
      });
    });
  });

  describe('Action: Query percentageElectronicDelivery Report', () => {
    describe('receiving data from API', () => {
      const reportDataStub = getIngestionTypeData();
      const bodyRequestStub = getAggregateBodyRequest({ buyerId: ['25'] as any });
      bodyRequestStub.GroupBy = [AdvancedFiltersKeys.IngestionType];
      bodyRequestStub.ReduceFields = [
        { Function: SearchReduceFunction.Count, Alias: SearchAlias.Count },
      ];

      beforeEach(() => {
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(reportDataStub));
        dashboardPageState
          .electronicDeliveryReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe();
      });
      it('Should call xdcService postAggregateSearch function', () => {
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenCalledWith(bodyRequestStub);
      });

      it('should patchState for percentageElectronicDelivery', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ingestionType: getIngestionTypeData(),
        });
      });
    });

    describe('when selectedDates has data', () => {
      const datesSelectedStub = ['Sun, 09 Jan 2022 18:14:21 GMT', 'Tue, 08 Feb 2022 18:14:21 GMT'];

      beforeEach(() => {
        dashboardPageState
          .electronicDeliveryReport(stateContextStub, {
            orgId: '25',
            selectedDates: datesSelectedStub,
          })
          .subscribe();
      });

      it('should NOT call pageHelperServiceStub getDateRange function', () =>
        expect(pageHelperServiceStub.getDateRange).not.toHaveBeenCalled());
    });

    describe('grouping data', () => {
      const reportDataStub = getIngestionTypeData();
      const bodyRequestStub = getAggregateBodyRequest({ buyerId: ['25'] as any, isSubmitted: [0] });
      bodyRequestStub.Fields = [AdvancedFiltersKeys.BuyerName];
      bodyRequestStub.GroupBy = [AdvancedFiltersKeys.BuyerId];
      bodyRequestStub.ReduceFields = [
        { LabelName: 'hours', Function: SearchReduceFunction.Average, Alias: SearchAlias.Average },
      ];
      bodyRequestStub.ApplyFields = [
        { Function: SearchApplyFunction.HoursToProcess, Alias: SearchAlias.Hours },
      ];

      beforeEach(() => {
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(reportDataStub));
        dashboardPageState
          .electronicDeliveryReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe();
      });

      it('should patch percentage of invoices sent by electronicMethod', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ingestionType: getIngestionTypeData(),
        });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        dashboardPageState
          .electronicDeliveryReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                ingestionType: [],
              });

              done();
            },
          });
      });
    });
  });

  describe('Action: QueryTopPaperSuppliersReport', () => {
    describe('when receiving data back from the API', () => {
      const bodyRequestStub = getAggregateBodyRequest({
        buyerId: ['25'] as any,
        dateSubmitted: [],
        isSubmitted: [1],
        ingestionType: [IngestionTypes.Scan],
      });
      const topPaperSuppliersStub = getTopPaperSuppliers();
      bodyRequestStub.SortBy = {
        count: SortDirection.Descending,
      };
      bodyRequestStub.GroupBy = [AdvancedFiltersKeys.Supplier];
      bodyRequestStub.ReduceFields = [
        {
          Function: SearchReduceFunction.Count,
          Alias: SearchAlias.Count,
        },
      ];

      beforeEach(() => {
        pageHelperServiceStub.getDateRange.mockReturnValue(['', '']);
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(topPaperSuppliersStub));
        dashboardPageState
          .queryTopPaperSuppliersReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe();
      });

      it('should call documentSearchHelperService getSearchRequestBody function', () =>
        expect(documentSearchHelperServiceStub.getAggregateRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          page: 1,
          pageSize: 3,
          filters: {
            buyerId: ['25'] as any,
            dateSubmitted: ['', ''],
            isSubmitted: [1],
            ingestionType: [IngestionTypes.Scan],
          },
          sortBy: {
            count: SortDirection.Descending,
          },
          groupBy: [AdvancedFiltersKeys.Supplier],
          reduceFields: [
            {
              Function: SearchReduceFunction.Count,
              Alias: SearchAlias.Count,
            },
          ],
        }));

      it('should call xdcService postAggregateSearch function', () =>
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState with top 3 paper suppliers', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          dataTopPaperSuppliers: topPaperSuppliersStub,
        }));
    });

    describe('when selectedDates has data', () => {
      const datesSelectedStub = ['Sun, 09 Jan 2022 18:14:21 GMT', 'Tue, 08 Feb 2022 18:14:21 GMT'];

      beforeEach(() => {
        dashboardPageState
          .queryTopPaperSuppliersReport(stateContextStub, {
            orgId: '25',
            selectedDates: datesSelectedStub,
          })
          .subscribe();
      });

      it('should NOT call pageHelperServiceStub getDateRange function', () =>
        expect(pageHelperServiceStub.getDateRange).not.toHaveBeenCalled());
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        dashboardPageState
          .queryTopPaperSuppliersReport(stateContextStub, { orgId: '25', selectedDates: [] })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                dataTopPaperSuppliers: [],
              });

              done();
            },
          });
      });
    });
  });

  describe('Action: UpdateSubmissionTimeInterval', () => {
    beforeEach(() => {
      dashboardPageState.updateSubmissionTimeInterval(stateContextStub, {
        submissionTimeInterval: TimeIntervals.Minutes,
      });
    });

    it('should patchState submissionTimeInterval to Minutes', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        submissionTimeInterval: TimeIntervals.Minutes,
      }));
  });

  describe('Action: GenerateTransactionCountReport', () => {
    describe('when selectedDates is an empty array', () => {
      const filterValuesStub = {
        buyer: { id: '1', name: 'mock' },
        startDate: undefined,
        endDate: undefined,
      };
      const invoicesStub = getTransactionCountReport();

      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(invoicesStub));
        pageHelperServiceStub.getDateRange.mockReturnValue(['03/01/2022', '03/31/2022']);
        pageHelperServiceStub.getAllMonthsBetweenDates.mockReturnValue(['2022/04']);

        dashboardPageState
          .generateTransactionCountReport(stateContextStub, {
            filterValues: filterValuesStub,
            preview: false,
          })
          .subscribe();
      });

      it('should call pageHelperService getDateRange function to get date span', () =>
        expect(pageHelperServiceStub.getDateRange).toHaveBeenNthCalledWith(1, 30));

      it('should call pageHelperService getAllMonthsBetweenDates function to get all months between date range', () =>
        expect(pageHelperServiceStub.getAllMonthsBetweenDates).toHaveBeenNthCalledWith(1, [
          '03/01/2022',
          '03/31/2022',
        ]));

      it('should call reportService generateTransactionCountByEntityReport function', () =>
        expect(reportsServiceStub.generateTransactionCountByEntityReport).toHaveBeenNthCalledWith(
          1,
          [
            'Customer Name',
            'Year / Month',
            'Entity Name',
            'Entity Code',
            'Electronic Invoice Count',
            'Paper Invoice Count',
            'Total',
          ],
          [
            [
              ['', '2022/04', 'hq - esllc', 'hq - esllc', 1, 0, 1],
              ['', '2022/04', 'None Selected (for inflight docs)', '', 6, 0, 6],
            ],
          ],
          'Transaction Count By Entity',
          ['mock', '', '', '', '7', '0', '7'],
          [expect.anything(), expect.anything()]
        ));
    });

    describe('when selectedDates has data', () => {
      const invoicesStub = getTransactionCountReport();
      const filterValuesStub = {
        buyer: { id: '1', name: 'mock' },
        startDate: '2/1/2022',
        endDate: '2/28/2022',
      };

      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(invoicesStub));
        pageHelperServiceStub.getAllMonthsBetweenDates.mockReturnValue(['2022/04']);
        dashboardPageState
          .generateTransactionCountReport(stateContextStub, {
            filterValues: filterValuesStub,
            preview: false,
          })
          .subscribe();
      });

      it('should NOT call pageHelperService getDateRange function to get date span', () =>
        expect(pageHelperServiceStub.getDateRange).not.toHaveBeenCalled());

      it('should call pageHelperService getAllMonthsBetweenDates function to get all months between date range', () =>
        expect(pageHelperServiceStub.getAllMonthsBetweenDates).toHaveBeenNthCalledWith(1, [
          '2/1/2022',
          '2/28/2022',
        ]));

      it('should call reportService generateTransactionCountByEntityReport function', () =>
        expect(reportsServiceStub.generateTransactionCountByEntityReport).toHaveBeenNthCalledWith(
          1,
          [
            'Customer Name',
            'Year / Month',
            'Entity Name',
            'Entity Code',
            'Electronic Invoice Count',
            'Paper Invoice Count',
            'Total',
          ],
          [
            [
              ['', '2022/04', 'hq - esllc', 'hq - esllc', 1, 0, 1],
              ['', '2022/04', 'None Selected (for inflight docs)', '', 6, 0, 6],
            ],
          ],
          'Transaction Count By Entity',
          ['mock', '', '', '', '7', '0', '7'],
          [expect.anything(), expect.anything()]
        ));
    });

    describe('when ingestionType is Scan', () => {
      const filterValuesStub = {
        buyer: { id: '1', name: 'mock' },
        startDate: '2/1/2022',
        endDate: '2/28/2022',
      };
      const invoicesStub = getTransactionCountReport();
      invoicesStub[0].ingestionType = IngestionTypes.Scan;

      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(invoicesStub));
        pageHelperServiceStub.getAllMonthsBetweenDates.mockReturnValue(['2022/04']);

        dashboardPageState
          .generateTransactionCountReport(stateContextStub, {
            filterValues: filterValuesStub,
            preview: false,
          })
          .subscribe();
      });

      it('should NOT call pageHelperService getDateRange function to get date span', () =>
        expect(pageHelperServiceStub.getDateRange).not.toHaveBeenCalled());

      it('should call pageHelperService getAllMonthsBetweenDates function to get all months between date range', () =>
        expect(pageHelperServiceStub.getAllMonthsBetweenDates).toHaveBeenNthCalledWith(1, [
          '2/1/2022',
          '2/28/2022',
        ]));

      it('should call reportService generateTransactionCountByEntityReport function with paperCount having a count', () =>
        expect(reportsServiceStub.generateTransactionCountByEntityReport).toHaveBeenNthCalledWith(
          1,
          [
            'Customer Name',
            'Year / Month',
            'Entity Name',
            'Entity Code',
            'Electronic Invoice Count',
            'Paper Invoice Count',
            'Total',
          ],
          [
            [
              ['', '2022/04', 'hq - esllc', 'hq - esllc', 0, 1, 1],
              ['', '2022/04', 'None Selected (for inflight docs)', '', 6, 0, 6],
            ],
          ],
          'Transaction Count By Entity',
          ['mock', '', '', '', '6', '1', '7'],
          [expect.anything(), expect.anything()]
        ));
    });

    describe('when receiving an error', () => {
      const filterValuesStub = {
        buyer: { id: '1', name: 'mock' },
        startDate: '2/1/2022',
        endDate: '2/28/2022',
      };
      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        dashboardPageState
          .generateTransactionCountReport(stateContextStub, {
            filterValues: filterValuesStub,
            preview: false,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(reportHelperServiceStub.handleNoReportsFound).toHaveBeenNthCalledWith(
                1,
                'Transaction Count By Entity Report'
              );
              done();
            },
          });
      });
    });

    describe('When preview flag is on', () => {
      const invoicesStub = getTransactionCountReport();
      const filterValuesStub = {
        buyer: { id: '1', name: 'mock' },
        startDate: '2/1/2022',
        endDate: '2/28/2022',
      };

      beforeEach(() => {
        xdcServiceStub.postAggregateSearch.mockReturnValue(of(invoicesStub));
        pageHelperServiceStub.getAllMonthsBetweenDates.mockReturnValue(['2022/04']);

        dashboardPageState
          .generateTransactionCountReport(stateContextStub, {
            filterValues: filterValuesStub,
            preview: true,
          })
          .subscribe();
      });

      it('should patch transactionCountByEntity preview data', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          transactionCountByEntity: {
            headers: transactionCountByEntityStub,
            data: [
              {
                customerName: 'mock',
                electronicInvoiceCount: '7',
                entityCode: '',
                entityName: '',
                paperInvoiceCount: '0',
                total: '7',
                yearMonth: '',
              },
              {
                customerName: '',
                electronicInvoiceCount: '',
                entityCode: '',
                entityName: '',
                paperInvoiceCount: '',
                total: '',
                yearMonth: '2022/04',
              },
              {
                customerName: '',
                electronicInvoiceCount: 1,
                entityCode: 'hq - esllc',
                entityName: 'hq - esllc',
                paperInvoiceCount: 0,
                total: 1,
                yearMonth: '2022/04',
              },
              {
                customerName: '',
                electronicInvoiceCount: 6,
                entityCode: '',
                entityName: 'None Selected (for inflight docs)',
                paperInvoiceCount: 0,
                total: 6,
                yearMonth: '2022/04',
              },
              {
                customerName: 'mock',
                electronicInvoiceCount: '7',
                entityCode: '',
                entityName: '',
                paperInvoiceCount: '0',
                total: '7',
                yearMonth: '',
              },
            ],
          },
        });
      });
    });
  });
});
