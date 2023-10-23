import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IHistory } from '@ui-coe/bus-hier/shared/types';
import * as fromHistory from './history.reducer';

export const selectHistoryState = createFeatureSelector<IHistory>(fromHistory.historyFeatureKey);

export const selectHistoryEvents = createSelector(
  selectHistoryState,
  (state: IHistory) => state.events
);
