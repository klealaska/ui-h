import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { createAction, props } from '@ngrx/store';
import {
  AppActions,
  IEditBusinessLevelName,
  IBusinessLevelDetails,
} from '@ui-coe/bus-hier/shared/types';
import { IToastConfigData } from '@ui-coe/shared/types';

export const updateBusinessLevelName = createAction(
  AppActions.UPDATE_BUSINESS_LEVEL_NAME,
  props<{ params: IEditBusinessLevelName }>()
);

export const updateBusinessLevelNameSuccess = createAction(
  AppActions.UPDATE_BUSINESS_LEVEL_NAME_SUCCESS,
  props<{ response: IBusinessLevelDetails }>()
);

export const updateBusinessLevelNameFailure = createAction(
  AppActions.UPDATE_BUSINESS_LEVEL_NAME_FAILURE,
  props<{ error: unknown }>()
);

export const displayToast = createAction(
  AppActions.DISPLAY_TOAST,
  props<{ config: MatSnackBarConfig<IToastConfigData> }>()
);

export const dismissToast = createAction(AppActions.DISMISS_TOAST);
