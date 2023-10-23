import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '@ui-coe/avidcapture/core/util';
import { ControlTypes, FieldBase, FieldTypes, Integer } from '@ui-coe/avidcapture/shared/types';

@Injectable({
  providedIn: 'root',
})
export class FieldControlService {
  maxValidator = Validators.max(Integer.MAX_LIMIT);

  constructor(private validatorService: ValidatorService) {}

  toFormGroup(fields: FieldBase<string>[]): UntypedFormGroup {
    const group = {};
    if (fields !== undefined) {
      fields.forEach(field => {
        const control = new UntypedFormControl(field.value || '');

        if (field.required) {
          control.addValidators(Validators.required);
        }

        if (field.controlType === ControlTypes.AutoComplete && field.required) {
          control.addValidators(this.validatorService.required());
        }

        if (field.type === FieldTypes.Currency) {
          control.addValidators(this.maxValidator);
        }

        if (field.type === FieldTypes.Date) {
          control.addValidators(this.validatorService.formDateValidator);
        }

        control.updateValueAndValidity();

        group[field.key] = control;
      });
    }
    return new UntypedFormGroup(group);
  }
}
