import { InitialBusinessLevelState, reducer } from './business-level.reducer';
import * as BusinessLevelActions from './business-level.actions';

describe('BusinessLevel Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(InitialBusinessLevelState, action);

      expect(result).toEqual(InitialBusinessLevelState);
    });
  });

  it('should update the state when updateBusinessLevelName is dispatched', () => {
    const action = BusinessLevelActions.updateBusinessLevelName({ params: null });
    const state = {
      ...InitialBusinessLevelState,
      loading: true,
    };
    const result = reducer(InitialBusinessLevelState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when updateBusinessLevelNameSuccess is dispatched', () => {
    const action = BusinessLevelActions.updateBusinessLevelNameSuccess({ response: null });
    const state = {
      ...InitialBusinessLevelState,
      businessLevel: action.response,
      loading: false,
      error: null,
    };
    const result = reducer(InitialBusinessLevelState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when updateBusinessLevelNameFailure is dispatched', () => {
    const action = BusinessLevelActions.updateBusinessLevelNameFailure({ error: 'error' });
    const state = {
      ...InitialBusinessLevelState,
      businessLevel: null,
      loading: false,
      error: action.error,
    };
    const result = reducer(InitialBusinessLevelState, action);

    expect(result).toEqual(state);
  });
});
