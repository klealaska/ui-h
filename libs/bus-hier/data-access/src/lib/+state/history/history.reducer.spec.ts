import { reducer, initialHistoryState } from './history.reducer';

describe('History Reducer', () => {
  describe('an unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialHistoryState, action);
      expect(result).toBe(initialHistoryState);
    });
    it('should return history event', () => {
      const action = {
        payload: { dontTrack: false },
        history: { loading: 'loading something' },
        type: undefined,
      };

      const result = reducer(initialHistoryState, action);

      expect(result).toStrictEqual({
        events: [
          [
            {
              payload: { dontTrack: false },
              response: undefined,
              loading: 'loading something',
              type: undefined,
              correlationId: undefined,
            },
          ],
        ],
      });
    });
    it('should not track', () => {
      const action = {
        type: undefined,
        payload: { dontTrack: true },
        history: { loading: 'loading something' },
      };

      const result = reducer(initialHistoryState, action);

      expect(result).toBe(initialHistoryState);
    });
  });
});
