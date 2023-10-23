import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getSetUpDataHalfPieChart } from '@ui-coe/avidcapture/shared/test';

import { HalfPieChartComponent } from './half-pie-chart.component';

describe('HalfPieChartComponent', () => {
  let component: HalfPieChartComponent;
  let fixture: ComponentFixture<HalfPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HalfPieChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HalfPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    const dataReport = getSetUpDataHalfPieChart();
    const mainValue = '100';
    beforeEach(() => {
      jest.mock('d3', () => false);
      component.dataReport = dataReport;
      component.chartSetUp = {
        chartReportName: 'electronicMethod',
        pieceCountName: 'count',
        pieceLabelName: 'escalationCategoryIssue',
      };
      component.chartSize = {
        height: window.innerHeight / 3,
        width: window.innerWidth / 3,
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      };
      component.mainValue = mainValue;
      component.dataReport = dataReport;
      fixture.detectChanges();
      component.ngOnChanges({ mainValue: new SimpleChange(null, mainValue, true) });
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
      component.dataReport = getSetUpDataHalfPieChart();
      component.getReport();
    });

    it('should download csv repor', () => {
      expect(component.dataReport).toEqual(getSetUpDataHalfPieChart());
    });
  });

  describe('private resize()', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'createSvg').mockImplementation();
      jest.spyOn(component as any, 'loadHalfPie').mockImplementation();
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
        chartReportName: 'ExceptionVolumeReport',
        pieceCountName: 'count',
        pieceLabelName: 'escalationCategoryIssue',
      };
      component['resize']();
    });

    it('should define the radius', () => expect(component['radius']).toBeDefined());
    it('should call createSvg', () => expect(component['createSvg']).toBeCalledTimes(1));
    it('should call loadPieChart', () => expect(component['loadHalfPie']).toBeCalledTimes(1));
  });
});
