import { entitlementsReducer, initialEntitlementsState } from './entitlements.reducer';
import * as EntitlementsActions from './entitlements.actions';
import {
  IAssignProductEntitlementProps,
  IProductEntitlementMapped,
  ITenantEntitlementMapped,
} from '@ui-coe/tenant/shared/types';

describe('Entitlements Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toBe(initialEntitlementsState);
    });
  });

  describe('load entitlements', () => {
    it('should update the state when loadEntitlements is dispached', () => {
      const action = EntitlementsActions.loadEntitlements({});
      const state = {
        ...initialEntitlementsState,
        loading: true,
      };
      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });
    it('should update the state when loadEntitlementsSuccess is dispatched', () => {
      const id = '7hp0nqlpvwg0dyyehi1m';
      const getEntitlementsResponse: IProductEntitlementMapped[] = [
        {
          id: id,
          name: 'Purchase Workflow Automation',
          status: 'Active',
        },
      ];
      const action = EntitlementsActions.loadEntitlementsSuccess({
        response: getEntitlementsResponse,
      });
      const state = {
        ...initialEntitlementsState,
        productEntitlements: getEntitlementsResponse,
        loading: false,
      };
      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when loadEntitlementsFailure is dispatched', () => {
      const action = EntitlementsActions.loadEntitlementsFailure({ error: 'error' });
      const state = {
        ...initialEntitlementsState,
        productEntitlements: [],
        loading: false,
        error: 'error',
      };
      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });
  });

  describe('get Entitlements by Tenant ID', () => {
    const id = '7hp0nqlpvwg0dyyehi1m';
    const tenantEntitlements: ITenantEntitlementMapped[] = [
      {
        tenantId: id,
        productEntitlementId: '7hp0nqlpvwg0dyyehi1m',
        productEntitlementName: 'foo',
        tenantEntitlementStatus: 'Active',
      },
    ];

    it('should update the state when getEntitlementsByTenantId is dispatched', () => {
      const action = EntitlementsActions.getEntitlementsByTenantId({ id });
      const state = {
        ...initialEntitlementsState,
        loading: true,
      };
      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when getEntitlementsByTenantIdSuccess is dispatched', () => {
      const action = EntitlementsActions.getEntitlementsByTenantIdSuccess({
        response: tenantEntitlements,
      });
      const state = {
        ...initialEntitlementsState,
        tenantEntitlements: action.response,
        loading: false,
      };
      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when getEntitlementsByTenantIdFailure is dispatched', () => {
      const action = EntitlementsActions.getEntitlementsByTenantIdFailure({ error: 'error' });
      const state = {
        ...initialEntitlementsState,
        tenantEntitlements: [],
        loading: false,
        error: 'error',
      };
      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });
  });

  describe('assignProductEntitlement', () => {
    it('should update the state when assignProductEntitlement is dispatched', () => {
      const props: IAssignProductEntitlementProps = {
        productId: 'a',
        tenantId: 'b',
        reqBody: {
          assignmentDate: 'now',
          assignmentSource: 'somewhere',
          amount: 1000,
          sourceSystem: 'nowhere',
        },
      };
      const action = EntitlementsActions.assignProductEntitlement(props);
      const state = {
        ...initialEntitlementsState,
        loading: true,
      };

      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when assignProductEntitlementSuccess is dispatched', () => {
      const id = '7hp0nqlpvwg0dyyehi1m';
      const tenantEntitlement: ITenantEntitlementMapped = {
        tenantId: id,
        productEntitlementId: '7hp0nqlpvwg0dyyehi1m',
        productEntitlementName: 'foo',
        tenantEntitlementStatus: 'Active',
      };

      const action = EntitlementsActions.assignProductEntitlementSuccess({
        response: tenantEntitlement,
      });
      const state = {
        ...initialEntitlementsState,
        tenantEntitlements: [tenantEntitlement],
        loading: false,
      };

      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when assignProductEntitlementFailure is dispatched', () => {
      const action = EntitlementsActions.assignProductEntitlementFailure({ error: 'error' });
      const state = {
        ...initialEntitlementsState,
        loading: false,
        error: 'error',
      };

      const result = entitlementsReducer(initialEntitlementsState, action);

      expect(result).toEqual(state);
    });
  });
});
