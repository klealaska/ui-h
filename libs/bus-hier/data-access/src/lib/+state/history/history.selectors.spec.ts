import * as fromHistory from './history.reducer';
import { selectHistoryState } from './history.selectors';

describe('History Selectors', () => {
  it('should select the feature state', () => {
    const result = selectHistoryState({
      [fromHistory.historyFeatureKey]: {},
    });

    expect(result).toEqual({});
  });
});
