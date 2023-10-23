export interface ITenantEntitlementMapped {
  tenantId: string;
  productEntitlementId: string;
  productEntitlementName: string;
  tenantEntitlementStatus: 'Active' | 'Deactivated';
}
