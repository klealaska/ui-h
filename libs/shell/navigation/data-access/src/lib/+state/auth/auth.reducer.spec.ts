import { Action } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthEntity } from './auth.models';
import { AuthState, initialAuthState, authReducer } from './auth.reducer';

describe('Auth Reducer', () => {
  const createAuthEntity = (id: string, name = ''): AuthEntity => ({
    id,
    name: name || `name-${id}`,
  });

  const tokenRes = {
    return_data: null,
  };

  describe('valid Auth actions', () => {
    it('loadAuthSuccess should return the list of known Auth', () => {
      const auth = [createAuthEntity('PRODUCT-AAA'), createAuthEntity('PRODUCT-zzz')];
      const action = AuthActions.loadAuthSuccess({ res: tokenRes });

      const result: AuthState = authReducer(initialAuthState, action);

      expect(result.loaded).toBe(true);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = authReducer(initialAuthState, action);

      expect(result).toBe(initialAuthState);
    });
  });
});
