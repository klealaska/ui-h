import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { forkJoin, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastStatus } from '../core/enums';
import { PlatformService } from '../core/services/platform.service';
import { RegistrationService } from '../core/services/registration.service';
import { ScheduleService } from '../core/services/schedule.service';
import { ToastService } from '../core/services/toast.service';
import { CoreState } from '../core/state/core.state';
import {
  AvidException,
  OperationType,
  Platform,
  RegistrationEnablement,
  Schedule,
  Timezone,
} from '../models';
import * as actions from './schedule-sync.actions';

export interface ScheduledSyncModel {
  schedules: Schedule[];
  timezones: Timezone[];
  operationTypes: OperationType[];
}

const defaults: ScheduledSyncModel = {
  schedules: [],
  timezones: [],
  operationTypes: [],
};

@State<ScheduledSyncModel>({ name: 'scheduleSync', defaults })
@Injectable()
export class ScheduleSyncState {
  constructor(
    private scheduleService: ScheduleService,
    private platformService: PlatformService,
    private registrationService: RegistrationService,
    private store: Store,
    private toast: ToastService
  ) {}

  @Selector()
  static schedules(state: ScheduledSyncModel): Schedule[] {
    return state.schedules;
  }

  @Selector()
  static timezones(state: ScheduledSyncModel): Timezone[] {
    return state.timezones;
  }

  @Selector()
  static operationTypes(state: ScheduledSyncModel): OperationType[] {
    return state.operationTypes;
  }

  @Action(actions.GetSchedules)
  getSchedules({ patchState }: StateContext<ScheduledSyncModel>): Observable<Schedule[]> {
    const customerId = this.store.selectSnapshot(CoreState.customerId);
    const registrationId = this.store.selectSnapshot(CoreState.registrationId);
    return this.scheduleService
      .getSchedules(customerId, registrationId, { includeInactive: true })
      .pipe(
        tap(schedules => {
          schedules = schedules.sort((a, b) => (a.createdDate > b.createdDate ? 1 : -1));
          patchState({ schedules });
        }),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          throw err;
        })
      );
  }

  @Action(actions.UpdateSchedule)
  updateSchedule(
    { dispatch }: StateContext<ScheduledSyncModel>,
    { schedule }: actions.UpdateSchedule
  ): Observable<void> {
    const customerId = this.store.selectSnapshot(CoreState.customerId);
    const registrationId = this.store.selectSnapshot(CoreState.registrationId);
    return this.scheduleService
      .updateSchedule(customerId, registrationId, schedule.id, schedule)
      .pipe(
        tap(() => {
          this.toast.open('Success! Schedule was updated', ToastStatus.Success);
          dispatch(new actions.GetSchedules());
        }),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          throw err;
        })
      );
  }

  @Action(actions.PostSchedule)
  postSchedule(
    { dispatch }: StateContext<ScheduledSyncModel>,
    { schedule }: actions.PostSchedule
  ): Observable<void> {
    const customerId = this.store.selectSnapshot(CoreState.customerId);
    const registrationId = this.store.selectSnapshot(CoreState.registrationId);
    if (schedule.id) {
      dispatch(new actions.UpdateSchedule(schedule));
    } else {
      return this.scheduleService.addSchedule(customerId, registrationId, schedule).pipe(
        tap(() => {
          this.toast.open('Success! Schedule was created', ToastStatus.Success);
          dispatch(new actions.GetSchedules());
        }),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          throw err;
        })
      );
    }
  }

  @Action(actions.GetTimeZones)
  getTimeZones({ patchState }: StateContext<ScheduledSyncModel>): Observable<Timezone[]> {
    return this.scheduleService.getTimeZones().pipe(
      tap(timezones => patchState({ timezones })),
      catchError((err: AvidException) => {
        this.toast.open(err.reason, ToastStatus.Error);
        throw err;
      })
    );
  }

  @Action(actions.GetOperationTypes)
  getOperationTypes({ patchState }: StateContext<ScheduledSyncModel>): Observable<{
    platformOperationTypes: OperationType[];
    registrationEnablements: RegistrationEnablement[];
  }> {
    const platform = this.store.selectSnapshot<Platform>(CoreState.platform);
    const customerId = this.store.selectSnapshot<number>(CoreState.customerId);
    const registrationId = this.store.selectSnapshot<number>(CoreState.registrationId);

    return forkJoin({
      platformOperationTypes: this.platformService.getOperationTypes(platform.id),
      registrationEnablements: this.registrationService.getEnablements(customerId, registrationId),
    }).pipe(
      tap(({ platformOperationTypes, registrationEnablements }) => {
        const registrationEnablementIds = registrationEnablements
          .filter(item => item.isActive)
          .map(enablement => enablement.operationTypeId);

        const operationTypes = platformOperationTypes.filter(operationType =>
          registrationEnablementIds.includes(operationType.id)
        );

        patchState({ operationTypes });
      }),
      catchError(err => {
        patchState({ operationTypes: [] });
        throw err;
      })
    );
  }
}
