import { createAction, props } from '@ngrx/store';
import { AppActions, IHistoryEventList } from '@ui-coe/bus-hier/shared/types';

export const loadHistory = createAction(AppActions.LOAD_HISTORY);

export const updateHistoryEvents = createAction(
  AppActions.UPDATE_HISTORY_EVENTS,
  props<{ events: IHistoryEventList }>()
);
