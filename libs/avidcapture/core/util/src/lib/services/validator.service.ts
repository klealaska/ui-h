import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Autocomplete } from '@ui-coe/shared/ui';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  alphaNumericValidator(control: FormControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9_]*$/;
    const errorMessage = {
      alphaNumericError: 'only alpha numeric values are allowed',
    };

    return regex.test(control.value) ? null : errorMessage;
  }

  specialCharactersValidator(control: FormControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9-/_().:,\s]*$/;
    const errorMessage = {
      specialCharactersError: 'Special characters allowed -/_()-:,',
    };
    return regex.test(control.value) ? null : errorMessage;
  }

  numericValidator(value: string): boolean {
    return /^[0-9,.]*$/.test(value);
  }

  currencyValidator(value: string): boolean {
    return /(?=.*\d)^-?\$?(([0-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$/.test(value);
  }

  dateValidator(value: string): boolean {
    const val = value.replace(/\.|-|\//g, ' ');
    let date: DateTime;

    if (value.length === 6) {
      date = DateTime.fromFormat(value, 'MMddyy');
    } else {
      date = DateTime.fromJSDate(new Date(val));
    }

    if (!date.isValid) {
      return false;
    }

    return !!DateTime.fromJSDate(new Date(val));
  }

  formDateValidator(control: FormControl): ValidationErrors | null {
    if (!control.value && !control.hasValidator(Validators.required)) {
      return null;
    }
    if (!control.value && control.hasValidator(Validators.required)) {
      return { required: 'Required' };
    }

    return null;
  }

  autocompleteObjectValidator(options: Autocomplete[] = null): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        if (options) {
          return options.filter((option: Autocomplete) => option.name === control.value)?.length > 0
            ? null
            : { invalidAutocompleteObject: { value: control.value } };
        }
        return { invalidAutocompleteObject: { value: control.value } };
      }
      return null;
    };
  }

  lookupObjectValidator(options: Autocomplete[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      options.filter((option: Autocomplete) => option.name === control.value?.value)?.length > 0
        ? null
        : { invalidAutocompleteObject: { value: control.value?.value } };
  }

  required(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value?.value === undefined) {
        if (control.value !== '' && control.value != null) {
          return null;
        } else {
          return { fieldValueRequired: { value: control.value } };
        }
      } else {
        if (control.value?.value !== '' && control.value?.value != null) {
          return null;
        } else {
          return { fieldValueRequired: { value: control.value?.value } };
        }
      }
    };
  }
}
