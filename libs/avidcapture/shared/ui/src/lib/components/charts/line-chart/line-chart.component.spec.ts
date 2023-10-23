import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getHistoricalVolumeReport } from '@ui-coe/avidcapture/shared/test';

import { LineChartComponent } from './line-chart.component';
import { MockPipe } from 'ng-mocks';
import { TranslatePipe } from '@ngx-translate/core';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineChartComponent, MockPipe(TranslatePipe)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    describe('dataReport changes', () => {
      describe('when previous value is null', () => {
        const dataReport = getHistoricalVolumeReport();

        beforeEach(() => {
          jest.mock('d3', () => false);
          jest.spyOn(component as any, 'render').mockImplementation();
          component.dataReport = dataReport;
          component.chartSetUp = {
            chartReportName: 'lineChart',
            axyXLabel: 'dateReceived',
            axyYLabel: 'count',
            axyXName: 'Invoices',
            axyYName: 'Date',
          };
          component.chartSize = {
            height: window.innerHeight / 3,
            width: window.innerWidth / 3,
            margin: {
              top: 20,
              right: 15,
              bottom: 25,
              left: 25,
            },
          };
          fixture.detectChanges();
          component.ngOnChanges({ dataReport: new SimpleChange(null, dataReport, true) });
        });

        it('should not call render', () => expect(component['render']).not.toBeCalled());
      });

      describe('when previous value is NOT null', () => {
        const dataReport = getHistoricalVolumeReport();
        const prevValue = {
          height: 0,
          width: 0,
          margin: {
            top: 20,
            right: 15,
            bottom: 25,
            left: 25,
          },
        };

        beforeEach(() => {
          jest.mock('d3', () => false);
          jest.spyOn(component as any, 'render');
          component.dataReport = dataReport;
          component.chartSetUp = {
            chartReportName: 'lineChart',
            axyXLabel: 'dateReceived',
            axyYLabel: 'count',
            axyXName: 'Invoices',
            axyYName: 'Date',
          };
          component.chartSize = {
            height: window.innerHeight / 3,
            width: window.innerWidth / 3,
            margin: {
              top: 20,
              right: 15,
              bottom: 25,
              left: 25,
            },
          };
          fixture.detectChanges();
          component.ngOnChanges({ dataReport: new SimpleChange(prevValue, dataReport, true) });
        });

        it('should call render', () => expect(component['render']).toBeCalledTimes(1));
        it('should create report', () => expect(component.dataReport).toBe(dataReport));
      });
    });

    describe('chartSize changes', () => {
      describe('when previous value is null', () => {
        const currentValue = {
          height: window.innerHeight / 3,
          width: window.innerWidth / 3,
          margin: {
            top: 20,
            right: 15,
            bottom: 25,
            left: 25,
          },
        };

        beforeEach(() => {
          jest.mock('d3', () => false);
          jest.spyOn(component as any, 'render').mockImplementation();
          fixture.detectChanges();
          component.ngOnChanges({ chartSize: new SimpleChange(null, currentValue, true) });
        });

        it('should not call render', () => expect(component['render']).not.toBeCalled());
      });

      describe('when previous value is NOT null', () => {
        const prevValue = {
          height: 0,
          width: 0,
          margin: {
            top: 20,
            right: 15,
            bottom: 25,
            left: 25,
          },
        };

        const currentValue = {
          height: 40,
          width: 40,
          margin: {
            top: 20,
            right: 15,
            bottom: 25,
            left: 25,
          },
        };

        beforeEach(() => {
          jest.mock('d3', () => false);
          jest.spyOn(component as any, 'render').mockImplementation();
          fixture.detectChanges();
          component.ngOnChanges({ chartSize: new SimpleChange(prevValue, currentValue, true) });
        });

        it('should call render', () => expect(component['render']).toBeCalledTimes(1));
      });
    });
  });

  describe('private render()', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'createSvg').mockImplementation();
      jest.spyOn(component as any, 'dateChart').mockImplementation();
      component.chartSize = {
        height: 40,
        width: 40,
        margin: {
          top: 20,
          right: 15,
          bottom: 25,
          left: 25,
        },
      };
      component.chartSetUp = {
        chartReportName: 'lineChart',
        axyXLabel: 'dateReceived',
        axyYLabel: 'count',
        axyXName: 'Invoices',
        axyYName: 'Date',
      };
      component['render']();
    });

    it('should call createSvg', () => expect(component['createSvg']).toBeCalledTimes(1));
    it('should call loadPieChart', () => expect(component['dateChart']).toBeCalledTimes(1));
  });
});
