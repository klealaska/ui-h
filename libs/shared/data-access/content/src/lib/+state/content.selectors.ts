import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CONTENT_FEATURE_KEY, ContentState, contentAdapter } from './content.reducer';

// Lookup the 'Content' feature state managed by NgRx
export const getContentState = createFeatureSelector<ContentState>(CONTENT_FEATURE_KEY);

const { selectAll, selectEntities } = contentAdapter.getSelectors();

export const getContentLoaded = createSelector(getContentState, (state: ContentState) => {
  return state.loaded;
});

export const getContentError = createSelector(
  getContentState,
  (state: ContentState) => state.error
);

export const getAllContent = createSelector(getContentState, (state: ContentState) =>
  selectAll(state)
);

export const getContentEntities = createSelector(getContentState, (state: ContentState) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getContentState,
  (state: ContentState) => state.selectedId
);

export const getSelected = createSelector(
  getContentEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);

export const getSelectedById = (productId: string) =>
  createSelector(getContentEntities, entities => {
    return entities[productId];
  });

export const getAllContentData = () =>
  createSelector(getContentEntities, entities => {
    return entities;
  });

export const getNavData = createSelector(getAllContent, content => {
  const apps = [];
  delete content['0']; // This removes the shell/home details from the sidenav display
  content.forEach(app => {
    apps.push(app.attributes);
  });
  return apps;
});
