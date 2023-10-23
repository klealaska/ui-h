import { FilterValues, TimeIntervals } from '@ui-coe/avidcapture/shared/types';

export class QueryTransactionCountReport {
  static readonly type = '[DashboardState] QueryTransactionCountReport';
  constructor(public orgId: string, public selectedDates: string[]) {}
}

export class ExceptionVolumeReport {
  static readonly type = '[DashboardState] ExceptionVolumeReport';
  constructor(public orgId: string, public selectedDates: string[]) {}
}

export class QueryAverageTimeToSubmissionReport {
  static readonly type = '[DashboardState] QueryAverageTimeToSubmissionReport';
  constructor(
    public orgId: string,
    public selectedDates: string[],
    public interval: TimeIntervals
  ) {}
}

export class QueryAverageTimeToIndexReport {
  static readonly type = '[DashboardState] QueryAverageTimeToIndexReport';
  constructor(public orgId: string, public selectedDates: string[]) {}
}

export class QueueAgingReport {
  static readonly type = '[DashboardState] QueueAgingReport';
  constructor(public orgId: string) {}
}

export class ElectronicDeliveryReport {
  static readonly type = '[DashboardState] ElectronicDeliveryReport';
  constructor(public orgId: string, public selectedDates: string[]) {}
}

export class QueryTopPaperSuppliersReport {
  static readonly type = '[DashboardState] QueryTopPaperSuppliersReport';
  constructor(public orgId: string, public selectedDates: string[]) {}
}

export class UpdateSubmissionTimeInterval {
  static readonly type = '[DashboardState] UpdateSubmissionTimeInterval';
  constructor(public submissionTimeInterval: TimeIntervals) {}
}

export class GenerateTransactionCountReport {
  static readonly type = '[DashboardState] GenerateTransactionCountReport';
  constructor(public filterValues: FilterValues, public preview: boolean = false) {}
}
