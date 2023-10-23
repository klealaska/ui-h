export interface ITenantEntitlementAPI {
  tenant_id: string;
  product_entitlement_id: string;
  product_entitlement_name: string;
  tenant_entitlement_status: 'Active' | 'Deactivated';
  assignment_date: string;
  amount: number;
  assignment_source: string;
  source_system: string;
  created_date: string;
  last_modified_date: string;
  created_by_user_id: string;
  last_modified_by_user_id: string;
}
