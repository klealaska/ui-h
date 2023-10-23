import { IBusinessLevel } from './business-level.interface';
import { IERP } from './erp.interface';
import { IOrganizationEntity } from './organization-entity.interface';
import { IOrganization } from './organization.interface';
import { IErpEntity } from './erp-entity.interface';
import { IBusinessName, INamedEntity, IStatusEntity } from './entity.interface';
import { HierarchyType } from '../enums';

export interface IGetTree {
  erpId: string;
  orgId: string;
  entityId?: string;
  selectedNode?: string | number;
}

export interface IActivateTreeNode {
  id: string | number;
}

export interface ITreeMapped {
  businessLevel: IBusinessLevel;
  erp: IErpEntity;
  organization: IOrganizationEntity;
}

export interface ITreeNode extends INamedEntity {
  erpId?: string;
  businessLevelId?: string;
  level?: number;
  type: HierarchyType;
  count?: number;
  status?: string;
  hasNext?: boolean;
  isEntitySelected?: boolean;
  isActive?: boolean;
  parentEntityId?: string;
  parentBusinessLevel?: number;
}

export interface ITreeNodeClickEvent {
  id: string;
  businessLevelId?: string;
  type: HierarchyType;
  level?: number;
  erpId?: string;
  isEntitySelected: boolean;
  name?: IBusinessName;
  entityTypeName?: string;
  parentEntityId?: string;
  parentBusinessLevel?: number;
}
export interface IOrgEditClickEvent {
  id: string;
  type: HierarchyType;
  level?: number;
  erpId?: string;
  ancestorId?: string;
}

export const eventTrackingKey = '[History] Events';
export interface IOrgsErpsTreeMapped {
  organizations: IOrganization[];
  erps: Pick<IERP, 'organizationId' | 'erpId' | 'erpName' | 'erpCode' | 'isActive'>[];
}

export interface IStatusOrgErpEntitiesMapped {
  organizations: IStatusEntity[];
  erps: IStatusEntity[];
}
