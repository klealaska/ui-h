import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { QueryDocumentCardSetCounts } from '@ui-coe/avidcapture/core/data-access';
import {
  DashboardPageState,
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
import { DashboardFilterComponent } from '@ui-coe/avidcapture/dashboard/ui';
import { CoreStateMock, getBuyersStub, singleOrgTokenStub } from '@ui-coe/avidcapture/shared/test';
import { TimeIntervals } from '@ui-coe/avidcapture/shared/types';
import {
  BarChartComponent,
  HalfPieChartComponent,
  HorizontalBarChartComponent,
  LineChartComponent,
  LoadingSpinnerComponent,
  PieChartComponent,
} from '@ui-coe/avidcapture/shared/ui';
import { MockComponents, MockPipe } from 'ng-mocks';

import { DashboardPageComponent } from './dashboard-page.component';

const buyersStub = getBuyersStub();

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let store: Store;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardPageComponent,
        MockComponents(
          DashboardFilterComponent,
          LoadingSpinnerComponent,
          LineChartComponent,
          PieChartComponent,
          BarChartComponent,
          HalfPieChartComponent,
          HorizontalBarChartComponent
        ),
        MockPipe(TranslatePipe),
      ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([CoreStateMock, DashboardPageState], { developmentMode: true }),
      ],
      providers: [
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    store.reset({
      core: {
        token: singleOrgTokenStub,
        orgNames: [{ id: '25', name: 'test' }],
        filteredBuyers: [{ id: '25', name: 'test' }],
        userAccount: {
          email: 'mocktest',
        },
      },
    });
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when orgNames exists', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: singleOrgTokenStub,
            orgNames: [{ id: '1', name: 'test' }],
            filteredBuyers: [{ id: '1', name: 'test' }],
            userAccount: {
              preferred_username: 'mocktest',
            },
          },
          dashboardPage: {
            dataTransactionCountVolume: [],
            dataExceptionVolume: [],
          },
        });
        fixture.detectChanges();
      });

      it('should set selectedOrgId global var', () =>
        expect(component['selectedOrgId']).toBe(buyersStub[0].id));

      it('should call a set of actions to setup report data', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryTransactionCountReport(buyersStub[0].id, []),
          new ExceptionVolumeReport(buyersStub[0].id, []),
          new QueryAverageTimeToSubmissionReport(buyersStub[0].id, [], TimeIntervals.Minutes),
          new QueryAverageTimeToIndexReport(buyersStub[0].id, []),
          new QueueAgingReport(buyersStub[0].id),
          new ElectronicDeliveryReport(buyersStub[0].id, []),
          new QueryTopPaperSuppliersReport(buyersStub[0].id, []),
          new QueryDocumentCardSetCounts(),
        ]));
    });

    describe('setup transaction count & exception chart information', () => {
      const setUpChart = {
        chartReportName: 'TransactionCountVolumeReport',
        axyXLabel: 'dateReceived',
        axyYLabel: 'count',
        axyXName: 'Invoices',
        axyYName: 'Date',
      };
      const sizeChart = {
        height: window.innerHeight / 3,
        width: window.innerWidth / 3,
        margin: {
          top: 20,
          right: 10,
          bottom: 25,
          left: 40,
        },
      };
      const setUpChartExceptionVolume = {
        chartReportName: 'exceptionVolume',
        pieceCountName: 'count',
        pieceLabelName: 'escalationCategoryIssue',
      };

      const setUpChartExceptionQueueAging = {
        chartReportName: 'exceptionQueueAgingReport',
        axyXLabel: 'group',
        axyYLabel: 'count',
        axyXName: 'Invoices',
        axyYName: 'Date',
      };

      beforeEach(() => {
        store.reset({
          core: {
            token: singleOrgTokenStub,
            orgNames: [{ id: '1', name: 'test' }],
            filteredBuyers: [{ id: '1', name: 'test' }],
            userAccount: {
              preferred_username: 'mocktest',
            },
          },
          dashboardPage: {
            dataTransactionCountVolume: [],
            dataExceptionVolume: [],
          },
        });
        fixture.detectChanges();
      });

      it('should define setUpTransactionCountVolumeReport', () => {
        expect(component.setUpChartTransactionCountVolume).toEqual(setUpChart);
      });

      it('should define sizeChartTransactionCountVolume', () => {
        expect(component.sizeChartTransactionCountVolume).toEqual(sizeChart);
      });

      it('should define setUpExceptionVolumeReport', () => {
        expect(component.setUpChartExceptionVolume).toEqual(setUpChartExceptionVolume);
      });

      it('should define sizeChartExceptionVolume', () => {
        sizeChart.margin = {
          top: 20,
          right: 15,
          bottom: 25,
          left: 25,
        };
        expect(component.sizeChartExceptionVolume).toEqual(sizeChart);
      });

      it('should setUpExceptionQueueAging', () => {
        expect(component.setUpChartExceptionQueueAging).toEqual(setUpChartExceptionQueueAging);
      });
    });

    describe('on window resize', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'setUpTransactionCountVolumeReport').mockImplementation();
        jest.spyOn(component as any, 'setUpExceptionVolumeReport').mockImplementation();
        jest.spyOn(component as any, 'setUpExceptionQueueAging').mockImplementation();
        jest.spyOn(component as any, 'setUpDeliveryMethodReport').mockImplementation();
        jest.spyOn(component as any, 'setupTopPaperSuppliersReport').mockImplementation();

        store.reset({
          core: {
            // token: singleOrgTokenStub,
            orgNames: [{ id: '25', name: 'XXXX' }],
            filteredBuyers: [{ id: '25', name: 'XXXX' }],
            userAccount: {
              preferred_username: 'mocktest',
            },
          },
          dashboardPage: {
            dataTransactionCountVolume: [],
            dataExceptionVolume: [],
          },
        });
        fixture.detectChanges();
        jest.clearAllMocks();
      });

      it('should call all setup report methods', fakeAsync(() => {
        window.dispatchEvent(new Event('resize'));
        tick(1000);

        expect(component['setUpTransactionCountVolumeReport']).toHaveBeenCalledTimes(1);
        expect(component['setUpExceptionVolumeReport']).toHaveBeenCalledTimes(1);
        expect(component['setUpExceptionQueueAging']).toHaveBeenCalledTimes(1);
        expect(component['setUpDeliveryMethodReport']).toHaveBeenCalledTimes(1);
        expect(component['setupTopPaperSuppliersReport']).toHaveBeenCalledTimes(1);
      }));
    });
  });

  describe('orgSelected()', () => {
    describe('when submissionTimeInterval is set to MINUTES', () => {
      beforeEach(() => {
        component['selectedDates'] = [];
        component.submissionTimeInterval = TimeIntervals.Minutes;
        component.orgSelected('25');
      });

      it('should set selectedOrgId global var', () =>
        expect(component['selectedOrgId']).toBe('25'));

      it('should dispatch a set of actions after and org has been selected', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryTransactionCountReport('25', []),
          new ExceptionVolumeReport('25', []),
          new QueueAgingReport('25'),
          new ElectronicDeliveryReport('25', []),
          new QueryTopPaperSuppliersReport('25', []),
          new QueryAverageTimeToSubmissionReport('25', [], TimeIntervals.Minutes),
          new QueryAverageTimeToIndexReport('25', []),
        ]);
      });
    });

    describe('when submissionTimeInterval is set to HOURS', () => {
      beforeEach(() => {
        component['selectedDates'] = [];
        component.submissionTimeInterval = TimeIntervals.Hours;
        component.orgSelected('25');
      });

      it('should set selectedOrgId global var', () =>
        expect(component['selectedOrgId']).toBe('25'));

      it('should dispatch a set of actions after and org has been selected', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryTransactionCountReport('25', []),
          new ExceptionVolumeReport('25', []),
          new QueueAgingReport('25'),
          new ElectronicDeliveryReport('25', []),
          new QueryTopPaperSuppliersReport('25', []),
          new QueryAverageTimeToSubmissionReport('25', [], TimeIntervals.Hours),
          new QueryAverageTimeToIndexReport('25', []),
        ]);
      });
    });
  });

  describe('newDatesSelected()', () => {
    describe('when submissionTimeInterval is set to MINUTES', () => {
      const datesSelectedStub = ['Sun, 09 Jan 2022 18:14:21 GMT', 'Tue, 08 Feb 2022 18:14:21 GMT'];

      beforeEach(() => {
        component['selectedOrgId'] = '25';
        component.submissionTimeInterval = TimeIntervals.Minutes;
        component.newDatesSelected(datesSelectedStub);
      });

      it('should set selectedDates global var', () => {
        expect(component['selectedDates'][0]).toContain('00:00.000');
        expect(component['selectedDates'][1]).toContain('59:59.000');
      });

      it('should dispatch a set of actions after and org has been selected', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryTransactionCountReport('25', [expect.anything(), expect.anything()]),
          new ExceptionVolumeReport('25', [expect.anything(), expect.anything()]),
          new ElectronicDeliveryReport('25', [expect.anything(), expect.anything()]),
          new QueryTopPaperSuppliersReport('25', [expect.anything(), expect.anything()]),
          new QueryAverageTimeToSubmissionReport(
            '25',
            [expect.anything(), expect.anything()],
            TimeIntervals.Minutes
          ),
          new QueryAverageTimeToIndexReport('25', [expect.anything(), expect.anything()]),
        ]);
      });
    });

    describe('when submissionTimeInterval is set to HOURS', () => {
      const datesSelectedStub = ['Sun, 09 Jan 2022 18:14:21 GMT', 'Tue, 08 Feb 2022 18:14:21 GMT'];

      beforeEach(() => {
        component['selectedOrgId'] = '25';
        component.submissionTimeInterval = TimeIntervals.Hours;
        component.newDatesSelected(datesSelectedStub);
      });

      it('should set selectedDates global var', () => {
        expect(component['selectedDates'][0]).toContain('00:00.000');
        expect(component['selectedDates'][1]).toContain('59:59.000');
      });

      it('should dispatch a set of actions after and org has been selected', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryTransactionCountReport('25', [expect.anything(), expect.anything()]),
          new ExceptionVolumeReport('25', [expect.anything(), expect.anything()]),
          new ElectronicDeliveryReport('25', [expect.anything(), expect.anything()]),
          new QueryTopPaperSuppliersReport('25', [expect.anything(), expect.anything()]),
          new QueryAverageTimeToSubmissionReport(
            '25',
            [expect.anything(), expect.anything()],
            TimeIntervals.Hours
          ),
          new QueryAverageTimeToIndexReport('25', [expect.anything(), expect.anything()]),
        ]);
      });
    });
  });

  describe('submissionTimeIntervalChanged()', () => {
    describe('when submissionTimeInterval is set to MINUTES', () => {
      beforeEach(() => {
        component.submissionTimeIntervalChanged(TimeIntervals.Minutes);
      });

      it('should set submissionTimeInterval global var', () =>
        expect(component.submissionTimeInterval).toEqual(TimeIntervals.Minutes));

      it('should dispatch UpdateSubmissionTimeInterval action with Mintues interval', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new UpdateSubmissionTimeInterval(TimeIntervals.Minutes)
        );
      });
    });

    describe('when submissionTimeInterval is set to HOURS', () => {
      beforeEach(() => {
        component.submissionTimeIntervalChanged(TimeIntervals.Hours);
      });

      it('should set submissionTimeInterval global var', () =>
        expect(component.submissionTimeInterval).toEqual(TimeIntervals.Hours));

      it('should dispatch UpdateSubmissionTimeInterval action with Hours interval', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new UpdateSubmissionTimeInterval(TimeIntervals.Hours)
        );
      });
    });
  });

  describe('generateTransactionCountReport()', () => {
    const buyersStub = getBuyersStub();

    beforeEach(() => {
      component['selectedDates'] = [];
      component['selectedOrgId'] = '1';
      component.generateTransactionCountReport(buyersStub);
    });

    it('should dispatch GenerateTransactionCountReport action with Hours interval', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new GenerateTransactionCountReport({
          buyer: buyersStub[0],
          startDate: undefined,
          endDate: undefined,
        })
      );
    });
  });
});
