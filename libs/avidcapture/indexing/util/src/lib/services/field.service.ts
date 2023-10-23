import { Injectable } from '@angular/core';
import {
  Field,
  FieldAutocomplete,
  FieldBase,
  Fields,
  FieldTextarea,
  FieldTextbox,
  FieldDropDown,
} from '@ui-coe/avidcapture/shared/types';
import { Observable, of } from 'rxjs';

import * as fields from '../assets/form-config/xdc-document-fields.config.json';

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  getFormFieldMetaData(): Observable<Fields[]> {
    return of((<any>fields).default);
  }

  parseFieldMetaData(
    invoiceType: string,
    data: Field[],
    filterData: boolean = false
  ): Observable<FieldBase<string>[]> {
    const fieldsToReturn: FieldBase<string>[] = [];
    const filteredData = !filterData
      ? data
      : data.filter(val => val.fieldType === 'default' || val.fieldType === invoiceType);
    filteredData.forEach(item => {
      let fieldElement: FieldBase<string>;

      const fieldElementObj = {
        key: item.key,
        value: item.value,
        controlType: item.controlType,
        type: item.type,
        required: item.required,
        regEx: item.regEx,
        labelDisplayName: item.labelDisplayName,
        headerBackgroundColor: item.headerBackgroundColor,
        headerTextColor: item.headerTextColor,
        order: item.order,
        confidenceThreshold: item.confidenceThreshold,
        displayThreshold: item.displayThreshold,
        confidence: null,
        fieldType: item.fieldType,
        maxLength: item.maxLength,
      } as Field;

      if (item.controlType === 'textbox') {
        fieldElement = new FieldTextbox(fieldElementObj);
        fieldsToReturn.push(fieldElement);
      } else if (item.controlType === 'textarea') {
        fieldElement = new FieldTextarea(fieldElementObj);
        fieldsToReturn.push(fieldElement);
      } else if (item.controlType === 'autocomplete') {
        fieldElement = new FieldAutocomplete(fieldElementObj);
        fieldsToReturn.push(fieldElement);
      } else if (item.controlType === 'dropdown') {
        fieldElement = new FieldDropDown(fieldElementObj);
        fieldsToReturn.push(fieldElement);
      }
    });
    return of(fieldsToReturn.sort((a, b) => a.order - b.order));
  }
}
