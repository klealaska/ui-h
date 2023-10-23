import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule, Store } from '@ngxs/store';
import { ScheduleFrequency } from '../../../../core/enums';
import { dialogRefStub, scheduleStub, storeStub } from '../../../../../test/test-stubs';
import * as actions from '../../../schedule-sync.actions';

import { ScheduleModalComponent } from './schedule-modal.component';

describe('ScheduleModalComponent', () => {
  let component: ScheduleModalComponent;
  let fixture: ComponentFixture<ScheduleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleModalComponent],
      imports: [
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { data: {} },
        },
        {
          provide: Store,
          useValue: storeStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('when no schedule object is provided', () => {
      it('should create default schedule form fields', () => {
        expect(Object.keys(component.scheduleForm.controls)).toEqual([
          'frequency',
          'startDate',
          'startTime',
          'timeZone',
          'period',
          'periodTime',
          'isActive',
        ]);
      });
    });

    describe('when schedule object is provided', () => {
      beforeEach(() => {
        component.data.schedule = scheduleStub;
        component.ngOnInit();
      });
      it('should map operation types selected', () =>
        expect(component.operationTypesSelected).toBe(scheduleStub.operationTypes));

      it('should set frquency to daily', () =>
        expect(component.scheduleForm.get('frequency').value).toBe(ScheduleFrequency.Daily));
    });

    describe('when frequency is monthly', () => {
      beforeEach(() => {
        component.data.schedule = { ...scheduleStub, cronText: '0 0 11 29 * ?' };
        component.ngOnInit();
      });
      it('should set frequency to monthly', () =>
        expect(component.scheduleForm.get('frequency').value).toBe(ScheduleFrequency.Monthly));
    });

    describe('when frequency is weekly', () => {
      beforeEach(() => {
        component.data.schedule = { ...scheduleStub, cronText: '0 0 9 ? * 3,5' };
        component.ngOnInit();
      });
      it('should set frequency to weekly', () =>
        expect(component.scheduleForm.get('frequency').value).toBe(ScheduleFrequency.Weekly));
    });
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should call dialog ref close event', () => {
      expect(dialogRefStub.close).toHaveBeenCalled();
    });
  });

  describe('operationTypeCheckboxChange', () => {
    const operationType = { id: 123, name: 'TypeTest' };

    describe('when option is checked', () => {
      beforeEach(() => {
        component.operationTypeCheckboxChange({ checked: true, operationType });
      });

      it('should add new operationType to operationTypesSelected array', () => {
        expect(component.operationTypesSelected).toEqual([operationType]);
      });
    });

    describe('when option is  unchecked', () => {
      beforeEach(() => {
        component.operationTypesSelected = [operationType];
        component.operationTypeCheckboxChange({ checked: false, operationType });
      });

      it('should remove operationType from operationTypesSelected array', () => {
        expect(component.operationTypesSelected).toEqual([]);
      });
    });
  });

  describe('dayCheckboxChange()', () => {
    const dayNumber = 1;
    describe('when day option is checked', () => {
      beforeEach(() => {
        component.dayCheckboxChange({ checked: true, dayNumber });
      });

      it('should add new dayNumber to daysSelected array', () => {
        expect(component.daysSelected).toEqual([dayNumber]);
      });
    });

    describe('when day option is unchecked', () => {
      beforeEach(() => {
        component.daysSelected = [dayNumber];
        component.dayCheckboxChange({ checked: false, dayNumber });
      });

      it('should remove from daysSelected array', () => {
        expect(component.daysSelected).toEqual([]);
      });
    });
  });

  describe('isOperationTypeChecked()', () => {
    let result;
    beforeEach(() => {
      component.operationTypesSelected = [{ id: 1, name: 'test' }];
      result = component.isOperationTypeChecked(1);
    });

    it('should return true from operation', () => {
      expect(result).toBe(true);
    });
  });

  describe('saveSchedule()', () => {
    beforeEach(() => {
      component.saveSchedule(1);
    });

    it('should call post schedule', () => {
      const { frequency, startDate, startTime, period, periodTime, isActive, timeZone } =
        component.scheduleForm.getRawValue();

      const cronText = component['composeCron'](
        frequency,
        period,
        startDate,
        startTime,
        periodTime
      );

      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.PostSchedule({
          cronText,
          id: 1,
          isActive,
          operationTypes: [],
          startDate,
          timeZone,
        })
      );
    });
  });
});
