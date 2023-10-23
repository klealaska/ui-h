import * as fromEntitlements from './entitlements.actions';

describe('loadEntitlements', () => {
  describe('loadEntitlements', () => {
    it('should return loadEntitlements action', () => {
      expect(fromEntitlements.loadEntitlements({}).type).toBe('[Entitlement] Load Entitlements');
    });

    it('should return loadTenantsSuccess action', () => {
      expect(fromEntitlements.loadEntitlementsSuccess({ response: null }).type).toBe(
        '[Entitlement] Load Entitlements Success'
      );
    });

    it('should return loadEntitlementsFailure action', () => {
      expect(fromEntitlements.loadEntitlementsFailure({ error: null }).type).toBe(
        '[Entitlement] Load Entitlements Failure'
      );
    });
  });

  describe('getEntitlementsByTenantId', () => {
    it('should return getEntitlementsByTenantId action', () => {
      expect(fromEntitlements.getEntitlementsByTenantId({ id: 'foo ' }).type).toBe(
        '[Entitlement] Get Entitlement By Tenant Id'
      );
    });

    it('should return getEntitlementsByTenantId Suceccess action', () => {
      expect(fromEntitlements.getEntitlementsByTenantIdSuccess({ response: null }).type).toBe(
        '[Entitlement] Get Entitlement By Tenant Id Success'
      );
    });

    it('should return getEntitlementsByTenantIdFailure action', () => {
      expect(fromEntitlements.getEntitlementsByTenantIdFailure({ error: null }).type).toBe(
        '[Entitlement] Get Entitlement By Tenant Id Failure'
      );
    });
  });

  describe('assignProductEntitlement', () => {
    it('should return assignProductEntitlement action', () => {
      expect(
        fromEntitlements.assignProductEntitlement({
          productId: 'a',
          tenantId: 'b',
          reqBody: {
            assignmentDate: 'now',
            assignmentSource: 'somewhere',
            amount: 1000,
            sourceSystem: 'nowhere',
          },
        }).type
      ).toBe('[Entitlement] Assign Product Entitlement');
    });

    it('should return assignProductEntitlementSuccess action', () => {
      expect(fromEntitlements.assignProductEntitlementSuccess({ response: null }).type).toBe(
        '[Entitlement] Assign Product Entitlement Success'
      );
    });

    it('should return assignProductEntitlementFailure action', () => {
      expect(fromEntitlements.assignProductEntitlementFailure({ error: null }).type).toBe(
        '[Entitlement] Assign Product Entitlement Failure'
      );
    });
  });
});
