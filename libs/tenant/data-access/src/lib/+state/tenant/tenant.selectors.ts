import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromTenant from './tenant.reducer';

export const selectTenantState = createFeatureSelector<fromTenant.State>(
  fromTenant.tenantFeatureKey
);
export const selectTenants = createSelector(
  selectTenantState,
  (state: fromTenant.State) => state.tenants
);

export const selectTenantItems = createSelector(
  selectTenantState,
  (state: fromTenant.State) => state.tenants?.items || []
);

export const selectCurrentTenant = createSelector(
  selectTenantState,
  (state: fromTenant.State) => state.currentTenant
);

export const selectTenantLoading = createSelector(
  selectTenantState,
  (state: fromTenant.State) => state.loading
);

export const selectTenantError = createSelector(
  selectTenantState,
  (state: fromTenant.State) => state.error
);

export const selectToast = createSelector(
  selectTenantState,
  (state: fromTenant.State) => state.toast
);

export const selectListFilterSort = createSelector(
  selectTenantState,
  (state: fromTenant.State) => state.listFilterSort
);
