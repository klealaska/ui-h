import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DetailsType } from '@ui-coe/bus-hier/shared/types';
import * as fromDetails from './details.reducer';

export const selectDetailsState = createFeatureSelector<fromDetails.DetailsState>(
  fromDetails.detailsFeatureKey
);

export const selectDetails = createSelector(
  selectDetailsState,
  (state: fromDetails.DetailsState) => state.details
);

export const selectEntities = createSelector(
  selectDetailsState,
  (state: fromDetails.DetailsState) => state.items
);

export const isDetailsLoading = createSelector(
  selectDetailsState,
  (state: fromDetails.DetailsState) => state.loading
);

export const selectToast = createSelector(
  selectDetailsState,
  (state: fromDetails.DetailsState) => state.toast
);

export const selectType = createSelector(selectDetailsState, (state: fromDetails.DetailsState) => {
  if (!state.details && !state.items) {
    return DetailsType.LANDING;
  } else if (state.details && !state.items) {
    return state.editDetailsMode ? DetailsType.EDIT_DETAILS : DetailsType.DETAILS;
  } else if (!state.details && state.items) {
    return DetailsType.LIST;
  }
});

export const selectEditDetailsMode = createSelector(
  selectDetailsState,
  (state: fromDetails.DetailsState) => state.editDetailsMode
);
