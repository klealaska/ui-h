import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBusinessLevel from './business-level.reducer';

export const selectBusinessLevelState = createFeatureSelector<fromBusinessLevel.BusinessLevelState>(
  fromBusinessLevel.businessLevelFeatureKey
);

export const selectBusinessLevelNamePlural = createSelector(
  selectBusinessLevelState,
  (state: fromBusinessLevel.BusinessLevelState) => state.businessLevel?.businessLevelNamePlural
);

export const selectBusinessLevelNameSingular = createSelector(
  selectBusinessLevelState,
  (state: fromBusinessLevel.BusinessLevelState) => state.businessLevel?.businessLevelNameSingular
);

export const selectToast = createSelector(
  selectBusinessLevelState,
  (state: fromBusinessLevel.BusinessLevelState) => state.toast
);
