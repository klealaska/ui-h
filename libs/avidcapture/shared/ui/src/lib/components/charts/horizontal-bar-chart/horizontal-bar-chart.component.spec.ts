import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTopPaperSuppliers } from '@ui-coe/avidcapture/shared/test';

import { HorizontalBarChartComponent } from './horizontal-bar-chart.component';

describe('HorizontalBarChartComponent', () => {
  let component: HorizontalBarChartComponent;
  let fixture: ComponentFixture<HorizontalBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorizontalBarChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalBarChartComponent);
    component = fixture.componentInstance;
    component.dataReport = getTopPaperSuppliers();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    const dataReport = getTopPaperSuppliers();
    beforeEach(() => {
      jest.mock('d3', () => false);
      component.dataReport = dataReport;
      component.chartSetup = {
        chartReportName: 'horizontalBarChart',
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
      component.dataReport = getTopPaperSuppliers();
      component.getReport();
    });

    it('should download csv repor', () => {
      expect(component.dataReport).toEqual(getTopPaperSuppliers());
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
      component.chartSetup = {
        chartReportName: 'horizontalBarChart',
        axyXLabel: 'group',
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
