import { TenantEntitlement, TenantEntitlementMapped } from '../../controllers';

export function tenantEntitlementMapper(
  tenantEntitlement: TenantEntitlement
): TenantEntitlementMapped {
  return {
    tenantId: tenantEntitlement.tenantId,
    productEntitlementId: tenantEntitlement.productEntitlementId,
    productEntitlementName: tenantEntitlement.productEntitlementName,
    tenantEntitlementStatus: tenantEntitlement.tenantEntitlementStatus,
  };
}
