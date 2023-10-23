import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { createReducer, on } from '@ngrx/store';

import { IGetTenant, IGetTenantParams, ITenant, ITenantMapped } from '@ui-coe/tenant/shared/types';

import * as TenantActions from './tenant.actions';
import { IToastConfigData } from '@ui-coe/shared/types';

export const tenantFeatureKey = 'tenant';

/**
 * TODO: separate into two feature states
 * one containing the UI state properties
 * and the other containing the tenant list data
 * this will allow us to use entities for the tenant list data
 * since it doesn't really work optimally with the combined store
 */
export interface State {
  tenants: IGetTenant<ITenantMapped>;
  currentTenant: ITenant;
  loading: boolean;
  error: unknown;
  toast: MatSnackBarConfig<IToastConfigData>;
  listFilterSort: IGetTenantParams;
}

export const initialState: State = {
  tenants: null,
  currentTenant: null,
  loading: false,
  error: null,
  toast: null,
  listFilterSort: null,
};

export const reducer = createReducer(
  initialState,

  on(TenantActions.loadTenants, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(TenantActions.filterSortTenantList, (state, action) => {
    return {
      ...state,
      listFilterSort: {
        ...state.listFilterSort,
        ...action.params,
      },
    };
  }),
  on(TenantActions.loadTenantsSuccess, (state, action) => {
    return {
      ...state,
      tenants: action.response,
      loading: false,
    };
  }),
  on(TenantActions.loadTenantsFailure, (state, action) => {
    return {
      ...state,
      tenants: null,
      loading: false,
      error: action.error,
    };
  }),
  on(TenantActions.getTenantById, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(TenantActions.getTenantByIdSuccess, (state, action) => {
    return {
      ...state,
      currentTenant: action.response,
      loading: false,
    };
  }),
  on(TenantActions.getTenantByIdFailure, (state, action) => {
    return {
      ...state,
      currentTenant: null,
      loading: false,
      error: action.error,
    };
  }),
  on(TenantActions.clearCurrentTenant, state => {
    return {
      ...state,
      currentTenant: null,
    };
  }),
  on(TenantActions.postTenant, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(TenantActions.postTenantSuccess, (state, action) => {
    return {
      ...state,
      currentTenant: action.response,
      loading: false,
    };
  }),
  on(TenantActions.postTenantFailure, (state, action) => {
    return {
      ...state,
      currentTenant: null,
      loading: false,
      error: action.error,
    };
  }),
  on(TenantActions.updateTenant, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(TenantActions.updateTenantSuccess, (state, action) => {
    return {
      ...state,
      currentTenant: action.tenant,
      loading: false,
    };
  }),
  on(TenantActions.updateTenantFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(TenantActions.displayToast, (state, action) => {
    return {
      ...state,
      toast: action.config,
    };
  }),
  on(TenantActions.dismissToast, state => {
    return {
      ...state,
      toast: null,
    };
  })
);
