import { ApiProperty } from '@nestjs/swagger';

export interface ICreateTenantAPI {
  site_name: string;
  storage_region: string;
  tenant_type: string;
  owner_type: string;
  cmp_id: string;
  partner_name: string;
  source_system: string;
}

export class CreateTenantDto implements ICreateTenantAPI {
  @ApiProperty()
  site_name: string;
  @ApiProperty()
  storage_region: string;
  @ApiProperty()
  tenant_type: string;
  @ApiProperty()
  owner_type: string;
  @ApiProperty()
  cmp_id: string;
  @ApiProperty()
  partner_name: string;
  @ApiProperty()
  source_system: string;
}
