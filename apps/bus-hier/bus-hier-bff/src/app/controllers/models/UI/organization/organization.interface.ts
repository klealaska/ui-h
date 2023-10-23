import { ApiProperty } from '@nestjs/swagger';
import { Address, IAddress, ListWrapper } from '../shared';

export interface IOrganizationAddress extends IAddress {
  organizationId: string;
}

export interface IOrganization {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  organizationAddresses: OrganizationAddress[];
  isActive: boolean;
  createdTimestamp: string;
  createdByUserId: string;
  lastModifiedTimestamp: string;
  lastModifiedByUserId: string;
}

/**
 * create a new type like this but without the orgCode
 */
export interface IOrganizationMapped {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  isActive: boolean;
}

export class OrganizationAddress extends Address implements IOrganizationAddress {
  @ApiProperty()
  organizationId: string;
}

export class Organization implements IOrganization {
  @ApiProperty()
  organizationId: string;
  @ApiProperty()
  organizationName: string;
  @ApiProperty()
  organizationCode: string;
  @ApiProperty({ type: [OrganizationAddress] })
  organizationAddresses: OrganizationAddress[];
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

export class OrganizationMapped implements IOrganizationMapped {
  @ApiProperty()
  organizationId: string;
  @ApiProperty()
  organizationName: string;
  @ApiProperty()
  organizationCode: string;
  @ApiProperty()
  isActive: boolean;
}

export class OrganizationList implements ListWrapper<OrganizationMapped> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [OrganizationMapped] })
  items: OrganizationMapped[];
}
