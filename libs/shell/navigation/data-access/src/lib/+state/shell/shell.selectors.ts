import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SHELL_FEATURE_KEY, ShellState, shellAdapter } from './shell.reducer';

// Lookup the 'Shell' feature state managed by NgRx
export const selectShellState = createFeatureSelector<ShellState>(SHELL_FEATURE_KEY);

const { selectAll, selectEntities } = shellAdapter.getSelectors();

export const selectShellLoaded = createSelector(
  selectShellState,
  (state: ShellState) => state.loaded
);

export const selectShellError = createSelector(
  selectShellState,
  (state: ShellState) => state.error
);

export const selectAllShell = createSelector(selectShellState, (state: ShellState) =>
  selectAll(state)
);

export const selectShellEntities = createSelector(selectShellState, (state: ShellState) =>
  selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectShellState,
  (state: ShellState) => state.selectedId
);

export const selectEntity = createSelector(
  selectShellEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
