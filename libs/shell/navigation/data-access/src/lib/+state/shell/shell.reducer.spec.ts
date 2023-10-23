import { Action } from '@ngrx/store';

import * as ShellActions from './shell.actions';
import { ShellEntity } from './shell.models';
import { ShellState, initialShellState, shellReducer } from './shell.reducer';

describe('Shell Reducer', () => {
  const createShellEntity = (id: string, name = ''): ShellEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Shell actions', () => {
    it('loadShellSuccess should return the list of known Shell', () => {
      const shell = [createShellEntity('PRODUCT-AAA'), createShellEntity('PRODUCT-zzz')];
      const action = ShellActions.loadShellSuccess({ shell });

      const result: ShellState = shellReducer(initialShellState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = shellReducer(initialShellState, action);

      expect(result).toBe(initialShellState);
    });
  });
});
