import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEntitlements from './entitlements.reducer';

export const selectEntitlementsState = createFeatureSelector<fromEntitlements.EntitlementsState>(
  fromEntitlements.entitlementsFeatureKey
);

export const selectProductEntitlements = createSelector(
  selectEntitlementsState,
  (state: fromEntitlements.EntitlementsState) => state.productEntitlements
);

export const selectTenantEntitlements = createSelector(
  selectEntitlementsState,
  (state: fromEntitlements.EntitlementsState) => state.tenantEntitlements
);
