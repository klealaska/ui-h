import { transformDates } from './date-helpers';

describe('transformDates()', () => {
  const dateFormat = '\\d{2} \\w{3} \\d{4}';
  describe('when both dates are different', () => {
    const multiDateRegex = new RegExp(`${dateFormat} - ${dateFormat}`);
    const startDateStub = new Date('Mon Feb 12 2021 00:00:00 GMT-0600');
    const endDateStub = new Date('Mon Feb 15 2021 00:00:00 GMT-0600');
    let expectedValue: string;

    beforeEach(() => {
      expectedValue = transformDates([startDateStub, endDateStub]);
    });

    it('should return a string with 2 formatted dates', () =>
      expect(expectedValue).toMatch(multiDateRegex));
  });

  describe('when both dates are the same', () => {
    const singleDateRegex = new RegExp(dateFormat);
    const startDateStub = new Date('Mon Feb 12 2021 00:00:00 GMT-0600');
    const endDateStub = new Date('Mon Feb 12 2021 00:00:00 GMT-0600');
    let expectedValue: string;

    beforeEach(() => {
      expectedValue = transformDates([startDateStub, endDateStub]);
    });

    it('should return a string with 2 formatted dates', () =>
      expect(expectedValue).toMatch(singleDateRegex));
  });
});
