export interface IEntitlement {
  tenantId: string;
  productEntitlementId: string;
  productEntitlementName: string;
  tenantEntitlementStatus: string;
  assignmentDate: string;
  amount: number;
  assignmentSource: string;
  sourceSystem: string;
  createdDate: string;
  lastModifiedDate: string;
  createdByUserId: string;
  lastModifiedByUserId: string;
}
