import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '../../shared';

export interface IUpdateAddressRequestBody {
  addressCode: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  locality: string;
  region: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  addressType: AddressType;
}

export interface IAddress {
  addressId: string;
  addressCode: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  locality: string;
  region: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  addressType: string;
  isActive: boolean;
  createdTimestamp: string;
  createdByUserId: string;
  lastModifiedTimestamp: string;
  lastModifiedByUserId: string;
}

export class UpdateAddressRequestBody implements IUpdateAddressRequestBody {
  @ApiProperty()
  addressCode: string;
  @ApiProperty()
  addressLine1: string;
  @ApiProperty()
  addressLine2: string;
  @ApiProperty()
  addressLine3: string;
  @ApiProperty()
  addressLine4: string;
  @ApiProperty()
  locality: string;
  @ApiProperty()
  region: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  postalCode: string;
  @ApiProperty()
  isPrimary: boolean;
  @ApiProperty()
  addressType: AddressType;
}

export class Address implements IAddress {
  @ApiProperty()
  addressId: string;
  @ApiProperty()
  addressCode: string;
  @ApiProperty()
  addressLine1: string;
  @ApiProperty()
  addressLine2: string;
  @ApiProperty()
  addressLine3: string;
  @ApiProperty()
  addressLine4: string;
  @ApiProperty()
  locality: string;
  @ApiProperty()
  region: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  postalCode: string;
  @ApiProperty()
  isPrimary: boolean;
  @ApiProperty()
  addressType: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdTimestamp: string;
  @ApiProperty()
  createdByUserId: string;
  @ApiProperty()
  lastModifiedTimestamp: string;
  @ApiProperty()
  lastModifiedByUserId: string;
}
