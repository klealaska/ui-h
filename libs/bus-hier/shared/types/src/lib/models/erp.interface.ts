export interface IERP {
  organizationId: string;
  erpId: string;
  erpName: string;
  erpCode: string;
  companyDatabaseName: string;
  companyDatabaseId: string;
  isCrossCompanyCodingAllowed: string;
  isActive: boolean;
  purchaseOrderPrefix: string;
  startingPurchaseOrderNumber: string;
  createdTimestamp: string;
  createdByUserId: string;
  lastModifiedTimestamp: string;
  lastModifiedByUserId: string;
}
