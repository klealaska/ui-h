import { AppActions } from '@ui-coe/bus-hier/shared/types';

export const LOADER_KEY = 'history';

export type WithTracking<T> = T & {
  [LOADER_KEY]: { [k: string]: AppActions };
  // action payload
  payload?: any;
  // action response
  response?: any;
  dontTrack: boolean;
  correlationId?: string;
};

export function withTracking<T>(loader: Partial<{ [k: string]: AppActions }>, payload?: T) {
  return Object.assign(payload || {}, {
    [LOADER_KEY]: loader,
  }) as WithTracking<T>;
}
