import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

import { ValidatorService } from './validator.service';

describe('ValidatorService', () => {
  let service: ValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('alphaNumericValidator()', () => {
    describe('when value is numberic', () => {
      const controlStub = new FormControl('123');

      it('should return value as null', () =>
        expect(service.alphaNumericValidator(controlStub)).toBeNull());
    });

    describe('when value is alphabetic', () => {
      const controlStub = new FormControl('abc');

      it('should return value as null', () =>
        expect(service.alphaNumericValidator(controlStub)).toBeNull());
    });

    describe('when value has both alpha and numberic values', () => {
      const controlStub = new FormControl('ABC123');

      it('should return value as null', () =>
        expect(service.alphaNumericValidator(controlStub)).toBeNull());
    });

    describe('when value has non alphanumberic values', () => {
      const controlStub = new FormControl('ABC-123');

      it('should return value with error', () =>
        expect(service.alphaNumericValidator(controlStub)).toStrictEqual({
          alphaNumericError: 'only alpha numeric values are allowed',
        }));
    });

    describe('when value has spaces', () => {
      const controlStub = new FormControl('ABC 123');

      it('should return value with error', () =>
        expect(service.alphaNumericValidator(controlStub)).toStrictEqual({
          alphaNumericError: 'only alpha numeric values are allowed',
        }));
    });
  });

  describe('numericValidator()', () => {
    describe('when value is 123', () => {
      it('should return value is true', () => expect(service.numericValidator('123')).toBe(true));
    });
    describe('when value is 123,123.00', () => {
      it('should return value is true', () =>
        expect(service.numericValidator('123,123.00')).toBe(true));
    });
    describe('when value is abc', () => {
      it('should return value is false', () => expect(service.numericValidator('abc')).toBe(false));
    });
  });

  describe('currencyValidator()', () => {
    describe('when value is 123', () => {
      it('should return value is true', () => expect(service.currencyValidator('123')).toBe(true));
    });
    describe('when value is -123', () => {
      it('should return value is true', () => expect(service.currencyValidator('-123')).toBe(true));
    });
    describe('when value is $123', () => {
      it('should return value is true', () => expect(service.currencyValidator('$123')).toBe(true));
    });
    describe('when value is -$123', () => {
      it('should return value is true', () =>
        expect(service.currencyValidator('-$123')).toBe(true));
    });
    describe('when value is abc', () => {
      it('should return value is false', () =>
        expect(service.currencyValidator('abc')).toBe(false));
    });
  });

  describe('dateValidator()', () => {
    describe('when value is 6 digits in length and is in mm dd yy order', () => {
      it('should return value is true', () => expect(service.dateValidator('121220')).toBeTruthy());
    });

    describe('when value is 6 digits in length and is in a cray cray order', () => {
      it('should return value is false', () => expect(service.dateValidator('230202')).toBeFalsy());
    });

    describe('when value is 6 digits in length and is not in US traditional order', () => {
      it('should return value is false', () => expect(service.dateValidator('190923')).toBeFalsy());
    });

    describe('when value is 12/12/2020', () => {
      it('should return value is true', () =>
        expect(service.dateValidator('12/12/2020')).toBe(true));
    });

    describe('when value is 12/12/12', () => {
      it('should return value is true', () => expect(service.dateValidator('12/12/12')).toBe(true));
    });

    describe('when value is 2020-12-13', () => {
      it('should return value is true', () =>
        expect(service.dateValidator('2020-12-13')).toBe(true));
    });

    describe('when value is October 2 2022', () => {
      it('should return value is true', () =>
        expect(service.dateValidator('October 2 2022')).toBe(true));
    });

    describe('when value is 10 2 22', () => {
      it('should return value is true', () => expect(service.dateValidator('10 2 22')).toBe(true));
    });

    describe('when value is 8 1 22', () => {
      it('should return value is true', () => expect(service.dateValidator('8 1 22')).toBe(false));
    });

    describe('when value is 8 01 22', () => {
      it('should return value is true', () => expect(service.dateValidator('8 01 22')).toBe(true));
    });

    describe('when value is 122120202', () => {
      it('should return value is false', () =>
        expect(service.dateValidator('122120202')).toBe(false));
    });
    describe('when value is 132/13/2020', () => {
      it('should return value is false', () =>
        expect(service.dateValidator('132/13/2020')).toBe(false));
    });
  });

  describe('formDateValidator()', () => {
    describe('when value is blank && control is NOT required', () => {
      const controlStub = new FormControl('');

      it('should return value as null', () =>
        expect(service.formDateValidator(controlStub)).toBeNull());
    });

    describe('when value is blank && control is required', () => {
      const controlStub = new FormControl('', Validators.required);

      it('should return value as a validation error', () =>
        expect(service.formDateValidator(controlStub)).toStrictEqual({ required: 'Required' }));
    });
  });

  describe('autocompleteObjectValidator()', () => {
    it('should return an error when leaving string in autocomplete input', () => {
      const control = { value: 'mock' };
      const result = service.autocompleteObjectValidator()(control as AbstractControl);
      expect(result).toEqual(
        expect.objectContaining({ invalidAutocompleteObject: { value: 'mock' } })
      );
    });

    it('should return null when option was selected from dropdown', () => {
      const control = { value: { name: 'mock' } };
      const result = service.autocompleteObjectValidator()(control as AbstractControl);
      expect(result).toBeNull();
    });

    describe('when passing options', () => {
      it('should return an error when option not found', () => {
        const control = { value: 'mock' };
        const result = service.autocompleteObjectValidator([{ id: 'test', name: 'test' }])(
          control as AbstractControl
        );
        expect(result).toEqual(
          expect.objectContaining({ invalidAutocompleteObject: { value: 'mock' } })
        );
      });

      it('should return an error when option not exact match', () => {
        const control = { value: 'mock' };
        const result = service.autocompleteObjectValidator([{ id: 'Mock', name: 'Mock' }])(
          control as AbstractControl
        );
        expect(result).toEqual(
          expect.objectContaining({ invalidAutocompleteObject: { value: 'mock' } })
        );
      });

      it('should return null when option found', () => {
        const control = { value: 'mock' };
        const result = service.autocompleteObjectValidator([{ id: 'mock', name: 'mock' }])(
          control as AbstractControl
        );
        expect(result).toBeNull();
      });
    });
  });

  describe('lookupObjectValidator()', () => {
    describe('when passing options', () => {
      it('should return an error when value is NULL', () => {
        const control = { value: null };
        const result = service.lookupObjectValidator([{ id: 'test', name: 'test' }])(
          control as AbstractControl
        );
        expect(result).toEqual(
          expect.objectContaining({ invalidAutocompleteObject: { value: undefined } })
        );
      });

      it('should return an error when option not found', () => {
        const control = { value: { value: 'mock' } };
        const result = service.lookupObjectValidator([{ id: 'test', name: 'test' }])(
          control as AbstractControl
        );
        expect(result).toEqual(
          expect.objectContaining({ invalidAutocompleteObject: { value: 'mock' } })
        );
      });

      it('should return an error when option not exact match', () => {
        const control = { value: { value: 'mock' } };
        const result = service.lookupObjectValidator([{ id: 'Mock', name: 'Mock' }])(
          control as AbstractControl
        );
        expect(result).toEqual(
          expect.objectContaining({ invalidAutocompleteObject: { value: 'mock' } })
        );
      });

      it('should return null when option found', () => {
        const control = { value: { value: 'mock' } };
        const result = service.lookupObjectValidator([{ id: 'mock', name: 'mock' }])(
          control as AbstractControl
        );
        expect(result).toBeNull();
      });
    });
  });

  describe('required()', () => {
    describe('when exists a current value on research invoice', () => {
      it('should return an error when control.value is NULL', () => {
        const control = { value: null };
        const result = service.required()(control as AbstractControl);
        expect(result).toEqual(expect.objectContaining({ fieldValueRequired: { value: null } }));
      });

      it('should return an error when value is empty string', () => {
        const control = { value: '' };
        const result = service.required()(control as AbstractControl);
        expect(result).toEqual(expect.objectContaining({ fieldValueRequired: { value: '' } }));
      });

      it('should return an error when value is null', () => {
        const control = { value: null };
        const result = service.required()(control as AbstractControl);
        expect(result).toEqual(expect.objectContaining({ fieldValueRequired: { value: null } }));
      });

      it('should return null when option found', () => {
        const control = { value: 'mock' };
        const result = service.required()(control as AbstractControl);
        expect(result).toBeNull();
      });
    });

    describe('when passing options', () => {
      it('should return an error when control.value is NULL', () => {
        const control = { value: { value: null } };
        const result = service.required()(control as AbstractControl);
        expect(result).toEqual(expect.objectContaining({ fieldValueRequired: { value: null } }));
      });

      it('should return an error when value is empty string', () => {
        const control = { value: { value: '' } };
        const result = service.required()(control as AbstractControl);
        expect(result).toEqual(expect.objectContaining({ fieldValueRequired: { value: '' } }));
      });

      it('should return an error when value is null', () => {
        const control = { value: { value: null } };
        const result = service.required()(control as AbstractControl);
        expect(result).toEqual(expect.objectContaining({ fieldValueRequired: { value: null } }));
      });

      it('should return null when option found', () => {
        const control = { value: { value: 'mock' } };
        const result = service.required()(control as AbstractControl);
        expect(result).toBeNull();
      });
    });
  });

  describe('specialCharactersValidator', () => {
    describe('when value has both alphanumberic values', () => {
      const controlStub = new FormControl('ABC123');

      it('should return value as null', () =>
        expect(service.specialCharactersValidator(controlStub)).toBeNull());
    });

    describe('when value has special Characters allowed', () => {
      const controlStub = new FormControl('ABC123-/_()-:,');
      it('should return value as null', () =>
        expect(service.specialCharactersValidator(controlStub)).toBeNull());
    });

    describe('when value has special Characters not allowed', () => {
      const controlStub = new FormControl('ABC123-/_()-:,  $><%?');
      it('should return value with error', () =>
        expect(service.specialCharactersValidator(controlStub)).toStrictEqual({
          specialCharactersError: 'Special characters allowed -/_()-:,',
        }));
    });
  });
});
