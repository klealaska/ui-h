import * as fromEntitlements from './entitlements.reducer';
import {
  selectEntitlementsState,
  selectProductEntitlements,
  selectTenantEntitlements,
} from './entitlements.selectors';

describe('Entitlements Selectors', () => {
  const state: fromEntitlements.EntitlementsState = {
    productEntitlements: [],
    tenantEntitlements: [],
    loading: false,
    error: null,
  };

  it('should select the feature state', () => {
    const result = selectEntitlementsState({
      [fromEntitlements.entitlementsFeatureKey]: {},
    });

    expect(result).toEqual({});
  });

  it('should select the Product Entitlements', () => {
    const result = selectProductEntitlements.projector(state);
    expect(result).toBe(state.productEntitlements);
  });

  it('should select the Tenant Entitlements', () => {
    const result = selectTenantEntitlements.projector(state);
    expect(result).toBe(state.tenantEntitlements);
  });
});
