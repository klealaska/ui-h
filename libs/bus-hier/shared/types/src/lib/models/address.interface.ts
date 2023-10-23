import { AddressType, HierarchyType } from '../enums';

export interface IAddress {
  addressId: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  addressCode: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
  isActive: boolean;
  addressType: string;
}

export interface IDeactiveActivateAddressEvent {
  id: string;
  addressId: string;
  hierarchyType: HierarchyType;
  type: AddressType;
}

export interface IEditAddressEvent {
  id: string;
  address: IAddress;
  type: HierarchyType;
  addressType: AddressType;
}

export interface IMappedOrganizationAddress extends IAddress {
  organizationId: string;
}

export interface IMappedEntityAddress extends IAddress {
  entityId: string;
}
