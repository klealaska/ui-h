import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getExceptionVolumeReport } from '@ui-coe/avidcapture/shared/test';

import { PieChartComponent } from './pie-chart.component';
import { MockPipe } from 'ng-mocks';
import { TranslatePipe } from '@ngx-translate/core';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieChartComponent, MockPipe(TranslatePipe)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    describe('when dataReport has changes', () => {
      const dataReport = getExceptionVolumeReport();

      beforeEach(() => {
        jest.mock('d3', () => false);
        component.dataReport = dataReport;
        component.chartSetUp = {
          chartReportName: 'ExceptionVolumeReport',
          pieceCountName: 'count',
          pieceLabelName: 'escalationCategoryIssue',
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
      component.dataReport = getExceptionVolumeReport();
      component.getReport();
    });

    it('should download csv repor', () => {
      expect(component.dataReport).toEqual(getExceptionVolumeReport());
    });
  });

  describe('private resize()', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'createSvg').mockImplementation();
      jest.spyOn(component as any, 'loadPieChart').mockImplementation();
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
    it('should call loadPieChart', () => expect(component['loadPieChart']).toBeCalledTimes(1));
  });
});
