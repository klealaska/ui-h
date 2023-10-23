import { AddressType, HierarchyType } from '../enums';
import { IAddress } from './address.interface';

export interface IDetails {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  type: HierarchyType;
  level?: number;
  entityTypeName?: string;
  orgId?: string;
  erpId?: string;
  shipToAddresses?: IAddress[];
  billToAddresses?: IAddress[];
}

export interface IGetDetails {
  orgId?: string;
  erpId?: string;
  id?: string;
  level?: number;
  hierarchyType?: HierarchyType;
  entityTypeName?: string;
}
export interface IActivateOrDeactivateAddress {
  id: string;
  addressId: string;
  hierarchyType: HierarchyType;
  addressType: AddressType;
}
export interface IActivateOrDeactivateItem {
  id: string;
  name: string;
  hierarchyType: HierarchyType;
}

export interface IGetEntities {
  level: number;
  erpId: string;
  entityName?: string;
  parentEntityId?: string;
}

export interface IEditEntity {
  id: string;
  body: IEditEntityBody;
  type: HierarchyType;
  orgId?: string;
  erpId?: string;
  level?: number;
}

export interface IEditEntityBody {
  name: string;
  code: string;
}

export interface IEditAddress {
  // this id can be of Organization Id or Entity Id since both have editable addresses
  id: string;
  hierarchyType: HierarchyType;
  address: IAddress;
  addressType: AddressType;
}
