import * as fromTenant from './tenant.reducer';
import {
  selectTenants,
  selectTenantError,
  selectTenantLoading,
  selectTenantState,
  selectCurrentTenant,
  selectTenantItems,
  selectToast,
  selectListFilterSort,
} from './tenant.selectors';

describe('Tenant Selectors', () => {
  const state: fromTenant.State = {
    tenants: {
      itemsRequested: 0,
      itemsReturned: 0,
      itemsTotal: 0,
      offset: 0,
      items: [],
    },
    currentTenant: null,
    loading: false,
    error: null,
    toast: null,
    listFilterSort: null,
  };

  it('should select the feature state', () => {
    const result = selectTenantState({
      [fromTenant.tenantFeatureKey]: state,
    });

    expect(result).toEqual(state);
  });

  it('should select the tenants', () => {
    const result = selectTenants.projector(state);
    expect(result).toBe(state.tenants);
  });

  it('should select the tenantItems array', () => {
    const result = selectTenantItems.projector(state);
    expect(result).toBe(state.tenants.items);
  });

  it('should return undefined if tenants is falsy', () => {
    const nullTenantState: fromTenant.State = {
      tenants: null,
      currentTenant: null,
      loading: false,
      error: null,
      toast: null,
      listFilterSort: null,
    };
    selectTenantState({ [fromTenant.tenantFeatureKey]: nullTenantState });
    const result = selectTenantItems.projector(nullTenantState);
    expect(result).toEqual([]);
  });

  it('should select the current tenant', () => {
    const result = selectCurrentTenant.projector(state);
    expect(result).toBe(state.currentTenant);
  });

  it('should select the tenant loading state', () => {
    const result = selectTenantLoading.projector(state);
    expect(result).toBe(state.loading);
  });

  it('should select the tenant error state', () => {
    const result = selectTenantError.projector(state);
    expect(result).toBe(state.error);
  });

  it('should select the toast state', () => {
    const result = selectToast.projector(state);
    expect(result).toBe(state.toast);
  });

  it('should select the list filter sort state', () => {
    const result = selectListFilterSort.projector(state);
    expect(result).toBe(state.listFilterSort);
  });
});
