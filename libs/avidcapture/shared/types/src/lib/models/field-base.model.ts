import { ConfidenceThreshold } from './confidence-threshold';
import { DisplayThreshold } from './display-threshold';
import { Field } from './field';

export class FieldBase<T> {
  key: string;
  value: T;
  confidence: number;
  displayThreshold: DisplayThreshold;
  confidenceThreshold: ConfidenceThreshold;
  controlType: string;
  type: string;
  required: boolean;
  regEx: RegExp;
  labelDisplayName: string;
  order: number;
  headerBackgroundColor: string;
  headerTextColor: string;
  htmlId?: string;
  maxLength?: number;

  constructor(config: Field) {
    this.key = config.key || '';
    this.value = config.value;
    this.confidence = config.confidence || 0;
    this.displayThreshold = config.displayThreshold || { view: 0, readonly: 0 };
    this.confidenceThreshold = config.confidenceThreshold;
    this.controlType = config.controlType || '';
    this.type = config.type || '';
    this.required = !!config.required;
    this.regEx = config.regEx;
    this.labelDisplayName = config.labelDisplayName || '';
    this.headerBackgroundColor = config.headerBackgroundColor || 'none';
    this.headerTextColor = config.headerTextColor || 'default';
    this.order = config.order === undefined ? 1 : config.order;
    this.htmlId = this.key?.replace(/[^a-zA-Z0-9]/g, '') || new Date().getTime().toString();
    this.maxLength = config.maxLength || 1000;
  }
}
