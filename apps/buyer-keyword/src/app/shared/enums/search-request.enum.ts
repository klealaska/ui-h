export enum SearchReduceFunction {
  Count = 'COUNT',
  CountDistinct = 'COUNT_DISTINCT',
  CountDistinctish = 'COUNT_DISTINCTISH',
  Sum = 'SUM',
  Average = 'AVG',
  Max = 'MAX',
  Min = 'MIN',
}

export enum SearchApplyFunction {
  Contains = 'contains',
  StartsWith = 'startswith',
  Day = 'day',
  DaysToProcess = 'days_to_process',
  HoursToProcess = 'hours_to_process',
  MinutesToProcess = 'minutes_to_process',
  SecondsToSubmit = 'seconds_to_submit',
}

export enum SearchContext {
  AvidSuite = 'AvidSuite',
}

export enum SearchAlias {
  Average = 'average',
  Count = 'count',
  Days = 'days',
  Hours = 'hours',
  Group = 'group',
  Sum = 'sum',
  Minutes = 'minutes',
  Seconds = 'seconds',
}

export enum SearchLabel {
  SecondsSpentIndexing = 'secondsSpentIndexing',
}
