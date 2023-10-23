import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { TimeIntervals } from '@ui-coe/avidcapture/shared/types';
import { MockPipe } from 'ng-mocks';

import { DashboardFilterComponent } from './dashboard-filter.component';

describe('DashboardFilterComponent', () => {
  let component: DashboardFilterComponent;
  let fixture: ComponentFixture<DashboardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardFilterComponent, MockPipe(TranslatePipe)],
      imports: [
        MatCardModule,
        MatDatepickerModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFilterComponent);
    component = fixture.componentInstance;
    component.submissionTimeInterval = TimeIntervals.Minutes;
    component.orgNames = [{ id: '1', name: 'mock' }];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should define today', () => expect(component.today instanceof Date).toBeTruthy());

    it('should define minDate', () => expect(component.minDate instanceof Date).toBeTruthy());

    it('should define the dateRangeForm', () => expect(component.dateRangeForm).toBeDefined());

    it('should set dateRangeForm.startDate to a date', () =>
      expect(component.dateRangeForm.get('startDate').value instanceof Date).toBeTruthy());

    it('should set dateRangeForm.endDate to a date', () =>
      expect(component.dateRangeForm.get('endDate').value instanceof Date).toBeTruthy());
  });

  describe('dateChanged()', () => {
    describe('when dateRangeForm.endDate IS NOT null', () => {
      beforeEach(() => {
        jest.spyOn(component.newDatesSelected, 'emit').mockImplementation();
        component.dateRangeForm.get('startDate').setValue('Sun, 09 Jan 2022 18:14:21 GMT');
        component.dateRangeForm.get('endDate').setValue('Tue, 08 Feb 2022 18:14:21 GMT');
        component.dateChanged();
      });

      it('should emit newDatesSelected', () =>
        expect(component.newDatesSelected.emit).toHaveBeenNthCalledWith(1, [
          expect.anything(),
          expect.anything(),
        ]));
    });

    describe('when dateRangeForm.endDate IS null', () => {
      beforeEach(() => {
        jest.spyOn(component.newDatesSelected, 'emit').mockImplementation();
        component.dateRangeForm.get('startDate').setValue('Sun, 09 Jan 2022 18:14:21 GMT');
        component.dateRangeForm.get('endDate').setValue(null);
        component.dateChanged();
      });

      it('should NOT emit newDatesSelected', () =>
        expect(component.newDatesSelected.emit).not.toHaveBeenCalled());
    });
  });

  describe('submissionTimeIntervalChange()', () => {
    beforeEach(() => {
      jest.spyOn(component.submissionTimeIntervalChanged, 'emit').mockImplementation();
      component.submissionTimeIntervalChange(TimeIntervals.Hours);
    });

    it('should set submissionTimeInterval to passed in value', () =>
      expect(component.submissionTimeInterval).toBe(TimeIntervals.Hours));

    it('should emit passed in value', () =>
      expect(component.submissionTimeIntervalChanged.emit).toHaveBeenNthCalledWith(
        1,
        TimeIntervals.Hours
      ));
  });

  describe('getAvgTimeToIndexIph()', () => {
    beforeEach(() => {
      component.averageTimeToIndex = 45.88481818138;
    });

    it('should return indexing per hour number rounded down to the nearest 100th', () =>
      expect(component.getAvgTimeToIndexIph()).toBe(78.46));
  });
});
