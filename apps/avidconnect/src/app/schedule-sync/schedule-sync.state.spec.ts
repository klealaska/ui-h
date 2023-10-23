import { of, throwError } from 'rxjs';
import {
  operationTypeStub,
  platformServiceStub,
  platformStub,
  registrationEnablementStub,
  registrationServiceStub,
  scheduleServiceStub,
  scheduleStub,
  stateContextStub,
  storeStub,
  toastServiceStub,
} from '../../test/test-stubs';
import { ToastStatus } from '../core/enums';
import { ScheduledSyncModel, ScheduleSyncState } from './schedule-sync.state';
import * as actions from './schedule-sync.actions';

describe('ScheduleSyncState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    const ScheduleSyncStateStub: ScheduledSyncModel = {
      schedules: [],
      timezones: [],
      operationTypes: [],
    };

    it('should select schedules from state', () =>
      expect(ScheduleSyncState.schedules(ScheduleSyncStateStub as any)).toBe(
        ScheduleSyncStateStub.schedules
      ));

    it('should select timezones time state', () =>
      expect(ScheduleSyncState.timezones(ScheduleSyncStateStub as any)).toBe(
        ScheduleSyncStateStub.timezones
      ));

    it('should select operationTypes time state', () =>
      expect(ScheduleSyncState.operationTypes(ScheduleSyncStateStub as any)).toBe(
        ScheduleSyncStateStub.operationTypes
      ));
  });

  const ScheduleSyncStateStub = new ScheduleSyncState(
    scheduleServiceStub as any,
    platformServiceStub as any,
    registrationServiceStub as any,
    storeStub as any,
    toastServiceStub as any
  );

  describe('Action: GetSchedules', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValueOnce(1);
    });

    describe('when getSchedules returns data', () => {
      beforeEach(() => {
        jest
          .spyOn(scheduleServiceStub, 'getSchedules')
          .mockReturnValue(of([scheduleStub, scheduleStub]));
        ScheduleSyncStateStub.getSchedules(stateContextStub).subscribe();
      });

      it('should patchState schedules with service data', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({
          schedules: [scheduleStub, scheduleStub],
        });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(scheduleServiceStub, 'getSchedules')
          .mockReturnValue(throwError({ reason: 'error' }));
        ScheduleSyncStateStub.getSchedules(stateContextStub).subscribe();
      });

      it('should open error toast message', () => {
        expect(toastServiceStub.open).toHaveBeenCalledWith('error', ToastStatus.Error);
      });
    });
  });

  describe('Action: UpdateSchedule', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValueOnce(1);
    });

    describe('when updateSchedule returns sucess', () => {
      beforeEach(() => {
        jest
          .spyOn(scheduleServiceStub, 'updateSchedule')
          .mockReturnValue(of([scheduleStub, scheduleStub]));
        ScheduleSyncStateStub.updateSchedule(stateContextStub, {
          schedule: scheduleStub,
        }).subscribe();
      });

      it('should open success toast message', () => {
        expect(toastServiceStub.open).toHaveBeenCalledWith(
          'Success! Schedule was updated',
          ToastStatus.Success
        );
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(scheduleServiceStub, 'updateSchedule')
          .mockReturnValue(throwError({ reason: 'error' }));
        ScheduleSyncStateStub.updateSchedule(stateContextStub, {
          schedule: scheduleStub,
        }).subscribe();
      });

      it('should open error toast message', () => {
        expect(toastServiceStub.open).toHaveBeenCalledWith('error', ToastStatus.Error);
      });
    });
  });

  describe('Action: PostSchedule', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValueOnce(1);
    });

    describe('if schedule id is null', () => {
      describe('when addSchedule returns success', () => {
        beforeEach(() => {
          jest.spyOn(scheduleServiceStub, 'addSchedule').mockReturnValue(of(0));
          ScheduleSyncStateStub.postSchedule(stateContextStub, {
            schedule: { ...scheduleStub, id: null },
          }).subscribe();
        });

        it('should open success toast message', () => {
          expect(toastServiceStub.open).toHaveBeenCalledWith(
            'Success! Schedule was created',
            ToastStatus.Success
          );
        });

        it('should disptach GetSchedules action', () => {
          expect(stateContextStub.dispatch).toHaveBeenCalledWith(new actions.GetSchedules());
        });
      });

      describe('when receiving an error', () => {
        beforeEach(() => {
          jest
            .spyOn(scheduleServiceStub, 'addSchedule')
            .mockReturnValue(throwError({ reason: 'error' }));
          ScheduleSyncStateStub.postSchedule(stateContextStub, {
            schedule: { ...scheduleStub, id: null },
          }).subscribe();
        });

        it('should open error toast message', () => {
          expect(toastServiceStub.open).toHaveBeenCalledWith('error', ToastStatus.Error);
        });
      });
    });

    describe('if schedule id is not null', () => {
      const schedule = scheduleStub;
      beforeEach(() => {
        ScheduleSyncStateStub.postSchedule(stateContextStub, {
          schedule,
        });
      });

      it('should disptach UpdateSchedule action', () => {
        expect(stateContextStub.dispatch).toHaveBeenCalledWith(
          new actions.UpdateSchedule(schedule)
        );
      });
    });
  });

  describe('Action: GetTimeZones', () => {
    describe('when getTimeZones returns data', () => {
      beforeEach(() => {
        jest.spyOn(scheduleServiceStub, 'getTimeZones').mockReturnValue(of([]));
        ScheduleSyncStateStub.getTimeZones(stateContextStub).subscribe();
      });

      it('should patchState timezones', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ timezones: [] });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(scheduleServiceStub, 'getTimeZones')
          .mockReturnValue(throwError({ reason: 'error' }));
        ScheduleSyncStateStub.getTimeZones(stateContextStub).subscribe();
      });

      it('should open error toast message', () => {
        expect(toastServiceStub.open).toHaveBeenCalledWith('error', ToastStatus.Error);
      });
    });
  });

  describe('Action: GetOperationTypes', () => {
    beforeEach(() => {
      jest
        .spyOn(storeStub, 'selectSnapshot')
        .mockReturnValue(platformStub)
        .mockReturnValueOnce(1)
        .mockReturnValue(1);
    });
    describe('when services return data', () => {
      beforeEach(() => {
        jest
          .spyOn(platformServiceStub, 'getOperationTypes')
          .mockReturnValue(of([operationTypeStub]));
        jest
          .spyOn(registrationServiceStub, 'getEnablements')
          .mockReturnValue(of([registrationEnablementStub]));

        ScheduleSyncStateStub.getOperationTypes(stateContextStub).subscribe();
      });

      it('should patchState operationTypes', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({
          operationTypes: [{ id: operationTypeStub.id, name: operationTypeStub.name }],
        });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(platformServiceStub, 'getOperationTypes')
          .mockReturnValue(throwError({ reason: 'error' }));
        jest
          .spyOn(registrationServiceStub, 'getEnablements')
          .mockReturnValue(throwError({ reason: 'error' }));

        ScheduleSyncStateStub.getOperationTypes(stateContextStub).subscribe();
      });

      it('should set operationTypes to empty Array', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ operationTypes: [] });
      });
    });
  });
});
