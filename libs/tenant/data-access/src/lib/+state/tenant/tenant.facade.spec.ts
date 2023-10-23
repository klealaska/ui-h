import { TestBed } from '@angular/core/testing';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { cold } from 'jasmine-marbles';

import {
  ICreateTenant,
  IGetTenant,
  ITenant,
  ITenantMapped,
  IUpdateTenant,
} from '@ui-coe/tenant/shared/types';
import { TenantFacade } from './tenant.facade';
import * as fromTenant from './tenant.reducer';
import * as TenantActions from './tenant.actions';
import { ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';

describe('Tenant Facade', () => {
  let tenantFacade: TenantFacade;
  let store: Store;
  let actions$: Observable<any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromTenant.tenantFeatureKey, fromTenant.reducer),
      ],
      providers: [TenantFacade, provideMockActions(() => actions$)],
    });

    tenantFacade = TestBed.inject(TenantFacade);
    store = TestBed.inject(Store);
  });

  describe('selectors', () => {
    it('should select the loading value from state', () => {
      const isLoading = cold('a', { a: true });
      store.dispatch(TenantActions.loadTenants({}));

      expect(tenantFacade.isLoading$).toBeObservable(isLoading);
    });

    it('should select the data value from state', () => {
      const getTenantResponse: IGetTenant<ITenantMapped> = {
        itemsRequested: 10,
        itemsReturned: 10,
        itemsTotal: 20,
        offset: 0,
        items: [],
      };

      const tenants = cold('a', { a: getTenantResponse });
      store.dispatch(TenantActions.loadTenantsSuccess({ response: getTenantResponse }));

      expect(tenantFacade.tenants$).toBeObservable(tenants);
    });

    it('should select the currentTenant from state', () => {
      const id = '7hp0nqlpvwg0dyyehi1m';
      const tenant: ITenant = {
        tenantId: id,
        siteName: 'Burger Bling',
        storageRegion: 'eastus',
        tenantType: 'Buyer',
        tenantStatus: 'Active',
        cmpId: 'c5szq6tsto075wstvi9m',
        customerName: 'Burger King Franchise',
        partnerName: 'Mastercard',
        sourceSystem: 'Swagger-UI',
        createdDate: '2022-09-16T16:00:33Z',
        lastModifiedDate: '2022-09-16T16:00:33Z',
        createdByUserId: 'jg4nh6in638l29wxur4e',
        lastModifiedByUserId: 'fhh9rgm0qhn8pgaq0u28',
      };

      const currentTenant$ = cold('a', { a: tenant });
      store.dispatch(TenantActions.getTenantByIdSuccess({ response: tenant }));

      expect(tenantFacade.currentTenant$).toBeObservable(currentTenant$);
    });

    it('should select the error value from state', () => {
      const error = cold('a', { a: 'error' });
      store.dispatch(TenantActions.loadTenantsFailure({ error: 'error' }));

      expect(tenantFacade.error$).toBeObservable(error);
    });

    it('should select the toast value from state', () => {
      const toastConfig = {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        data: {
          title: 'foo',
          type: ToastTypeEnum.SUCCESS,
          icon: ToastIcon.CHECK_CIRCLE,
          close: true,
        },
      };
      const toast = cold('a', { a: toastConfig });
      store.dispatch(TenantActions.displayToast({ config: toastConfig as MatSnackBarConfig }));

      expect(tenantFacade.toast$).toBeObservable(toast);
    });
  });

  describe('actions', () => {
    it('should get tenants', () => {
      const spy = jest.spyOn(store, 'dispatch');

      tenantFacade.getTenants({});
      expect(spy).toHaveBeenCalledWith(TenantActions.loadTenants({ params: {} }));
    });

    it('should get tenant by ID', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();

      tenantFacade.getTenantById('foo');
      expect(store.dispatch).toHaveBeenCalledWith(TenantActions.getTenantById({ id: 'foo' }));
    });

    it('should clear the current tenant', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();

      tenantFacade.clearCurrentTenant();
      expect(store.dispatch).toHaveBeenCalledWith(TenantActions.clearCurrentTenant());
    });

    it('should post tenant', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();

      const request: ICreateTenant = {
        siteName: 'bar',
        storageRegion: 'eastus',
        tenantType: 'production',
        ownerType: 'buyer',
        cmpId: '1',
        partnerName: 'foobarbaz',
        sourceSystem: 'abc',
      };

      tenantFacade.postTenant(request);
      expect(store.dispatch).toHaveBeenCalledWith(TenantActions.postTenant({ request }));
    });

    it('should update tenant', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();

      const id: string = 'foo';
      const body: IUpdateTenant = {
        siteName: 'bar',
      };

      tenantFacade.updateTenant(id, body);
      expect(store.dispatch).toHaveBeenCalledWith(TenantActions.updateTenant({ id, body }));
    });

    it('should display toast', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();

      const toastConfig = {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        data: {
          title: 'foo',
          type: ToastTypeEnum.SUCCESS,
          icon: ToastIcon.CHECK_CIRCLE,
          close: true,
        },
      };

      tenantFacade.displayToast(toastConfig as MatSnackBarConfig);
      expect(store.dispatch).toHaveBeenCalledWith(
        TenantActions.displayToast({ config: toastConfig as MatSnackBarConfig })
      );
    });

    it('should dismiss toast', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();
      tenantFacade.dismissToast();

      expect(store.dispatch).toHaveBeenCalledWith(TenantActions.dismissToast());
    });

    it('should update the tenant list filter sort params', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();
      tenantFacade.filterSortTenantList({ siteName: 'foo' });

      expect(store.dispatch).toHaveBeenCalledWith(
        TenantActions.filterSortTenantList({ params: { siteName: 'foo' } })
      );
    });
  });
});
