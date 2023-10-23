import * as fromTenant from './tenant.actions';

describe('Tenant', () => {
  describe('loadTenants', () => {
    it('should return loadTenants action', () => {
      expect(fromTenant.loadTenants({}).type).toBe('[Tenant] Load Tenants');
    });

    it('should return loadTenantsSuccess action', () => {
      expect(fromTenant.loadTenantsSuccess({ response: null }).type).toBe(
        '[Tenant] Load Tenants Success'
      );
    });

    it('should return loadTenantsFailure action', () => {
      expect(fromTenant.loadTenantsFailure({ error: null }).type).toBe(
        '[Tenant] Load Tenants Failure'
      );
    });
  });

  describe('getTenantById', () => {
    it('should return getTenantById action', () => {
      expect(fromTenant.getTenantById({ id: 'foo ' }).type).toBe('[Tenant] Get Tenant By Id');
    });

    it('should return getTenantByIdSuccess action', () => {
      expect(fromTenant.getTenantByIdSuccess({ response: null }).type).toBe(
        '[Tenant] Get Tenant By Id Success'
      );
    });

    it('should return getTenantByIdFailure action', () => {
      expect(fromTenant.getTenantByIdFailure({ error: null }).type).toBe(
        '[Tenant] Get Tenant By Id Failure'
      );
    });
  });

  describe('clearCurrentTenant', () => {
    it('should return clearCurrentTenant action', () => {
      expect(fromTenant.clearCurrentTenant().type).toBe('[Tenant] Clear Current Tenant');
    });
  });

  describe('postTenant', () => {
    it('should return postTenant action', () => {
      expect(fromTenant.postTenant({ request: null }).type).toBe('[Tenant] Post Tenant');
    });

    it('should return postTenantSuccess action', () => {
      expect(fromTenant.postTenantSuccess({ response: null }).type).toBe(
        '[Tenant] Post Tenant Success'
      );
    });

    it('should return postTenantFailure action', () => {
      expect(fromTenant.postTenantFailure({ error: '' }).type).toBe('[Tenant] Post Tenant Failure');
    });
  });

  describe('updateTenant', () => {
    it('should return updateTenant action', () => {
      expect(fromTenant.updateTenant({ id: 'foo', body: { siteName: 'baz' } }).type).toBe(
        '[Tenant] Update Tenant'
      );
    });

    it('should return updateTenantSuccess action', () => {
      expect(fromTenant.updateTenantSuccess({ tenant: null }).type).toBe(
        '[Tenant] Update Tenant Success'
      );
    });

    it('should return updataeTenantFailure action', () => {
      expect(fromTenant.updateTenantFailure({ error: '' }).type).toBe(
        '[Tenant] Update Tenant Failure'
      );
    });
  });

  describe('filterTenantList', () => {
    it('should return filterTenantList action', () => {
      expect(fromTenant.filterTenantList({ params: {} }).type).toBe('[Tenant] Filter Tenant List');
    });
  });

  describe('toast', () => {
    it('should return displayToast action', () => {
      expect(fromTenant.displayToast({ config: {} }).type).toBe('[Tenant] Display Toast');
    });

    it('should return displayToast action', () => {
      expect(fromTenant.dismissToast().type).toBe('[Tenant] Dismiss Toast');
    });
  });
});
