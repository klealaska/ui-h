import { HierarchyType } from '../enums';
import { IAddress } from './address.interface';

export interface IBusHierItemBase {
  id: string;
}

export interface INamedEntity extends IBusHierItemBase {
  name: string | IBusinessName;
}

export interface IStatusEntity extends INamedEntity {
  isActive: boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
}

export interface IEntity extends IStatusEntity {
  code?: string;
  count?: number;
  status?: string;
  type?: HierarchyType;
  level?: number;
  entityTypeName?: string;
  parentEntityId?: string;
  parentBusinessLevel?: number;
}

export interface IBusinessName {
  singular: string;
  plural: string;
}

export interface IMappedEntitiesResponse {
  items: IMappedEntity[];
}

export interface IMappedEntity {
  businessLevel: number;
  entityCode: string;
  entityId: string;
  entityName: string;
  erpId: string;
  isActive: true;
  parentEntityId: string;
  entityAddresses: IAddress[];
}
