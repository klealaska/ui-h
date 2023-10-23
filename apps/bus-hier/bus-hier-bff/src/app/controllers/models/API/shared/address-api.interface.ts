import { ApiProperty } from '@nestjs/swagger';
import { IUpdateAddressRequestBody } from '../../UI';
import { AddressType } from '../../shared';

export interface IUpdateAddressRequestBodyAPI {
  address_code: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  address_line4: string;
  locality: string;
  region: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
  address_type: AddressType;
}

export interface IAddressAPI {
  address_id: string;
  address_code: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  address_line4: string;
  locality: string;
  region: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
  address_type: AddressType;
  is_active: boolean;
  created_timestamp: string;
  created_by_user_id: string;
  last_modified_timestamp: string;
  last_modified_by_user_id: string;
}

export class UpdateAddressDto implements IUpdateAddressRequestBodyAPI {
  @ApiProperty()
  address_code: string;
  @ApiProperty()
  address_line1: string;
  @ApiProperty()
  address_line2: string;
  @ApiProperty()
  address_line3: string;
  @ApiProperty()
  address_line4: string;
  @ApiProperty()
  locality: string;
  @ApiProperty()
  region: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  postal_code: string;
  @ApiProperty()
  is_primary: boolean;
  @ApiProperty()
  address_type: AddressType;

  constructor(address: IUpdateAddressRequestBody) {
    this.address_code = address.addressCode;
    this.address_line1 = address.addressLine1;
    this.address_line2 = address.addressLine2;
    this.address_line3 = address.addressLine3;
    this.address_line4 = address.addressLine4;
    this.locality = address.locality;
    this.region = address.region;
    this.country = address.country;
    this.postal_code = address.postalCode;
    this.is_primary = address.isPrimary;
    this.address_type = address.addressType as AddressType;
  }
}

export class AddressAPI implements IAddressAPI {
  address_id: string;
  address_code: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  address_line4: string;
  locality: string;
  region: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
  address_type: AddressType;
  is_active: boolean;
  created_timestamp: string;
  created_by_user_id: string;
  last_modified_timestamp: string;
  last_modified_by_user_id: string;
}
