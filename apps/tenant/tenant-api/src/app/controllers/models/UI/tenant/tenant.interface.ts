import { ApiProperty } from '@nestjs/swagger';

export interface ITenant {
  tenantId: string;
  siteName: string;
  storageRegion: string;
  tenantStatus: string;
  tenantType: string;
  ownerType: string;
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
  siteName: string;
  createdDate: string;
  tenantStatus: string;
}

export class TenantMapped implements ITenantMapped {
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  siteName: string;
  @ApiProperty()
  createdDate: string;
  @ApiProperty()
  tenantStatus: string;
}

export class Tenant implements ITenant {
  @ApiProperty()
  source_system: string;
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  siteName: string;
  @ApiProperty()
  storageRegion: string;
  @ApiProperty()
  tenantStatus: string;
  @ApiProperty()
  tenantType: string;
  @ApiProperty()
  ownerType: string;
  @ApiProperty()
  cmpId: string;
  @ApiProperty()
  customerName: string;
  @ApiProperty()
  partnerName: string;
  @ApiProperty()
  sourceSystem: string;
  @ApiProperty()
  createdDate: string;
  @ApiProperty()
  lastModifiedDate: string;
  @ApiProperty()
  createdByUserId: string;
  @ApiProperty()
  lastModifiedByUserId: string;
}
