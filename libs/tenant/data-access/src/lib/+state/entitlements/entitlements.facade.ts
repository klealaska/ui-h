import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  IAssignProductEntitlementToTenant,
  IGetProductEntitlementsParams,
  IProductEntitlementMapped,
  ITenantEntitlementMapped,
} from '@ui-coe/tenant/shared/types';
import { Observable } from 'rxjs';
import * as EntitlementsActions from './entitlements.actions';
import * as EntitlementsSelector from './entitlements.selectors';

@Injectable({
  providedIn: 'root',
})
export class EntitlementsFacade {
  productEntitlements$: Observable<IProductEntitlementMapped[]> = this.store.pipe(
    select(EntitlementsSelector.selectProductEntitlements)
  );

  tenantEntitlements$: Observable<ITenantEntitlementMapped[]> = this.store.pipe(
    select(EntitlementsSelector.selectTenantEntitlements)
  );

  constructor(private store: Store) {}

  getEntitlements(params?: IGetProductEntitlementsParams) {
    this.store.dispatch(EntitlementsActions.loadEntitlements({ params }));
  }

  getEntitlementsByTenantId(id: string) {
    this.store.dispatch(EntitlementsActions.getEntitlementsByTenantId({ id }));
  }

  assignProductEntitlementToTenant(
    productId: string,
    tenantId: string,
    reqBody: IAssignProductEntitlementToTenant
  ) {
    this.store.dispatch(
      EntitlementsActions.assignProductEntitlement({ productId, tenantId, reqBody })
    );
  }
}
