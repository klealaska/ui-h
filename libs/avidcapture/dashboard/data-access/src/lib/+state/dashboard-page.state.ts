import { DateTime } from 'luxon';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RetryStrategyService } from '@ui-coe/avidcapture/core/data-access';
import {
  DocumentSearchHelperService,
  FormatterService,
  PageHelperService,
  XdcService,
} from '@ui-coe/avidcapture/core/util';
import { DashboardHelperService } from '@ui-coe/avidcapture/dashboard/util';
import {
  ActivityTypes,
  AdvancedFiltersKeys,
  DocumentReduce,
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
import { Interval } from 'luxon';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import * as actions from './dashboard-page.actions';
import { DashboardPageStateModel } from './dashboard-page.model';
import { ReportsService } from '../service/reports.service';
import { ReportHelperService } from '../service/reports-helper.service';

const defaults: DashboardPageStateModel = {
  dataTransactionCountVolume: [],
  dataExceptionVolume: [],
  averageTimeToSubmission: null,
  averageTimeToIndex: null,
  dataQueueAging: [],
  ingestionType: [],
  dataTopPaperSuppliers: [],
  weekendTime: 0,
  timeInSelectedInterval: 0,
  submissionTimeInterval: TimeIntervals.Minutes,
  transactionCountByEntity: null,
};

@State<DashboardPageStateModel>({
  name: 'dashboardPage',
  defaults,
})
@Injectable()
export class DashboardPageState {
  constructor(
    private xdcService: XdcService,
    private retryStrategyService: RetryStrategyService,
    private documentSearchHelperService: DocumentSearchHelperService,
    private dashboardHelperService: DashboardHelperService,
    private pageHelperService: PageHelperService,
    private formatterService: FormatterService,
    private reportsService: ReportsService,
    private reportHelperService: ReportHelperService
  ) {}

  @Selector()
  static data(state: DashboardPageStateModel): DashboardPageStateModel {
    return state;
  }

  @Action(actions.QueryTransactionCountReport)
  queryTransactionCountReport(
    { patchState }: StateContext<DashboardPageStateModel>,
    { orgId, selectedDates }: actions.QueryTransactionCountReport
  ): Observable<DocumentReduce[]> {
    const orgs: any = [orgId];
    const dateRange =
      selectedDates.length === 0 ? this.pageHelperService.getDateRange(30) : selectedDates;
    const requestBody = this.documentSearchHelperService.getAggregateRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters: {
        buyerId: orgs,
        dateReceived: dateRange,
      },
      fields: [AdvancedFiltersKeys.BuyerName],
      groupBy: [AdvancedFiltersKeys.DateReceived, AdvancedFiltersKeys.BuyerName],
      reduceFields: [
        {
          LabelName: AdvancedFiltersKeys.BuyerName,
          Function: SearchReduceFunction.Count,
          Alias: SearchAlias.Count,
        },
      ],
      applyFields: [
        {
          ParameterName: AdvancedFiltersKeys.DateReceived,
          ParameterValue: '',
          Function: SearchApplyFunction.Day,
          Alias: AdvancedFiltersKeys.DateReceived,
        },
      ],
    });

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((invoices: DocumentReduce[]) => {
        patchState({ dataTransactionCountVolume: invoices });
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({ dataTransactionCountVolume: [] });
        }
        throw err;
      })
    );
  }

  @Action(actions.ExceptionVolumeReport)
  exceptionVolumeReport(
    { patchState }: StateContext<DashboardPageStateModel>,
    { orgId, selectedDates }: actions.ExceptionVolumeReport
  ): Observable<DocumentReduce[]> {
    const dateRange =
      selectedDates.length === 0 ? this.pageHelperService.getDateRange(30) : selectedDates;
    const requestBody = this.documentSearchHelperService.getAggregateRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters: {
        buyerId: [orgId] as any,
        dateReceived: dateRange,
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
    });

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((invoices: DocumentReduce[]) => {
        invoices = invoices.map(inv => {
          return {
            ...inv,
            escalationCategoryIssue: this.formatterService.toPascalCase(
              inv.escalationCategoryIssue
            ),
          };
        });
        patchState({ dataExceptionVolume: invoices });
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({ dataExceptionVolume: [] });
        }
        throw err;
      })
    );
  }

  @Action(actions.QueueAgingReport)
  queueAgingReport(
    { patchState }: StateContext<DashboardPageStateModel>,
    { orgId }: actions.QueueAgingReport
  ): Observable<DocumentReduce[]> {
    const requestBody = this.documentSearchHelperService.getAggregateRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters: {
        buyerId: [orgId] as any,
        escalationCategoryIssue: [
          `-${EscalationCategoryTypes.RecycleBin}`,
          `-${EscalationCategoryTypes.IndexerQa}`,
          `-${EscalationCategoryTypes.None}`,
          `-${ActivityTypes.CreateNewAccount}`,
          `-${EscalationCategoryTypes.DataExceptionAU}`,
          `-${EscalationCategoryTypes.ScanningOpsQC}`,
          `-${EscalationCategoryTypes.IndexerActivity}`,
          `-${EscalationCategoryTypes.IndexingOpsQc}`,
        ],
        isSubmitted: [0],
      },
      sortBy: { group: SortDirection.Descending },
      applyFields: [
        {
          ParameterName: AdvancedFiltersKeys.DateReceived,
          ParameterValue: '',
          Function: SearchApplyFunction.Day,
          Alias: SearchAlias.Group,
        },
      ],
      groupBy: ['group'],
      reduceFields: [
        {
          Alias: SearchAlias.Count,
          Function: SearchReduceFunction.CountDistinct,
          LabelName: 'documentId',
        },
      ],
    });

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((invoices: DocumentReduce[]) => {
        patchState({ dataQueueAging: invoices });
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({ dataQueueAging: [] });
        }
        throw err;
      })
    );
  }

  @Action(actions.QueryAverageTimeToSubmissionReport)
  queryAverageTimeToSubmissionReport(
    { patchState }: StateContext<DashboardPageStateModel>,
    { orgId, selectedDates, interval }: actions.QueryAverageTimeToSubmissionReport
  ): Observable<DocumentReduce[]> {
    const dateRange =
      selectedDates.length === 0 ? this.pageHelperService.getDateRange(30) : selectedDates;

    const secondsInSelectedInterval = Interval.fromDateTimes(
      new Date(dateRange[0]),
      new Date(dateRange[1])
    ).length('seconds');

    const requestBody = this.documentSearchHelperService.getAggregateRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters: {
        buyerId: [orgId] as any,
        dateSubmitted: dateRange,
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
    });

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((averageTimeToSubmissionData: DocumentReduce[]) => {
        patchState({
          weekendTime: this.dashboardHelperService.getWeekendTime(dateRange[0], dateRange[1]),
          timeInSelectedInterval: secondsInSelectedInterval,
          averageTimeToSubmission: averageTimeToSubmissionData[0],
          submissionTimeInterval: interval,
        });
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({
            averageTimeToSubmission: null,
            timeInSelectedInterval: 0,
            weekendTime: 0,
          });
        }
        throw err;
      })
    );
  }

  @Action(actions.QueryAverageTimeToIndexReport)
  queryAverageTimeToIndexReport(
    { patchState }: StateContext<DashboardPageStateModel>,
    { orgId, selectedDates }: actions.QueryAverageTimeToIndexReport
  ): Observable<DocumentReduce[]> {
    const dateRange =
      selectedDates.length === 0 ? this.pageHelperService.getDateRange(30) : selectedDates;

    const requestBody = this.documentSearchHelperService.getAggregateRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters: {
        buyerId: [orgId] as any,
        dateSubmitted: dateRange,
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
    });

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((averageTimeToIndexData: DocumentReduce[]) =>
        patchState({
          averageTimeToIndex: averageTimeToIndexData[0],
        })
      ),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({
            averageTimeToIndex: null,
          });
        }
        throw err;
      })
    );
  }

  @Action(actions.ElectronicDeliveryReport)
  electronicDeliveryReport(
    { patchState }: StateContext<DashboardPageStateModel>,
    { orgId, selectedDates }: actions.ElectronicDeliveryReport
  ): Observable<DocumentReduce[]> {
    const dateRange =
      selectedDates.length === 0 ? this.pageHelperService.getDateRange(30) : selectedDates;
    const requestBody = this.documentSearchHelperService.getAggregateRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters: {
        buyerId: [orgId] as any,
        dateReceived: dateRange,
      },
      groupBy: [AdvancedFiltersKeys.IngestionType],
      reduceFields: [
        {
          Alias: SearchAlias.Count,
          Function: SearchReduceFunction.Count,
        },
      ],
    });

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((ingestionType: DocumentReduce[]) => {
        patchState({ ingestionType });
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({ ingestionType: [] });
        }
        throw err;
      })
    );
  }

  @Action(actions.QueryTopPaperSuppliersReport)
  queryTopPaperSuppliersReport(
    { patchState }: StateContext<DashboardPageStateModel>,
    { orgId, selectedDates }: actions.QueryTopPaperSuppliersReport
  ): Observable<DocumentReduce[]> {
    const dateRange =
      selectedDates.length === 0 ? this.pageHelperService.getDateRange(30) : selectedDates;
    const requestBody = this.documentSearchHelperService.getAggregateRequestBody({
      sourceId: SearchContext.AvidSuite,
      page: 1,
      pageSize: 3,
      filters: {
        buyerId: [orgId] as any,
        dateSubmitted: dateRange,
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
    });

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((dataTopPaperSuppliers: DocumentReduce[]) =>
        patchState({
          dataTopPaperSuppliers,
        })
      ),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({ dataTopPaperSuppliers: [] });
        }
        throw err;
      })
    );
  }

  @Action(actions.UpdateSubmissionTimeInterval)
  updateSubmissionTimeInterval(
    { patchState }: StateContext<DashboardPageStateModel>,
    { submissionTimeInterval }: actions.UpdateSubmissionTimeInterval
  ): void {
    patchState({
      submissionTimeInterval,
    });
  }

  @Action(actions.GenerateTransactionCountReport, { cancelUncompleted: true })
  generateTransactionCountReport(
    { patchState }: StateContext<DashboardPageStateModel>,
    { filterValues, preview }: actions.GenerateTransactionCountReport
  ): Observable<DocumentReduce[]> {
    const selectedDates =
      filterValues.startDate != null
        ? [filterValues.startDate, filterValues.endDate]
        : this.pageHelperService.getDateRange(30);
    const requestBody = this.documentSearchHelperService.getAggregateRequestBody({
      sourceId: SearchContext.AvidSuite,
      page: 1,
      pageSize: 1000000,
      filters: {
        buyerId: [filterValues.buyer.id] as any,
        dateReceived: selectedDates,
      },
      fields: [AdvancedFiltersKeys.BuyerName],
      groupBy: [
        AdvancedFiltersKeys.BuyerName,
        AdvancedFiltersKeys.DateReceived,
        AdvancedFiltersKeys.ShipToName,
        AdvancedFiltersKeys.PropertyCode,
        AdvancedFiltersKeys.IngestionType,
      ],
      reduceFields: [
        {
          LabelName: AdvancedFiltersKeys.BuyerName,
          Function: SearchReduceFunction.Count,
          Alias: SearchAlias.Count,
        },
      ],
      applyFields: [
        {
          ParameterName: AdvancedFiltersKeys.DateReceived,
          ParameterValue: '',
          Function: SearchApplyFunction.Day,
          Alias: AdvancedFiltersKeys.DateReceived,
        },
      ],
    });

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((invoices: DocumentReduce[]) => {
        const headers = [
          'Customer Name',
          'Year / Month',
          'Entity Name',
          'Entity Code',
          'Electronic Invoice Count',
          'Paper Invoice Count',
          'Total',
        ];

        const months = this.pageHelperService.getAllMonthsBetweenDates(selectedDates);
        const uniqueShipToNames = [...new Set(invoices.map(x => x.shipToName))];

        let overallElectronicCount = 0;
        let overallPaperCount = 0;
        let overallTotalCount = 0;
        const transactionCountData = [];
        const data: string[][][] = months.map(month => {
          const monthInvoices = invoices.filter(
            invoice =>
              DateTime.fromMillis(Number(invoice.dateReceived) * 1000).toFormat('yyyy/MM') === month
          );

          return uniqueShipToNames.reduce((acc, name) => {
            let electronicCount = 0;
            let paperCount = 0;
            const dataRows = monthInvoices.filter(
              invoice => invoice.shipToName === name && name?.toLowerCase() !== 'none'
            );

            if (dataRows.length > 0) {
              dataRows.forEach(data => {
                data.ingestionType === IngestionTypes.Scan
                  ? (paperCount += Number(data.count))
                  : (electronicCount += Number(data.count));
              });

              acc.push([
                '',
                DateTime.fromMillis(Number(dataRows[0].dateReceived) * 1000).toFormat('yyyy/MM'),
                dataRows[0].shipToName ?? 'None Selected (for inflight docs)',
                dataRows[0].shipToName ? dataRows[0].propertyCode : '',
                electronicCount,
                paperCount,
                paperCount + electronicCount,
              ]);

              overallElectronicCount += electronicCount;
              overallPaperCount += paperCount;
              overallTotalCount += paperCount + electronicCount;
            }

            return acc;
          }, []);
        });

        if (preview) {
          const headersPreview: string[] = [
            'customerName',
            'yearMonth',
            'entityName',
            'entityCode',
            'electronicInvoiceCount',
            'paperInvoiceCount',
            'total',
          ];

          transactionCountData.push({
            customerName: filterValues.buyer.name,
            yearMonth: '',
            entityName: '',
            entityCode: '',
            electronicInvoiceCount: overallElectronicCount.toString(),
            paperInvoiceCount: overallPaperCount.toString(),
            total: overallTotalCount.toString(),
          });

          data.forEach(row => {
            if (row.length > 0) {
              transactionCountData.push({
                customerName: '',
                yearMonth: row[0][1],
                entityName: '',
                entityCode: '',
                electronicInvoiceCount: '',
                paperInvoiceCount: '',
                total: '',
              });

              row.forEach(dRow => {
                transactionCountData.push({
                  customerName: dRow[0],
                  yearMonth: dRow[1],
                  entityName: dRow[2],
                  entityCode: dRow[3],
                  electronicInvoiceCount: dRow[4],
                  paperInvoiceCount: dRow[5],
                  total: dRow[6],
                });
              });
            }
          });

          transactionCountData.push({
            customerName: filterValues.buyer.name,
            yearMonth: '',
            entityName: '',
            entityCode: '',
            electronicInvoiceCount: overallElectronicCount.toString(),
            paperInvoiceCount: overallPaperCount.toString(),
            total: overallTotalCount.toString(),
          });

          patchState({
            transactionCountByEntity: { headers: headersPreview, data: transactionCountData },
          });
        } else {
          this.reportsService.generateTransactionCountByEntityReport(
            headers,
            data,
            'Transaction Count By Entity',
            [
              filterValues.buyer.name,
              '',
              '',
              '',
              overallElectronicCount.toString(),
              overallPaperCount.toString(),
              overallTotalCount.toString(),
            ],
            selectedDates
          );
        }
      }),

      catchError((err: HttpErrorResponse) => {
        patchState({
          transactionCountByEntity: { headers: [], data: [] },
        });

        this.reportHelperService.handleNoReportsFound('Transaction Count By Entity Report');
        throw err;
      })
    );
  }
}
