import { createAction, props } from '@ngrx/store';

import {
  IAssignProductEntitlementProps,
  IGetProductEntitlementsParams,
  IProductEntitlementMapped,
  ITenantEntitlementMapped,
} from '@ui-coe/tenant/shared/types';

export const loadEntitlements = createAction(
  '[Entitlement] Load Entitlements',
  props<{ params?: IGetProductEntitlementsParams }>()
);

export const loadEntitlementsSuccess = createAction(
  '[Entitlement] Load Entitlements Success',
  props<{ response: IProductEntitlementMapped[] }>()
);

export const loadEntitlementsFailure = createAction(
  '[Entitlement] Load Entitlements Failure',
  props<{ error: unknown }>()
);

export const getEntitlementsByTenantId = createAction(
  '[Entitlement] Get Entitlement By Tenant Id',
  props<{ id: string }>()
);

export const getEntitlementsByTenantIdSuccess = createAction(
  '[Entitlement] Get Entitlement By Tenant Id Success',
  props<{ response: ITenantEntitlementMapped[] }>()
);

export const getEntitlementsByTenantIdFailure = createAction(
  '[Entitlement] Get Entitlement By Tenant Id Failure',
  props<{ error: unknown }>()
);

export const assignProductEntitlement = createAction(
  '[Entitlement] Assign Product Entitlement',
  props<IAssignProductEntitlementProps>()
);

export const assignProductEntitlementSuccess = createAction(
  '[Entitlement] Assign Product Entitlement Success',
  props<{ response: ITenantEntitlementMapped }>()
);

export const assignProductEntitlementFailure = createAction(
  '[Entitlement] Assign Product Entitlement Failure',
  props<{ error: unknown }>()
);
