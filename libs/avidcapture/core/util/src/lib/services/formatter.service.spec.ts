import { TestBed } from '@angular/core/testing';
import { InputDataTypes } from '@ui-coe/avidcapture/shared/types';

import { FormatterService } from './formatter.service';

describe('FormatterService', () => {
  let service: FormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSanitizedFieldValue()', () => {
    describe('when no value is given', () => {
      it('should return value as empty string', () =>
        expect(service.getSanitizedFieldValue({ type: InputDataTypes.Date } as any, '')).toBe(''));
    });

    describe('when January 20, 2021 is passed in', () => {
      it('should return value as 01/20/2021', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Date } as any, 'January 20, 2021')
        ).toBe('01/20/2021'));
    });

    describe('when field type is not Date or Currency', () => {
      it('should return passed in value', () =>
        expect(service.getSanitizedFieldValue({ type: InputDataTypes.String } as any, 'mock')).toBe(
          'mock'
        ));
    });

    describe('when field type is not Date or Currency but has & in string', () => {
      it('should return passed in value', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.String } as any, 'mock & test')
        ).toBe('mock & test'));
    });

    describe('when field is InvoiceNumber and type is string', () => {
      it('should remove no allowed characters', () => {
        expect(
          service.getSanitizedFieldValue(
            { type: InputDataTypes.String, key: 'InvoiceNumber' } as any,
            '123AbC*().-_,$%&'
          )
        ).toBe('123AbC*().-_, ');
      });
    });

    describe('when field is InvoiceNumber and has * and is a customer user', () => {
      it('should keep asterisk character', () => {
        expect(
          service.getSanitizedFieldValue(
            { type: InputDataTypes.String, key: 'InvoiceNumber' } as any,
            '123AbC*().-_,$%&***',
            false
          )
        ).toBe('123AbC*().-_, ***');
      });
    });

    describe('when field is InvoiceNumber and has * and is an indexer user', () => {
      it('should remove asterisk character', () => {
        expect(
          service.getSanitizedFieldValue(
            { type: InputDataTypes.String, key: 'InvoiceNumber' } as any,
            '123AbC*().-_,$%&***',
            true
          )
        ).toBe('123AbC ().-_, ');
      });
    });

    describe('when field is InvoiceNumber and type is string and has special dash character', () => {
      const special_dash = '\u2010\u2212\u2013';
      it('should replace speciual dash to normal dash', () => {
        expect(
          service.getSanitizedFieldValue(
            { type: InputDataTypes.String, key: 'InvoiceNumber' } as any,
            special_dash
          )
        ).toBe('---');
      });
    });
  });

  describe('getFormattedFieldValue()', () => {
    describe('when value is string', () => {
      it('should return passed in string', () =>
        expect(service.getFormattedFieldValue({ type: InputDataTypes.String } as any, 'mock')).toBe(
          'mock'
        ));
    });

    describe('when field type is not Date or Currency but has & in string', () => {
      it('should return passed in value', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.String } as any, 'mock & test')
        ).toBe('mock & test'));
    });
  });

  describe('getFormattedDate()', () => {
    describe('when value is 6 digits in length and is in mm dd yy order', () => {
      it('should return value is true', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, '121220')
        ).toBeTruthy());
    });

    describe('when value is 6 digits in length and is in a cray cray order', () => {
      it('should return value is false', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, '230202')
        ).toBeFalsy());
    });

    describe('when value is 6 digits in length and is not in US traditional order', () => {
      it('should return value is false', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, '190923')
        ).toBeFalsy());
    });

    describe('when value is 12/12/20', () => {
      it('should return value as MM/dd/yyyy', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, '12/12/20')
        ).toBe('12/12/2020'));
    });
    describe('when value is Dec 20 2020', () => {
      it('should return value as MM/dd/yyyy', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, 'Dec 20 2020')
        ).toBe('12/20/2020'));
    });
    describe('when value is 2020-12-13', () => {
      it('should return value as MM/dd/yyyy', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, '2020-12-13')
        ).toBe('12/13/2020'));
    });
    describe('when value is 2020 12 13', () => {
      it('should return value as MM/dd/yyyy', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, '2020 12 13')
        ).toBe('12/13/2020'));
    });

    describe('when value is 17/01/2015', () => {
      it('should return value as MM/dd/yyyy', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, '17/01/2015')
        ).toBe('01/17/2015'));
    });

    describe('when value is invalid', () => {
      it('should return empty string', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, 'invalid')
        ).toBeNull());
    });
    describe('when value given does not have a year', () => {
      it('should return null value', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, 'January 29')
        ).toBeNull());
    });

    describe('when year is below 1970', () => {
      it('should return null value', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Date } as any, '01/01/1950')
        ).toBeNull());
    });
  });

  describe('getFormattedCurrency()', () => {
    describe('when value is 123', () => {
      it('should return value is $123.00', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '123')
        ).toBe('$123.00'));
    });
    describe('when value is -123', () => {
      it('should return value is -$123.00', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '-123')
        ).toBe('-$123.00'));
    });
    describe('when value is $123.00', () => {
      it('should return value is $123.00', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '$123.00')
        ).toBe('$123.00'));
    });
    describe('when value is -$123.00', () => {
      it('should return value is -$123.00', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '-$123.00')
        ).toBe('-$123.00'));
    });

    describe('when value is $123.00-', () => {
      it('should return value is -$123.00', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '$123.00-')
        ).toBe('-$123.00'));
    });
    describe('when value is 123123123', () => {
      it('should return value is $123,123,123.00', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '123123123')
        ).toBe('$123,123,123.00'));
    });
    describe('when value is 123,123,123', () => {
      it('should return value is $123,123,123.00', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '123,123,123')
        ).toBe('$123,123,123.00'));
    });
    describe('when value is ~!@#$%^*()_+=-`{[}]|\\:;"\'<>?/123,123,123', () => {
      it('should return value is -$123,123,123.00', () =>
        expect(
          service.getFormattedFieldValue(
            { type: InputDataTypes.Currency } as any,
            '~!@#$%^*()_+=-`{[}]|\\:;"\'<>?/123,123,123'
          )
        ).toBe('-$123,123,123.00'));
    });
    describe('when value is ~!@#$%^*()_+=`{[}]|\\:;"\'<>?/123,123,123', () => {
      it('should return value is $123,123,123.00', () =>
        expect(
          service.getFormattedFieldValue(
            { type: InputDataTypes.Currency } as any,
            '~!@#$%^*()_+=`{[}]|\\:;"\'<>?/123,123,123'
          )
        ).toBe('$123,123,123.00'));
    });
    describe('when value is AU 123', () => {
      it('should return value is AU 123', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, 'AU 123')
        ).toBe('$123.00'));
    });
    describe('when value is empty', () => {
      it('should return value is empty string', () =>
        expect(service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '')).toBe(
          ''
        ));
    });
    describe('when value is larger than the int limit', () => {
      it('should return value is empty string', () =>
        expect(
          service.getFormattedFieldValue({ type: InputDataTypes.Currency } as any, '2147483648')
        ).toBe('$0.00'));
    });
    describe('when no value is given', () => {
      it('should return value as empty string', () =>
        expect(service['getFormattedCurrency']('')).toBe(''));
    });
  });

  describe('getCurrencyDouble()', () => {
    describe('when value is $123.00', () => {
      it('should return value is 123.00', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '$123.23')
        ).toBe('123.23'));
    });
    describe('when value is -$123.00', () => {
      it('should return value is -123.00', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '-$123.23')
        ).toBe('-123.23'));
    });

    describe('when value is $123.00-', () => {
      it('should return value is -123.00', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '123.23-')
        ).toBe('-123.23'));
    });
    describe('when value is #123,123.00', () => {
      it('should return value is 123123.00', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '#123,123.23')
        ).toBe('123123.23'));
    });
    describe('when value is ##$%%^*@!dsfdf123,123', () => {
      it('should return value is 123123.00', () =>
        expect(
          service.getSanitizedFieldValue(
            { type: InputDataTypes.Currency } as any,
            '##$%%^*@!dsfdf123,123.23'
          )
        ).toBe('123123.23'));
    });

    describe('when value is believe.', () => {
      it('should return value as empty string', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, 'believe.')
        ).toBe(''));
    });

    describe('when value is a string', () => {
      it('should return value as empty string', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, 'mock')
        ).toBe(''));
    });

    describe('when value is wrapped in parenthesis.', () => {
      it('should return value as negative number', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '(454.02)')
        ).toBe('-454.02'));
    });

    describe('when value is wrapped in parenthesis and also has a negative attached.', () => {
      it('should return value as negative number', () =>
        expect(
          service.getSanitizedFieldValue(
            { type: InputDataTypes.Currency } as any,
            'L-110 (LULULEMON)'
          )
        ).toBe('-110.00'));
    });

    describe('when value has CR at the end.', () => {
      it('should return value as negative number', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '454.02CR')
        ).toBe('-454.02'));
    });

    describe('when value has CR at the end with spaces.', () => {
      it('should return value as negative number', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '454.02 CR')
        ).toBe('-454.02'));
    });

    describe('when value has cr at the end with spaces.', () => {
      it('should return value as negative number', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '454.02 cr')
        ).toBe('-454.02'));
    });

    describe('when value has Cr at the end with spaces.', () => {
      it('should return value as negative number', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '454.02 Cr')
        ).toBe('-454.02'));
    });

    describe('when value has CREDIT at the end.', () => {
      it('should return value as positive number', () =>
        expect(
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '454.02 CREDIT')
        ).toBe('454.02'));
    });

    describe('when value is in European format', () => {
      describe('when is a positive value', () => {
        it('should return value is 123,456.00', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '$123.456,00')
          ).toBe('123456.00'));
      });

      describe('when is a negative value', () => {
        it('should return value is -123456.00', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '$-123.456,00')
          ).toBe('-123456.00'));
      });

      describe('when value is 3.516,58', () => {
        it('should returns US currency format', () => {
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '3.516,58')
          ).toBe('3516.58');
        });
      });

      describe('when negative symbol is at the end', () => {
        it('should return value is -123456.00', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '$123.456,00-')
          ).toBe('-123456.00'));
      });

      describe('when has multiple points sepration', () => {
        it('should return value blank value', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '$123.456.789')
          ).toBe(''));
      });

      describe('when value is null', () => {
        it('should return null', () => {
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, null);
        });
      });

      describe('when value is empty', () => {
        it('should return empty string', () => {
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '');
        });
      });

      describe('when value is undefined', () => {
        it('should return empty string', () => {
          service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, undefined);
        });
      });

      describe('when value has decimal comma separator', () => {
        it('should returns 29,03', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '29,03')
          ).toBe('29.03'));
      });

      describe('when value has decimal comma separator', () => {
        it('should returns 29,2', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '29,20')
          ).toBe('29.20'));
      });

      describe('when value has decimal comma separator', () => {
        it('should returns 29,200.00', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '29,200.00')
          ).toBe('29200.00'));
      });

      describe('when value has decimal comma separator', () => {
        it('should returns 29200.00', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '29,200')
          ).toBe('29200.00'));
      });
    });

    describe('when has 3 decimals', () => {
      describe('When decimal ends above 5', () => {
        it('should return value is 400.01', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '400.009')
          ).toBe('400.01'));
      });

      describe('When decimal ends below 5', () => {
        it('should return value is 400.01', () =>
          expect(
            service.getSanitizedFieldValue({ type: InputDataTypes.Currency } as any, '400.004')
          ).toBe('400.00'));
      });
    });
  });

  describe('handleGlobalDateFormatToUS()', () => {
    describe('when receives date on format dd/MM/yyyy', () => {
      it('should change the format to MM/dd/yyyy', () => {
        expect(service.handleGlobalDateFormatToUS('28/11/2022')).toBe('11/28/2022');
      });
    });

    describe('when receives date on format MM/dd/yyyy', () => {
      it('should return the same value', () => {
        expect(service.handleGlobalDateFormatToUS('11/11/2020')).toBe('11/11/2020');
      });
    });

    describe('when receives unparseable date', () => {
      it('should returns null', () => {
        expect(service.handleGlobalDateFormatToUS('34/12/2020')).toBeNull();
      });

      describe('when receives a no date value', () => {
        it('should returns null', () => {
          expect(service.handleGlobalDateFormatToUS('noDate')).toBeNull();
        });
      });

      describe('when receives a empty string date value', () => {
        it('should returns null', () => {
          expect(service.handleGlobalDateFormatToUS('')).toBeNull();
        });
      });

      describe('when receives a null date value', () => {
        it('should returns null', () => {
          expect(service.handleGlobalDateFormatToUS(null)).toBeNull();
        });
      });
    });
  });

  describe('handleMaxFieldLength()', () => {
    const testText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris';

    it('should cut off anything after sent in length', () => {
      expect(service.handleMaxFieldLength(testText, 3)).toBe('Lor');
      expect(service.handleMaxFieldLength(testText, 50)).toBe(
        'Lorem ipsum dolor sit amet, consectetur adipiscing'
      );
      expect(service.handleMaxFieldLength(testText, 1000)).toBe(testText);
    });
  });

  describe('handleOrdinalDateFormatToUS()', () => {
    describe('when receives date on format May 27th, 2023', () => {
      it('should change the format to MM/dd/yyyy', () => {
        expect(service.handleOrdinalDateFormatToUS('May 27th, 2023')).toBe('05/27/2023');
      });
    });

    describe('when receives date on format Jun 1st 2020', () => {
      it('should change the format to MM/dd/yyyy', () => {
        expect(service.handleOrdinalDateFormatToUS('Jun 1st 2020')).toBe('06/01/2020');
      });
    });
  });

  describe('toPascalCase', () => {
    const lowerCaseText = 'mock test pascal case';

    it('should format all the text to Pascal Case', () => {
      expect(service.toPascalCase(lowerCaseText)).toBe('Mock Test Pascal Case');
    });
  });

  describe('handleGlobalDateFormatToUS()', () => {
    describe('when receives date on format dd/MM/yyyy', () => {
      it('should change the format to MM/dd/yyyy', () => {
        expect(service.handleGlobalDateFormatToUS('28/11/2022')).toBe('11/28/2022');
      });
    });

    describe('when receives date on format MM/dd/yyyy', () => {
      it('should return the same value', () => {
        expect(service.handleGlobalDateFormatToUS('11/11/2020')).toBe('11/11/2020');
      });
    });

    describe('when receives unparseable date', () => {
      it('should returns null', () => {
        expect(service.handleGlobalDateFormatToUS('34/12/2020')).toBeNull();
      });

      describe('when receives a no date value', () => {
        it('should returns null', () => {
          expect(service.handleGlobalDateFormatToUS('noDate')).toBeNull();
        });
      });
    });
  });

  describe('maxYear validation', () => {
    describe('When receives date with no 25 years above the current year', () => {
      it('should returns false', () => {
        expect(service.maxYearValidator('02/03/2023')).toBeTruthy();
      });
    });

    describe('When receives date with 25 years above  current year', () => {
      it('should returns false', () => {
        expect(service.maxYearValidator('02/03/2100')).toBeFalsy();
      });
    });
  });
});
