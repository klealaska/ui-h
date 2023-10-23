import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';

export const selectUserState = createFeatureSelector<fromUser.State>(fromUser.userFeatureKey);

const { selectAll } = fromUser.adapter.getSelectors();

export const selectUsers = createSelector(
  selectUserState,
  (state: fromUser.State) => selectAll(state) || []
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: fromUser.State) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state: fromUser.State) => state.error
);

export const selectToast = createSelector(selectUserState, (state: fromUser.State) => state.toast);
