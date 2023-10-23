import { DateTime } from 'luxon';

export function transformDates(dates: Date[]): string {
  const startDate = DateTime.fromJSDate(dates[0]).toFormat('dd MMM y');
  const endDate = DateTime.fromJSDate(dates[1]).toFormat('dd MMM y');

  return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
}
