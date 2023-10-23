import { Action } from '@ngrx/store';

import * as ContentActions from './content.actions';
import { ContentEntity } from './content.models';
import { ContentState, initialContentState, contentReducer } from './content.reducer';

describe('Content Reducer', () => {
  const createContentEntity = (id: string): ContentEntity => ({
    id,
  });

  describe('valid Content actions', () => {
    it('loadContentSuccess should return the list of known Content', () => {
      const content = [createContentEntity('PRODUCT-AAA'), createContentEntity('PRODUCT-zzz')];
      const action = ContentActions.loadContentSuccess({ content });

      const result: ContentState = contentReducer(initialContentState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = contentReducer(initialContentState, action);

      expect(result).toBe(initialContentState);
    });
  });
});
