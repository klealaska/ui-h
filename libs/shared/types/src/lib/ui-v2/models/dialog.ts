import { ButtonType, ButtonColor } from '../types';

export interface DialogDataV2 {
  draggable: boolean;
  type: 'default' | 'alert';
  closeIcon?: boolean;
  overline?: Overline;
  title?: string;
  message?: string;
  actionBtn?: ActionBtn;
  cancelBtn?: CancelBtn;
}

export interface Overline {
  hasAlertIcon?: boolean;
  text: string;
}

export interface ActionBtn {
  type: ButtonType;
  color: ButtonColor;
  text: string;
}

export interface CancelBtn {
  type: ButtonType;
  color: ButtonColor;
  text: string;
}
