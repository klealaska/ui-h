import { ConfidenceThreshold } from './confidence-threshold';
import { DisplayThreshold } from './display-threshold';

export interface Fields {
  fields: Field[];
}

export interface Field {
  key: string;
  fieldType: string;
  value: any;
  controlType: string;
  confidence: number;
  displayThreshold: DisplayThreshold;
  confidenceThreshold: ConfidenceThreshold;
  type: string;
  required: boolean;
  regEx: RegExp;
  labelDisplayName: string;
  headerBackgroundColor: string;
  headerTextColor: string;
  order: number;
  maxLength: number;
}
