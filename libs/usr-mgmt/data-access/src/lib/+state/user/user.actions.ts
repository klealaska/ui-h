import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { createAction, props } from '@ngrx/store';
import { IToastConfigData } from '@ui-coe/shared/types';
import { AppActions, ICreateEditUser, IUser, ToastContent } from '@ui-coe/usr-mgmt/shared/types';

export const loadUsers = createAction(AppActions.LOAD_USERS, props<{ params?: any }>());

export const loadUsersSuccess = createAction(
  AppActions.LOAD_USERS_SUCCESS,
  props<{ response: IUser[] }>()
);

export const loadUsersFailure = createAction(
  AppActions.LOAD_USERS_FAILURE,
  props<{ error: unknown }>()
);

export const addUser = createAction(
  AppActions.ADD_USER,
  props<{ body: ICreateEditUser; toastContent: ToastContent }>()
);

export const addUserSuccess = createAction(
  AppActions.ADD_USER_SUCCESS,
  props<{ response: IUser; toastSuccessText?: string }>()
);

export const addUserFailure = createAction(
  AppActions.ADD_USER_FAILURE,
  props<{ error: unknown; toastFailureText?: string }>()
);

export const editUser = createAction(
  AppActions.EDIT_USER,
  props<{ id: string; body: ICreateEditUser; toastContent: ToastContent }>()
);

export const editUserSuccess = createAction(
  AppActions.EDIT_USER_SUCCESS,
  props<{ response: IUser; toastSuccessText?: string }>()
);

export const editUserFailure = createAction(
  AppActions.EDIT_USER_FAILURE,
  props<{ error: unknown; toastFailureText?: string }>()
);

export const displayToast = createAction(
  AppActions.DISPLAY_TOAST,
  props<{ config: MatSnackBarConfig<IToastConfigData> }>()
);

export const dismissToast = createAction(AppActions.DISMISS_TOAST);

export const deactivateUser = createAction(AppActions.DEACTIVATE_USER, props<{ userId: string }>());

export const deactivateUserSuccess = createAction(
  AppActions.DEACTIVATE_USER_SUCCESS,
  props<{ response: IUser }>()
);

export const deactivateUserFailure = createAction(
  AppActions.DEACTIVATE_USER_FAILURE,
  props<{ error: unknown }>()
);
