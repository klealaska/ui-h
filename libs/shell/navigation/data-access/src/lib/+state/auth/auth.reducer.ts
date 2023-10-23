import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { TokenResponse } from '../../models';

import * as AuthActions from './auth.actions';
import { AuthEntity } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState extends EntityState<AuthEntity> {
  selectedId?: string | number; // which Auth record has been selected
  loaded: boolean; // has the Auth list been loaded
  error?: string | null; // last known error (if any)
  tokenResponse: TokenResponse;
  token?: string;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const authAdapter: EntityAdapter<AuthEntity> = createEntityAdapter<AuthEntity>();

export const initialAuthState: AuthState = authAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  tokenResponse: null,
  token: '',
});

const reducer = createReducer(
  initialAuthState,
  on(AuthActions.initAuth, state => ({ ...state, loaded: false, error: null })),
  on(AuthActions.loadAuthSuccess, (state, { res }) => ({
    ...state,
    tokenResponse: res,
    loaded: true,
    token: res?.return_data?.tokens?.access_token,
  })),
  on(AuthActions.loadAuthFailure, (state, { error }) => ({ ...state, error })),

  on(AuthActions.loadAuthTokenSuccess, (state, { token }) => ({
    ...state,
    loaded: true,
    token: token,
  })),

  on(AuthActions.refreshTokenSuccess, (state, { res }) => ({
    ...state,
    loaded: true,
    token: res.return_data.access_token,
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
