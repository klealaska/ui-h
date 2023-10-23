import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { ScheduleFrequency, SchedulePeriod } from '../../../../core/enums';
import { Observable } from 'rxjs';
import { OperationType, Schedule, Timezone } from '../../../../models';
import * as actions from '../../../schedule-sync.actions';
import { ScheduleSyncState } from '../../../schedule-sync.state';
import { DateTime } from 'luxon';

@Component({
  selector: 'avc-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.scss'],
})
export class ScheduleModalComponent implements OnInit {
  @Select(ScheduleSyncState.timezones) timezones$: Observable<Timezone[]>;
  @Select(ScheduleSyncState.operationTypes) operationTypes$: Observable<OperationType[]>;

  hours: number[] = [];
  scheduleForm: UntypedFormGroup;
  minDate = new Date();
  operationTypesSelected: OperationType[] = [];
  daysSelected: number[] = [];

  daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    private dialogRef: MatDialogRef<ScheduleModalComponent>,
    private store: Store,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      schedule: Schedule;
    }
  ) {}

  ngOnInit(): void {
    this.store.dispatch([new actions.GetTimeZones(), new actions.GetOperationTypes()]);
    this.hours = Array.from({ length: 24 }, (_, i) => i + 1);

    if (this.data.schedule) {
      const { schedule } = this.data;

      this.operationTypesSelected = schedule.operationTypes;
      this.daysSelected = this.getDaysOfWeekFromCron(schedule.cronText);

      let frequency = ScheduleFrequency.Daily;

      if (this.daysSelected.length) {
        frequency = ScheduleFrequency.Weekly;
      } else if (this.getDayOfMonthFromCron(schedule.cronText)) {
        frequency = ScheduleFrequency.Monthly;
      }

      this.scheduleForm = this.fb.group({
        frequency: [frequency],
        startDate: [new Date(schedule.startDate), Validators.required],
        startTime: [this.getHourFromCron(schedule.cronText), Validators.required],
        timeZone: [schedule.timeZone, Validators.required],
        period: [
          this.getPeriodTimeFromCron(schedule.cronText) === 0
            ? SchedulePeriod.Once
            : SchedulePeriod.Every,
        ],
        periodTime: [this.getPeriodTimeFromCron(schedule.cronText) || 1],
        isActive: [this.data.schedule.isActive],
      });
    } else {
      this.scheduleForm = this.fb.group({
        frequency: [ScheduleFrequency.Daily],
        startDate: [new Date(), Validators.required],
        startTime: [DateTime.now().plus({ hours: 1 }).toObject().hour, Validators.required],
        timeZone: ['Central Standard Time', Validators.required],
        period: [SchedulePeriod.Once],
        periodTime: [1],
        isActive: [true],
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  operationTypeCheckboxChange({ checked, operationType }): void {
    const item = this.operationTypesSelected.find(ot => ot.id === operationType.id);

    if (checked) {
      this.operationTypesSelected.push(operationType);
    } else {
      this.operationTypesSelected.splice(this.operationTypesSelected.indexOf(item), 1);
    }
  }

  dayCheckboxChange({ checked, dayNumber }): void {
    if (checked) {
      this.daysSelected.push(dayNumber);
    } else {
      this.daysSelected.splice(this.daysSelected.indexOf(dayNumber), 1);
    }
  }

  isOperationTypeChecked(id: number): boolean {
    return this.operationTypesSelected.map(ot => ot.id).includes(id);
  }

  saveSchedule(scheduleId: number): void {
    const { frequency, startDate, startTime, period, periodTime, isActive, timeZone } =
      this.scheduleForm.getRawValue();
    const cronText = this.composeCron(frequency, period, startDate, startTime, periodTime);

    this.store
      .dispatch(
        new actions.PostSchedule({
          id: scheduleId,
          cronText,
          isActive,
          startDate,
          timeZone,
          operationTypes: this.operationTypesSelected,
        })
      )
      .subscribe(() => this.close());
  }

  private composeCron(
    frequency: ScheduleFrequency,
    period: SchedulePeriod,
    startDate: Date,
    startTime: number,
    periodTime: number
  ) {
    let cron = '0 0 ';
    if (period === SchedulePeriod.Every) {
      cron += startTime + '/' + periodTime + ' ';
    } else {
      cron += startTime + ' ';
    }
    switch (frequency) {
      case ScheduleFrequency.Daily:
        cron += '* * ?';
        break;
      case ScheduleFrequency.Weekly:
        cron += `? * ${this.daysSelected.join(',')}`;
        break;
      case ScheduleFrequency.Monthly:
        cron += startDate.getDate() + ' * ?';
        break;
    }
    return cron;
  }

  private getHourFromCron(cronText: string): number {
    const hour = cronText.split(' ')[2];
    return hour.includes('/') ? parseInt(hour.split('/')[0], 10) : parseInt(hour, 10);
  }

  private getPeriodTimeFromCron(cronText: string): number {
    const hour = cronText.split(' ')[2];
    return hour.includes('/') ? parseInt(hour.split('/')[1], 10) : 0;
  }

  private getDaysOfWeekFromCron(cronText: string): number[] {
    const days = cronText.split(' ')[5];
    return days.includes('*') || days.includes('?')
      ? []
      : days.split(',').map(day => parseInt(day, 10));
  }

  private getDayOfMonthFromCron(cronText: string): number {
    const day = cronText.split(' ')[3];
    return day.includes('*') || day.includes('?') ? 0 : parseInt(day, 10);
  }
}
