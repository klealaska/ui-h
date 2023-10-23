import { FieldBase } from './field-base.model';

export interface NonLookupErrorMessage {
  field: FieldBase<string>;
  message: string;
}
