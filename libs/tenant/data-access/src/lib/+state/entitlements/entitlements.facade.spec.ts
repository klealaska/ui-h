import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EntitlementsFacade } from './entitlements.facade';
import * as fromEntitlements from './entitlements.reducer';
import * as EntitlementsActions from './entitlements.actions';
import { IAssignProductEntitlementProps } from '@ui-coe/tenant/shared/types';
describe('EntitlementsFacade', () => {
  let entitlementsFacade: EntitlementsFacade;
  let store: Store;
  let actions$: Observable<any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          fromEntitlements.entitlementsFeatureKey,
          fromEntitlements.entitlementsReducer
        ),
      ],
      providers: [EntitlementsFacade, provideMockActions(() => actions$)],
    });
    entitlementsFacade = TestBed.inject(EntitlementsFacade);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(entitlementsFacade).toBeTruthy();
  });

  describe('actions', () => {
    it('should get Entitlements', () => {
      const spy = jest.spyOn(store, 'dispatch');

      entitlementsFacade.getEntitlements({});
      expect(spy).toHaveBeenCalledWith(EntitlementsActions.loadEntitlements({ params: {} }));
    });

    it('should get Entitlements By tenant ID', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();

      entitlementsFacade.getEntitlementsByTenantId('foo');
      expect(store.dispatch).toHaveBeenCalledWith(
        EntitlementsActions.getEntitlementsByTenantId({ id: 'foo' })
      );
    });

    it('should assign product entitlement to tenant', () => {
      const productId = 'a';
      const tenantId = 'b';
      const reqBody = {
        assignmentDate: 'now',
        assignmentSource: 'somewhere',
        amount: 1000,
        sourceSystem: 'nowhere',
      };

      jest.spyOn(store, 'dispatch').mockImplementation();

      entitlementsFacade.assignProductEntitlementToTenant(productId, tenantId, reqBody);
      expect(store.dispatch).toHaveBeenCalledWith(
        EntitlementsActions.assignProductEntitlement({ productId, tenantId, reqBody })
      );
    });
  });
});
