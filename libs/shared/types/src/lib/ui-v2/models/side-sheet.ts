import { ButtonColor, ButtonType } from '../types';

export interface SideSheetButton {
  text: string;
  type?: ButtonType;
  disabled?: boolean;
  color?: ButtonColor;
}
