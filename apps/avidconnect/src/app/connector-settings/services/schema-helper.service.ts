import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PropertyType } from '../../core/enums';
import { Property, PropertyComplexRef } from '../../models';
import { ConnectorSettingsState } from '../connector-settings.state';
import * as actions from '../connector-settings.actions';
import { ErrorStateMatcher } from '@angular/material/core';
import { UntypedFormControl } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class SchemaHelperService {
  constructor(private store: Store) {}

  validatePropertyValue(
    propertyGroupName: string,
    property: Property,
    value: any,
    complexRef?: PropertyComplexRef
  ): boolean {
    let isValid = true;

    if (property.IsArray && Array.isArray(value)) {
      value.forEach(val => {
        isValid = this.validatePropertyValue(propertyGroupName, property, val);
      });
    } else if (property.Type.toLowerCase() !== PropertyType.Boolean) {
      if (!value && property.IsRequired) {
        isValid = false;
      } else if (value) {
        const regex = property.FormatMask ? new RegExp(property.FormatMask) : null;

        if (regex && !regex.test(value)) {
          isValid = false;
        }

        if (
          property.MinLength > value.length ||
          (property.MaxLength && property.MaxLength < value.length)
        ) {
          isValid = false;
        }

        if (
          property.Type === PropertyType.Numeric &&
          (property.MinValue > value || (property.MaxValue && property.MaxValue < value))
        ) {
          isValid = false;
        }

        if (property.Type.toLowerCase() === PropertyType.Complex) {
          const complexType = this.store.selectSnapshot(
            ConnectorSettingsState.getComplexTypeProperty
          )(property.ComplexType);

          if (complexType?.Properties) {
            complexType.Properties.forEach(fieldProperty => {
              const field = { ...fieldProperty, Name: `${property.Name}-${fieldProperty.Name}` };

              const complexValue = (value && value[fieldProperty.Name]) || undefined;

              this.validatePropertyValue(propertyGroupName, field, complexValue);
            });
          }
        }
      }

      if (!isValid) {
        const errorMessage =
          property.FormatError || `${property.DisplayName || property.Name} is invalid`;

        this.store.dispatch(
          new actions.SetErrorMessage(
            propertyGroupName,
            property.Name,
            errorMessage,
            complexRef?.propertyName
          )
        );
      }
    }

    return isValid;
  }
}

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null): boolean {
    return !!(control && control.invalid);
  }
}

export function hasErrors(): { [key: string]: boolean } | null {
  return this.error ? { error: true } : null;
}
