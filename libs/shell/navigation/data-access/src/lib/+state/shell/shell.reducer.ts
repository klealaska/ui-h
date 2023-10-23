import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ShellActions from './shell.actions';
import { ShellEntity } from './shell.models';

export const SHELL_FEATURE_KEY = 'shell';

export interface ShellState extends EntityState<ShellEntity> {
  selectedId?: string | number; // which Shell record has been selected
  loaded: boolean; // has the Shell list been loaded
  error?: string | null; // last known error (if any)
}

export interface ShellPartialState {
  readonly [SHELL_FEATURE_KEY]: ShellState;
}

export const shellAdapter: EntityAdapter<ShellEntity> = createEntityAdapter<ShellEntity>();

export const initialShellState: ShellState = shellAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialShellState,
  on(ShellActions.initShell, state => ({ ...state, loaded: false, error: null })),
  on(ShellActions.loadShellSuccess, (state, { shell }) =>
    shellAdapter.setAll(shell, { ...state, loaded: true })
  ),
  on(ShellActions.loadShellFailure, (state, { error }) => ({ ...state, error }))
);

export function shellReducer(state: ShellState | undefined, action: Action) {
  return reducer(state, action);
}
