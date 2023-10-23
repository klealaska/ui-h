import { DateTime } from 'luxon';

import { TimeZonePipe } from './timezone.pipe';

describe('TimezonePipe', () => {
  const pipe = new TimeZonePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the time zone from date string sent in', () => {
    const timezone = DateTime.fromISO('2021-4-2T10:51:29.6302889Z').toFormat('ZZZZ').toUpperCase();
    expect(pipe.transform('2021-4-2T10:51:29.6302889Z')).toBe(timezone);
  });
});
