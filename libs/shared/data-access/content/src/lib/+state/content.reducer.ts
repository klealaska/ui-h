import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ContentActions from './content.actions';
import { ContentEntity } from './content.models';

export const CONTENT_FEATURE_KEY = 'content';

export interface ContentState extends EntityState<ContentEntity> {
  selectedId?: string | number; // which Content record has been selected
  loaded: boolean | null; // has the Content list been loaded
  error?: string | null; // last known error (if any)
}

export interface ContentPartialState {
  readonly [CONTENT_FEATURE_KEY]: ContentState;
}

export const contentAdapter: EntityAdapter<ContentEntity> = createEntityAdapter<ContentEntity>({
  selectId: (content: ContentEntity) => <string>content.id,
});

export const initialContentState: ContentState = contentAdapter.getInitialState({
  // set initial required properties
  loaded: null,
});

const reducer = createReducer(
  initialContentState,
  on(ContentActions.initContent, state => ({ ...state, loaded: false, error: null })),
  on(ContentActions.loadContentSuccess, (state, { content }) =>
    contentAdapter.setAll(content, { ...state, loaded: true })
  ),
  on(ContentActions.loadContentFailure, (state, { error }) => ({ ...state, error }))
);

export function contentReducer(state: ContentState | undefined, action: Action) {
  return reducer(state, action);
}
