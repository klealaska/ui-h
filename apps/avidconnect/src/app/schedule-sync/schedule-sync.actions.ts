import { Schedule } from '../models';

export class GetSchedules {
  static readonly type = '[ScheduledSyncState] GetSchedules';
}

export class UpdateSchedule {
  static readonly type = '[ScheduledSyncState] UpdateSchedule';
  constructor(public schedule: Schedule) {}
}

export class PostSchedule {
  static readonly type = '[ScheduledSyncState] PostSchedule';
  constructor(public schedule: Schedule) {}
}

export class GetTimeZones {
  static readonly type = '[ScheduledSyncState] GetTimeZones';
}

export class GetOperationTypes {
  static readonly type = '[ScheduledSyncState] GetOperationTypes';
}
