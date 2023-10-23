import { tooltip } from './tooltip';

export interface FormFieldError {
  message: string;
  icon?: string;
}

export interface InputTooltip extends tooltip {
  icon?: string;
}
