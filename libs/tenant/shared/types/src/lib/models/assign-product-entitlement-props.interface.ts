import { IAssignProductEntitlementToTenant } from './assign-product-entitlement.interface';

export interface IAssignProductEntitlementProps {
  productId: string;
  tenantId: string;
  reqBody: IAssignProductEntitlementToTenant;
}
