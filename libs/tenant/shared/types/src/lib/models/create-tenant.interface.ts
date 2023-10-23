export interface ICreateTenant {
  siteName: string;
  storageRegion: string;
  tenantType: string;
  cmpId: string;
  ownerType: string;
  sourceSystem: string;
  partnerName?: string;
}
