import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatestWith, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  ContentKeys,
  ICreateTenant,
  IGetTenant,
  IGetTenantParams,
  ITenant,
  ITenantMapped,
  IUpdateTenant,
} from '@ui-coe/tenant/shared/types';

import * as TenantActions from './tenant.actions';
import { TenantService } from '../../services';
import { ContentFacade } from '@ui-coe/shared/data-access/content';
import { ConfigService } from '@ui-coe/shared/util/services';
import { IGetToastOptions, ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';
import { getToasterConfig } from '@ui-coe/shared/util/interfaces';

@Injectable()
export class TenantEffects {
  constructor(
    private actions$: Actions,
    private tenantService: TenantService,
    private translateService: TranslateService,
    private contentFacade: ContentFacade,
    private configService: ConfigService
  ) {}

  loadTenants$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TenantActions.loadTenants),
      switchMap(({ params }: { params?: IGetTenantParams }) => {
        return this.tenantService.getTenantData(params).pipe(
          map((response: IGetTenant<ITenantMapped>) =>
            TenantActions.loadTenantsSuccess({ response })
          ),
          catchError(error => of(TenantActions.loadTenantsFailure({ error })))
        );
      })
    );
  });

  getTenantById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TenantActions.getTenantById),
      switchMap(({ id }: { id: string }) => {
        return this.tenantService.getTenantById(id).pipe(
          map((tenant: ITenant) => TenantActions.getTenantByIdSuccess({ response: tenant })),
          catchError(error => of(TenantActions.getTenantByIdFailure({ error })))
        );
      })
    );
  });

  postTenant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TenantActions.postTenant),
      switchMap(({ request }: { request: ICreateTenant }) => {
        return this.tenantService.postTenantData(request).pipe(
          map((tenant: ITenant) => TenantActions.postTenantSuccess({ response: tenant })),
          catchError(error => of(TenantActions.postTenantFailure({ error })))
        );
      })
    );
  });

  updateTenant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TenantActions.updateTenant),
      switchMap(({ id, body }: { id: string; body: IUpdateTenant }) => {
        return this.tenantService.updateTenant(id, body).pipe(
          map((tenant: ITenant) => TenantActions.updateTenantSuccess({ tenant })),
          catchError(error => of(TenantActions.updateTenantFailure({ error })))
        );
      })
    );
  });

  displayToast$ = createEffect(() => {
    let toastConfigOptions: IGetToastOptions;

    return this.actions$.pipe(
      ofType(
        TenantActions.postTenantSuccess,
        TenantActions.postTenantFailure,
        TenantActions.updateTenantSuccess,
        TenantActions.updateTenantFailure
      ),
      combineLatestWith(this.translateService.get([ContentKeys.CUSTOMER_DETAILS_TENANT_TOASTER])),
      switchMap(([action, translation]) => {
        switch (action.type) {
          case TenantActions.postTenantSuccess.type:
            toastConfigOptions = {
              title: translation[ContentKeys.CUSTOMER_DETAILS_TENANT_TOASTER].create.title.success,
            };
            break;

          case TenantActions.postTenantFailure.type:
            toastConfigOptions = {
              title: translation[ContentKeys.CUSTOMER_DETAILS_TENANT_TOASTER].create.title.error,
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;

          case TenantActions.updateTenantSuccess.type:
            toastConfigOptions = {
              title: translation[ContentKeys.CUSTOMER_DETAILS_TENANT_TOASTER].update.title.success,
            };
            break;

          case TenantActions.updateTenantFailure.type:
            toastConfigOptions = {
              title: translation[ContentKeys.CUSTOMER_DETAILS_TENANT_TOASTER].update.title.error,
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
        }

        return of(TenantActions.displayToast({ config: getToasterConfig(toastConfigOptions) }));
      })
    );
  });

  loadContent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TenantActions.loadTenants),
        withLatestFrom(this.contentFacade.getContentById(this.configService.get('cmsProductId'))),
        map(productContent => {
          if (!productContent) {
            this.contentFacade.initProduct(this.configService.get('cmsProductId'));
          }
        })
      ),
    { dispatch: false }
  );
}
