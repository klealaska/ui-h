import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getQueueAgingReport } from '@ui-coe/avidcapture/shared/test';

import { BarChartComponent } from './bar-chart.component';
import { MockPipe } from 'ng-mocks';
import { TranslatePipe } from '@ngx-translate/core';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarChartComponent, MockPipe(TranslatePipe)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    const dataReport = getQueueAgingReport();
    beforeEach(() => {
      jest.mock('d3', () => false);
      component.dataReport = dataReport;
      component.chartSetUp = {
        chartReportName: 'barChartReport',
        axyXLabel: 'group',
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

    it('should create report', () => {
      expect(component.dataReport).toBe(dataReport);
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
          jest.spyOn(component as any, 'resize').mockImplementation();
          fixture.detectChanges();
          component.ngOnChanges({ chartSize: new SimpleChange(null, currentValue, true) });
        });

        it('should not call resize', () => expect(component['resize']).not.toBeCalled());
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
          jest.spyOn(component as any, 'resize').mockImplementation();
          fixture.detectChanges();
          component.ngOnChanges({ chartSize: new SimpleChange(prevValue, currentValue, true) });
        });

        it('should call resize', () => expect(component['resize']).toBeCalledTimes(1));
      });
    });
  });

  describe('Download CSV', () => {
    window.URL.createObjectURL = jest.fn();

    beforeEach(() => {
      component.dataReport = getQueueAgingReport();
      component.getReport();
    });

    it('should download csv repor', () => {
      expect(component.dataReport).toEqual(getQueueAgingReport());
    });
  });

  describe('private resize()', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'createSvg').mockImplementation();
      jest.spyOn(component as any, 'loadBarChart').mockImplementation();
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
      component['resize']();
    });

    it('should call createSvg', () => expect(component['createSvg']).toBeCalledTimes(1));
    it('should call loadPieChart', () => expect(component['loadBarChart']).toBeCalledTimes(1));
  });
});
