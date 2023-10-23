import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { CoreState } from '../../../../core/state/core.state';
import { Registration, Schedule } from '../../../../../app/models';
import * as actions from '../../../schedule-sync.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { ScheduleSyncState } from '../../../schedule-sync.state';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleModalComponent } from '../../presentation/schedule-modal/schedule-modal.component';
import { AvidPage } from '../../../../core/enums';
@Component({
  selector: 'avc-schedule-sync',
  templateUrl: './schedule-sync.component.html',
  styleUrls: ['./schedule-sync.component.scss'],
})
export class ScheduleSyncComponent implements OnInit {
  @Select(ScheduleSyncState.schedules) schedules$: Observable<Schedule[]>;
  registration: Registration;

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.registration = this.store.selectSnapshot<Registration>(CoreState.registration);
    this.store.dispatch([
      new actions.GetSchedules(),
      new coreActions.GetNavigationChevron(AvidPage.CustomerScheduleSync),
    ]);
  }

  scheduleStatusChanged(schedule: Schedule): void {
    schedule = { ...schedule, isActive: !schedule.isActive };
    this.store.dispatch(new actions.UpdateSchedule(schedule));
  }

  openScheduleModal(): void {
    this.dialog.open(ScheduleModalComponent, { data: {} });
  }

  editSchedule(schedule): void {
    this.dialog.open(ScheduleModalComponent, { data: { schedule } });
  }
}
