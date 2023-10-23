import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { IGetToastOptions, IToastConfigData, ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';

const defaultToastConfig: MatSnackBarConfig = {
  duration: 3000,
  horizontalPosition: 'center',
  verticalPosition: 'top',
};

export function getToasterConfig({
  title,
  type = ToastTypeEnum.SUCCESS,
  icon = ToastIcon.CHECK_CIRCLE,
}: IGetToastOptions): MatSnackBarConfig<IToastConfigData> {
  return {
    ...defaultToastConfig,
    data: {
      title,
      type,
      icon,
      close: true,
    },
  };
}
