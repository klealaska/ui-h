import { Injectable } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  ICreateTenant,
  IGetTenant,
  IGetTenantParams,
  ITenant,
  ITenantMapped,
  IUpdateTenant,
} from '@ui-coe/tenant/shared/types';

import * as TenantActions from './tenant.actions';
import * as TenantSelectors from './tenant.selectors';
import { IToastConfigData } from '@ui-coe/shared/types';

@Injectable({
  providedIn: 'root',
})
export class TenantFacade {
  isLoading$ = this.store.pipe(select(TenantSelectors.selectTenantLoading));

  tenants$: Observable<IGetTenant<ITenantMapped>> = this.store.pipe(
    select(TenantSelectors.selectTenants)
  );

  tenantListItems$: Observable<ITenantMapped[]> = this.store.pipe(
    select(TenantSelectors.selectTenantItems)
  );

  currentTenant$: Observable<ITenant> = this.store.pipe(
    select(TenantSelectors.selectCurrentTenant)
  );

  error$ = this.store.pipe(select(TenantSelectors.selectTenantError));

  toast$ = this.store.pipe(select(TenantSelectors.selectToast));

  filterSort$ = this.store.pipe(select(TenantSelectors.selectListFilterSort));

  constructor(private store: Store) {}

  getTenants(params?: IGetTenantParams) {
    this.store.dispatch(TenantActions.loadTenants({ params }));
  }

  getTenantById(id: string) {
    this.store.dispatch(TenantActions.getTenantById({ id }));
  }

  clearCurrentTenant() {
    this.store.dispatch(TenantActions.clearCurrentTenant());
  }

  postTenant(request: ICreateTenant) {
    this.store.dispatch(TenantActions.postTenant({ request }));
  }

  updateTenant(id: string, body: IUpdateTenant) {
    this.store.dispatch(TenantActions.updateTenant({ id, body }));
  }

  displayToast(config: MatSnackBarConfig<IToastConfigData>) {
    this.store.dispatch(TenantActions.displayToast({ config }));
  }

  dismissToast() {
    this.store.dispatch(TenantActions.dismissToast());
  }

  filterSortTenantList(params: IGetTenantParams) {
    this.store.dispatch(TenantActions.filterSortTenantList({ params }));
  }
}
