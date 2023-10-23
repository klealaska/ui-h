import { FieldBase } from './field-base.model';

export class FieldTextarea extends FieldBase<string> {
  controlType = 'textarea';
}
