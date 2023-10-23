import { createAction, props } from '@ngrx/store';
import { AppName } from '../../enums';
import { AuthEntity } from './auth.models';
import { CallbackData } from '../../models/login-callback-config';
import { TokenResponse } from '../../models';

export const initAuth = createAction(
  '[Shell Auth] Init',
  props<{ authUrl: string; appName: AppName }>()
);

export const handleSsoCallback = createAction(
  '[Shell Auth] Handle SSO Callback',
  props<{ callbackData: CallbackData }>()
);

export const loadAuthSuccess = createAction(
  '[Auth/API] Load Auth Success',
  props<{ res: TokenResponse }>()
);

export const loadAuthFailure = createAction(
  '[Auth/API] Load Auth Failure',
  props<{ error: any }>()
);

export const loadAuthToken = createAction('[Shell Auth] Load Auth Token');

export const loadAuthTokenSuccess = createAction(
  '[Shell Auth] Load Auth Token Success',
  props<{ token: string }>()
);

export const refreshTokenSuccess = createAction(
  '[Shell Auth] Refresh Auth Token Success',
  props<{ res: any }>()
);

export const signOut = createAction('[Shell Auth] Sign Out');
