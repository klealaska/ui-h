import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { getToasterConfig } from './get-toaster-config';
import { IToastConfigData, ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';

describe('getToasterConfig', () => {
  const defaultToastConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };

  const toastDataConfig: IToastConfigData = {
    title: 'foo',
    type: ToastTypeEnum.SUCCESS,
    icon: ToastIcon.CHECK_CIRCLE,
    close: true,
  };

  it('should return the proper config object', () => {
    expect(getToasterConfig({ title: toastDataConfig.title })).toEqual({
      ...defaultToastConfig,
      data: toastDataConfig,
    });
  });
});
