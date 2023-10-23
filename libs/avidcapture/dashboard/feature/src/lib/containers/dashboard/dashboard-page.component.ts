import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
  ClaimsQueries,
  CoreSelectors,
  QueryDocumentCardSetCounts,
} from '@ui-coe/avidcapture/core/data-access';
import {
  DashboardPageSelectors,
  ElectronicDeliveryReport,
  ExceptionVolumeReport,
  GenerateTransactionCountReport,
  QueryAverageTimeToIndexReport,
  QueryAverageTimeToSubmissionReport,
  QueryTopPaperSuppliersReport,
  QueryTransactionCountReport,
  QueueAgingReport,
  UpdateSubmissionTimeInterval,
} from '@ui-coe/avidcapture/dashboard/data-access';
import {
  Buyer,
  ChartLineSetUp,
  ChartPieSetUp,
  ChartSize,
  DocumentReduce,
  TimeIntervals,
} from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';
import { combineLatest, fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  @Select(DashboardPageSelectors.dataTransactionCountVolume)
  dataTransactionCountVolume$: Observable<DocumentReduce[]>;
  @Select(DashboardPageSelectors.dataExceptionVolume) dataExceptionVolume$: Observable<
    DocumentReduce[]
  >;
  @Select(DashboardPageSelectors.averageTimeToSubmission)
  averageTimeToSubmission$: Observable<number>;
  @Select(DashboardPageSelectors.averageTimeToIndex) averageTimeToIndex$: Observable<number>;
  @Select(DashboardPageSelectors.dataQueueAging) dataQueueAging$: Observable<DocumentReduce[]>;
  @Select(DashboardPageSelectors.percentageElectronicDelivery)
  percentageElectronicDelivery$: Observable<number>;
  @Select(DashboardPageSelectors.dataTopPaperSuppliers) dataTopPaperSuppliers$: Observable<
    DocumentReduce[]
  >;
  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.isLoading) isLoading$: Observable<boolean>;
  @Select(CoreSelectors.filteredBuyers) filteredBuyersCore$: Observable<Buyer[]>;
  @Select(CoreSelectors.orgNames) orgNames$: Observable<Buyer[]>;
  @Select(ClaimsQueries.canViewAllBuyers)
  canViewAllBuyers$: Observable<boolean>;

  setUpChartTransactionCountVolume: ChartLineSetUp;
  sizeChartTransactionCountVolume: ChartSize;
  setUpChartExceptionVolume: ChartPieSetUp;
  sizeChartExceptionVolume: ChartSize;
  setUpChartExceptionQueueAging: ChartLineSetUp;
  sizeChartQueueAging: ChartSize;
  setUpDeliveryMethod: ChartPieSetUp;
  sizeUpDeliveryMethod: ChartSize;
  setUpDataHalfPie: DocumentReduce[];
  setupChartTopPaperSuppliers: ChartLineSetUp;
  sizeChartTopPaperSuppliers: ChartSize;
  submissionTimeInterval = TimeIntervals.Minutes;

  private subscriptions: Subscription[] = [];
  private selectedDates: string[] = [];
  private selectedOrgId = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([this.currentUsername$, this.filteredBuyersCore$])
        .pipe(
          filter(([name, filteredBuyers]) => name != null && filteredBuyers.length > 0),
          tap(([username, filteredBuyersCore]: [string, Buyer[]]) =>
            this.loadPage(filteredBuyersCore)
          )
        )
        .subscribe()
    );
  }

  loadPage(filteredBuyers: Buyer[]): void {
    this.selectedOrgId = filteredBuyers[0].id;
    this.store.dispatch([
      new QueryTransactionCountReport(filteredBuyers[0].id, []),
      new ExceptionVolumeReport(filteredBuyers[0].id, []),
      new QueryAverageTimeToSubmissionReport(filteredBuyers[0].id, [], TimeIntervals.Minutes),
      new QueryAverageTimeToIndexReport(filteredBuyers[0].id, []),
      new QueueAgingReport(filteredBuyers[0].id),
      new ElectronicDeliveryReport(filteredBuyers[0].id, []),
      new QueryTopPaperSuppliersReport(filteredBuyers[0].id, []),
      new QueryDocumentCardSetCounts(),
    ]);

    this.subscriptions.push(
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(500),
          tap(() => {
            this.setUpTransactionCountVolumeReport();
            this.setUpExceptionVolumeReport();
            this.setUpExceptionQueueAging();
            this.setUpDeliveryMethodReport();
            this.setupTopPaperSuppliersReport();
          })
        )
        .subscribe()
    );

    this.setUpTransactionCountVolumeReport();
    this.setUpExceptionVolumeReport();
    this.setUpExceptionQueueAging();
    this.setUpDeliveryMethodReport();
    this.setupTopPaperSuppliersReport();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  orgSelected(orgId: string): void {
    this.selectedOrgId = orgId;
    this.store.dispatch([
      new QueryTransactionCountReport(orgId, this.selectedDates),
      new ExceptionVolumeReport(orgId, this.selectedDates),
      new QueueAgingReport(orgId),
      new ElectronicDeliveryReport(orgId, this.selectedDates),
      new QueryTopPaperSuppliersReport(orgId, this.selectedDates),
      new QueryAverageTimeToSubmissionReport(
        orgId,
        this.selectedDates,
        this.submissionTimeInterval
      ),
      new QueryAverageTimeToIndexReport(orgId, this.selectedDates),
    ]);
  }

  newDatesSelected(dates: string[]): void {
    this.convertDatesToLocalStrings(dates);
    this.store.dispatch([
      new QueryTransactionCountReport(this.selectedOrgId, this.selectedDates),
      new ExceptionVolumeReport(this.selectedOrgId, this.selectedDates),
      new ElectronicDeliveryReport(this.selectedOrgId, this.selectedDates),
      new QueryTopPaperSuppliersReport(this.selectedOrgId, this.selectedDates),
      new QueryAverageTimeToSubmissionReport(
        this.selectedOrgId,
        this.selectedDates,
        this.submissionTimeInterval
      ),
      new QueryAverageTimeToIndexReport(this.selectedOrgId, this.selectedDates),
    ]);
  }

  submissionTimeIntervalChanged(interval: string): void {
    this.submissionTimeInterval = interval as TimeIntervals;
    this.store.dispatch(new UpdateSubmissionTimeInterval(this.submissionTimeInterval));
  }

  generateTransactionCountReport(filteredBuyers: Buyer[]): void {
    const selectedBuyer = filteredBuyers.find(buyer => buyer.id === this.selectedOrgId);
    const filterValues = {
      buyer: selectedBuyer,
      startDate: this.selectedDates[0],
      endDate: this.selectedDates[1],
    };

    this.store.dispatch(new GenerateTransactionCountReport(filterValues));
  }

  private setUpTransactionCountVolumeReport(): void {
    this.setUpChartTransactionCountVolume = {
      chartReportName: 'TransactionCountVolumeReport',
      axyXLabel: 'dateReceived',
      axyYLabel: 'count',
      axyXName: 'Invoices',
      axyYName: 'Date',
    };

    this.sizeChartTransactionCountVolume = {
      height: window.innerHeight / 3,
      width: window.innerWidth / 3,
      margin: {
        top: 20,
        right: 10,
        bottom: 25,
        left: 40,
      },
    };
  }

  private setUpExceptionVolumeReport(): void {
    this.setUpChartExceptionVolume = {
      chartReportName: 'exceptionVolume',
      pieceCountName: 'count',
      pieceLabelName: 'escalationCategoryIssue',
    };

    this.sizeChartExceptionVolume = {
      height: window.innerHeight / 3,
      width: window.innerWidth / 3,
      margin: {
        top: 20,
        right: 15,
        bottom: 25,
        left: 25,
      },
    };
  }

  private setUpExceptionQueueAging(): void {
    this.setUpChartExceptionQueueAging = {
      chartReportName: 'exceptionQueueAgingReport',
      axyXLabel: 'group',
      axyYLabel: 'count',
      axyXName: 'Invoices',
      axyYName: 'Date',
    };

    this.sizeChartQueueAging = {
      height: window.innerHeight / 2.5,
      width: window.innerWidth / 3,
      margin: {
        top: 20,
        right: 15,
        bottom: 25,
        left: 25,
      },
    };
  }

  private setUpDeliveryMethodReport(): void {
    this.setUpDeliveryMethod = {
      chartReportName: 'deliveryMethodReport',
      pieceCountName: 'count',
      pieceLabelName: 'group',
    };

    this.sizeUpDeliveryMethod = {
      height: window.innerHeight / 4,
      width: window.innerWidth / 3,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    };

    this.setUpDataHalfPie = [
      { documentId: '', group: '20%', count: '20' },
      { documentId: '', group: '40%', count: '20' },
      { documentId: '', group: '60%', count: '20' },
      { documentId: '', group: '80%', count: '20' },
      { documentId: '', group: '100%', count: '20' },
    ];
  }

  private setupTopPaperSuppliersReport(): void {
    this.setupChartTopPaperSuppliers = {
      chartReportName: 'topPaperSuppliersReport',
      axyXLabel: 'count',
      axyYLabel: 'supplier',
      axyXName: 'Invoices',
      axyYName: 'Supplier',
    };

    this.sizeChartTopPaperSuppliers = {
      height: window.innerHeight / 5,
      width: window.innerWidth / 3,
      margin: {
        top: 0,
        right: 10,
        bottom: 25,
        left: 10,
      },
    };
  }

  private convertDatesToLocalStrings(dates: string[]): void {
    const startDate = DateTime.fromJSDate(new Date(dates[0]))
      .set({
        hour: 0,
        minute: 0,
        second: 0,
      })
      .toLocal()
      .toString();

    const endDate = DateTime.fromJSDate(new Date(dates[1]))
      .set({
        hour: 23,
        minute: 59,
        second: 59,
      })
      .toLocal()
      .toString();

    this.selectedDates = [startDate, endDate];
  }
}
