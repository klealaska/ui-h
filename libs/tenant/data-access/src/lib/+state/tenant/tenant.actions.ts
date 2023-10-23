import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { createAction, props } from '@ngrx/store';
import { IToastConfigData } from '@ui-coe/shared/types';

import {
  ICreateTenant,
  IGetTenant,
  IGetTenantParams,
  ITenant,
  ITenantMapped,
  IUpdateTenant,
} from '@ui-coe/tenant/shared/types';

export const loadTenants = createAction(
  '[Tenant] Load Tenants',
  props<{ params?: IGetTenantParams }>()
);

export const loadTenantsSuccess = createAction(
  '[Tenant] Load Tenants Success',
  props<{ response: IGetTenant<ITenantMapped> }>()
);

export const loadTenantsFailure = createAction(
  '[Tenant] Load Tenants Failure',
  props<{ error: unknown }>()
);

export const filterSortTenantList = createAction(
  '[Tenant] Filter Sort Tenant List',
  props<{ params: IGetTenantParams }>()
);

export const getTenantById = createAction('[Tenant] Get Tenant By Id', props<{ id: string }>());

export const getTenantByIdSuccess = createAction(
  '[Tenant] Get Tenant By Id Success',
  props<{ response: ITenant }>()
);

export const getTenantByIdFailure = createAction(
  '[Tenant] Get Tenant By Id Failure',
  props<{ error: unknown }>()
);

export const clearCurrentTenant = createAction('[Tenant] Clear Current Tenant');

export const postTenant = createAction('[Tenant] Post Tenant', props<{ request: ICreateTenant }>());

export const postTenantSuccess = createAction(
  '[Tenant] Post Tenant Success',
  props<{ response: ITenant }>()
);

export const postTenantFailure = createAction(
  '[Tenant] Post Tenant Failure',
  props<{ error: unknown }>()
);

export const updateTenant = createAction(
  '[Tenant] Update Tenant',
  props<{ id: string; body: IUpdateTenant }>()
);

export const updateTenantSuccess = createAction(
  '[Tenant] Update Tenant Success',
  props<{ tenant: ITenant }>()
);

export const updateTenantFailure = createAction(
  '[Tenant] Update Tenant Failure',
  props<{ error: unknown }>()
);

export const filterTenantList = createAction(
  '[Tenant] Filter Tenant List',
  props<{ params: IGetTenantParams }>()
);

export const displayToast = createAction(
  '[Tenant] Display Toast',
  props<{ config: MatSnackBarConfig<IToastConfigData> }>()
);

export const dismissToast = createAction('[Tenant] Dismiss Toast');
