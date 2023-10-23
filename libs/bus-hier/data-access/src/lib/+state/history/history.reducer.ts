import { Action } from '@ngrx/store';
import { IHistory } from '@ui-coe/bus-hier/shared/types';
import { LOADER_KEY, WithTracking } from '../../utils/ngrx-utils';
import { cloneDeep } from 'lodash';
import { AppActions } from '@ui-coe/bus-hier/shared/types';
export const historyFeatureKey = 'history';

export const initialHistoryState: IHistory = {
  events: [],
};

export function reducer(state, action: Action);
export function reducer(state, action: WithTracking<Action>);
export function reducer(state = initialHistoryState, action: any) {
  if (Object.prototype.hasOwnProperty.call(action, LOADER_KEY)) {
    const loader = (action as WithTracking<Action>)[LOADER_KEY];
    const newEvents = cloneDeep(state.events);
    const findNewEvents = newEvents.find(e => e[0]?.correlationId === action.correlationId);
    const item = {
      type: action.type,
      ...loader,
      payload: action.payload,
      // this allows us in the event we want to track successful responses
      response: action.response,
      correlationId: action.correlationId,
    };

    // if this is NOT set, then we track other wise we can assume a replay of an action
    if (!action?.payload.dontTrack) {
      if (findNewEvents) {
        findNewEvents.push(item);
      } else {
        newEvents.unshift([item]);
      }

      return {
        ...state,
        events: newEvents,
      };
    } else {
      return state;
    }
  } else if (action.type === AppActions.UPDATE_HISTORY_EVENTS) {
    return {
      ...state,
      events: action.events,
    };
  }
  return state;
}
