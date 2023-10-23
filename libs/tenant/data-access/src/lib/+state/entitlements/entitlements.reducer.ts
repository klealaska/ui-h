import { createReducer, on } from '@ngrx/store';
import { IProductEntitlementMapped, ITenantEntitlementMapped } from '@ui-coe/tenant/shared/types';
import * as EntitlementsActions from './entitlements.actions';

export const entitlementsFeatureKey = 'entitlements';

export interface EntitlementsState {
  productEntitlements: IProductEntitlementMapped[];
  tenantEntitlements: ITenantEntitlementMapped[];
  loading: boolean;
  error: unknown;
}

export const initialEntitlementsState: EntitlementsState = {
  productEntitlements: [],
  tenantEntitlements: [],
  loading: false,
  error: null,
};

export const entitlementsReducer = createReducer(
  initialEntitlementsState,

  on(EntitlementsActions.loadEntitlements, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(EntitlementsActions.loadEntitlementsSuccess, (state, action) => {
    return {
      ...state,
      productEntitlements: action.response,
      loading: false,
    };
  }),
  on(EntitlementsActions.loadEntitlementsFailure, (state, action) => {
    return {
      ...state,
      productEntitlements: initialEntitlementsState.productEntitlements,
      loading: false,
      error: action.error,
    };
  }),
  on(EntitlementsActions.getEntitlementsByTenantId, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(EntitlementsActions.getEntitlementsByTenantIdSuccess, (state, action) => {
    return {
      ...state,
      tenantEntitlements: action.response,
      loading: false,
    };
  }),
  on(EntitlementsActions.getEntitlementsByTenantIdFailure, (state, action) => {
    return {
      ...state,
      tenantEntitlements: initialEntitlementsState.tenantEntitlements,
      loading: false,
      error: action.error,
    };
  }),
  on(EntitlementsActions.assignProductEntitlement, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(EntitlementsActions.assignProductEntitlementSuccess, (state, action) => {
    return {
      ...state,
      tenantEntitlements: state.tenantEntitlements.concat(action.response),
      loading: false,
    };
  }),
  on(EntitlementsActions.assignProductEntitlementFailure, (state, action) => {
    return {
      ...state,
      // if the POST fails we don't want to null out the existing list of tenant entitlements
      loading: false,
      error: action.error,
    };
  })
);
