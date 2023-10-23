import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as EntitlementsActions from './entitlements.actions';

import {
  IAssignProductEntitlementProps,
  IGetProductEntitlementsParams,
  IProductEntitlementMapped,
  ITenantEntitlementMapped,
} from '@ui-coe/tenant/shared/types';
import { EntitlementsService } from '../../services';

@Injectable()
export class EntitlementsEffects {
  constructor(private actions$: Actions, private entitlementService: EntitlementsService) {}
  loadEntitlements$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EntitlementsActions.loadEntitlements),
      switchMap(({ params }: { params?: IGetProductEntitlementsParams }) => {
        return this.entitlementService.getEntitlementsData(params).pipe(
          map((response: IProductEntitlementMapped[]) =>
            EntitlementsActions.loadEntitlementsSuccess({ response })
          ),
          catchError(error => of(EntitlementsActions.loadEntitlementsFailure({ error })))
        );
      })
    );
  });

  getEntitlementsByTenantId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EntitlementsActions.getEntitlementsByTenantId),
      switchMap(({ id }: { id: string }) => {
        return this.entitlementService.getEntitlementsByTenantId(id).pipe(
          map((entitlements: ITenantEntitlementMapped[]) =>
            EntitlementsActions.getEntitlementsByTenantIdSuccess({ response: entitlements })
          ),
          catchError(error => of(EntitlementsActions.getEntitlementsByTenantIdFailure({ error })))
        );
      })
    );
  });

  assignProductEntitlementToTenant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EntitlementsActions.assignProductEntitlement),
      switchMap(({ productId, tenantId, reqBody }: IAssignProductEntitlementProps) => {
        return this.entitlementService.assignProductEntitlement(productId, tenantId, reqBody).pipe(
          map((response: ITenantEntitlementMapped) =>
            EntitlementsActions.assignProductEntitlementSuccess({ response })
          ),
          catchError(error => of(EntitlementsActions.assignProductEntitlementFailure({ error })))
        );
      })
    );
  });
}
