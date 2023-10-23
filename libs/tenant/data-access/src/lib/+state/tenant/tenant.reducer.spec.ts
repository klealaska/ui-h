import { IGetTenant, ITenant, ITenantMapped } from '@ui-coe/tenant/shared/types';
import { reducer, initialState } from './tenant.reducer';
import * as TenantActions from './tenant.actions';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';

describe('Tenant Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state for invalid action', () => {
      const action = { type: 'foo' } as any;
      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('load tenants', () => {
    it('should update the state when loadTenants is dispatched', () => {
      const action = TenantActions.loadTenants({});
      const state = {
        ...initialState,
        loading: true,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when filterSortTenantList is dispatched', () => {
      const action = TenantActions.filterSortTenantList({ params: { siteName: 'foo' } });
      const state = {
        ...initialState,
        listFilterSort: {
          ...initialState.listFilterSort,
          siteName: 'foo',
        },
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when loadTenantsSuccess is dispatched', () => {
      const getTenantResponse: IGetTenant<ITenantMapped> = {
        itemsRequested: 10,
        itemsReturned: 10,
        itemsTotal: 20,
        offset: 0,
        items: [],
      };
      const action = TenantActions.loadTenantsSuccess({ response: getTenantResponse });
      const state = {
        ...initialState,
        tenants: getTenantResponse,
        loading: false,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when loadTenantsFailure is dispatched', () => {
      const action = TenantActions.loadTenantsFailure({ error: 'error' });
      const state = {
        ...initialState,
        loading: false,
        error: 'error',
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });
  });

  describe('get tenant by ID', () => {
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
    it('should update the state when getTenantById is dispatched', () => {
      const action = TenantActions.getTenantById({ id });
      const state = {
        ...initialState,
        loading: true,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when getTenantByIdSuccess is dispatched', () => {
      const action = TenantActions.getTenantByIdSuccess({ response: tenant });
      const state = {
        ...initialState,
        currentTenant: tenant,
        loading: false,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when getTenantByIdFaliure is dispatched', () => {
      const action = TenantActions.getTenantByIdFailure({ error: 'error' });
      const state = {
        ...initialState,
        currentTenant: null,
        loading: false,
        error: 'error',
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });
  });

  describe('clear current tenant', () => {
    it('should clear the current tenant', () => {
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
      const beginingState = {
        ...initialState,
        currentTenant: tenant,
        loading: false,
      };
      const endingState = {
        ...initialState,
        currentTenant: null,
      };

      const beginningResult = reducer(
        initialState,
        TenantActions.getTenantByIdSuccess({ response: tenant })
      );
      expect(beginningResult).toEqual(beginingState);

      const endingResult = reducer(beginingState, TenantActions.clearCurrentTenant());
      expect(endingResult).toEqual(endingState);
    });
  });

  describe('post tenant', () => {
    it('should update the state when postTenant is dispatched', () => {
      const action = TenantActions.postTenant({ request: null });
      const state = {
        ...initialState,
        loading: true,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when postTenantSuccess is dispatched', () => {
      const postTenantResponse: ITenant = {
        tenantId: '7hp0nqlpvwg0dyyehi1m',
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
      const action = TenantActions.postTenantSuccess({ response: postTenantResponse });
      const state = {
        ...initialState,
        currentTenant: postTenantResponse,
        loading: false,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when postTenantFailure is dispatched', () => {
      const action = TenantActions.postTenantFailure({ error: 'error' });
      const state = {
        ...initialState,
        loading: false,
        error: 'error',
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });
  });

  describe('update tenant', () => {
    it('should update the state when updateTenant is dispatched', () => {
      const action = TenantActions.updateTenant({ id: 'foo', body: null });
      const state = {
        ...initialState,
        loading: true,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when updateTenantSuccess is dispatched', () => {
      const action = TenantActions.updateTenantSuccess({ tenant: null });
      const state = {
        ...initialState,
        loading: false,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when updateTenantFailure is dispatched', () => {
      const action = TenantActions.updateTenantFailure({ error: 'error' });
      const state = {
        ...initialState,
        loading: false,
        error: 'error',
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });
  });

  describe('toast', () => {
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

    it('should update the state when displayToast is dispatched', () => {
      const action = TenantActions.displayToast({ config: toastConfig as MatSnackBarConfig });
      const state = {
        ...initialState,
        toast: toastConfig,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when dismissToast is dispatched', () => {
      const action = TenantActions.dismissToast();
      const state = {
        ...initialState,
        toast: null,
      };
      const result = reducer(initialState, action);

      expect(result).toEqual(state);
    });
  });
});
