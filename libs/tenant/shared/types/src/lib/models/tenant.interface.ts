export interface ITenant {
  tenantId: string;
  storageRegion: string;
  tenantType: string;
  tenantStatus: string;
  siteName: string;
  cmpId: string;
  customerName: string;
  partnerName: string;
  sourceSystem: string;
  createdDate: string;
  lastModifiedDate: string;
  createdByUserId: string;
  lastModifiedByUserId: string;
}

export interface ITenantMapped {
  tenantId: string;
  tenantStatus: string;
  siteName: string;
  createdDate: string;
}
