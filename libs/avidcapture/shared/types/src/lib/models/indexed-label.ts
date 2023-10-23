import { LabelValue } from './label-value';

export interface IndexedLabel {
  id: string;
  label: string;
  page: number;
  value: LabelValue;
}
