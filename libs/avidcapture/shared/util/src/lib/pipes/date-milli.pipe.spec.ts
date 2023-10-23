import { DateTime } from 'luxon';
import { DateMilliPipe } from './date-milli.pipe';

describe('DateMilliPipe', () => {
  const pipe = new DateMilliPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('dateFormatter()', () => {
    let dateValue: string;

    describe('when value is null', () => {
      beforeEach(() => {
        dateValue = pipe.transform(null, '');
      });

      it('should return empty string', () => expect(dateValue).toBe(''));
    });

    describe('when params has a value', () => {
      const date = Date.now();
      const unixDate = Math.floor(date / 1000);

      beforeEach(() => {
        dateValue = pipe.transform(unixDate, 'dd MMM y hh:mma');
      });

      it('should return a formatted date', () => {
        expect(dateValue).toEqual(DateTime.fromMillis(date).toFormat('dd MMM y hh:mma'));
      });
    });
  });
});
