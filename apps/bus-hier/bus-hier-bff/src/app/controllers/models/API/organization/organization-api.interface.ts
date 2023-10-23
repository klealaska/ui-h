import { ApiProperty } from '@nestjs/swagger';
import { AddressAPI, IAddressAPI } from '../shared';

export interface IOrganizationAPI {
  organization_id: string;
  organization_name: string;
  organization_code: string;
  is_active: string;
  created_timestamp: string;
  created_by_user_id: string;
  last_modified_timestamp: string;
  last_modified_by_user_id: string;
}

export interface IOrganizationAddressAPI extends IAddressAPI {
  organization_id: string;
}

export class OrganizationDto implements IOrganizationAPI {
  @ApiProperty()
  organization_id: string;
  @ApiProperty()
  organization_name: string;
  @ApiProperty()
  organization_code: string;
  @ApiProperty()
  is_active: string;
  @ApiProperty()
  created_timestamp: string;
  @ApiProperty()
  created_by_user_id: string;
  @ApiProperty()
  last_modified_timestamp: string;
  @ApiProperty()
  last_modified_by_user_id: string;
}

export class OrganizationAddressAPI extends AddressAPI implements IOrganizationAddressAPI {
  @ApiProperty()
  organization_id: string;
}
