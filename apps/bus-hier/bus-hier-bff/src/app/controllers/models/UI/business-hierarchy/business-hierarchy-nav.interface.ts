import { ApiProperty } from '@nestjs/swagger';
import { EntityMapped } from '../entity';

/**
 * Interfaces
 */

export interface IBusinessHierarchyBusinessLevelName {
  singular: string;
  plural: string;
}

export interface IBusinessLevelSelectedEntity {
  name: string;
  id: string;
  code: string;
  isActive: boolean;
  parentEntityId: string;
}

export interface IBusinessHierarchyBusinessLevel {
  level: number;
  id: string;
  count: number;
  name: IBusinessHierarchyBusinessLevelName;
  selectedEntity: IBusinessLevelSelectedEntity;
}

export interface IBusinessHierarchyNavBusinessLevel {
  depth: number;
  businessLevels: IBusinessHierarchyBusinessLevel[];
}

export interface IBusinessHierarchyOrgErp {
  count: number;
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface IBusinessHierarchyNav {
  organization: IBusinessHierarchyOrgErp;
  erp: IBusinessHierarchyOrgErp;
  businessLevel: IBusinessHierarchyNavBusinessLevel;
}

export interface IBusinessHierarchyNavData {
  navData: BusinessHierarchyNav;
  entityData: {
    currentSelectedEntity: EntityMapped;
    numberOfCurrentSelectedEntityChildLevels: number;
  };
}

/**
 * Class Implementations
 */

export class BusinessHierarchyBusinessLevelName implements IBusinessHierarchyBusinessLevelName {
  @ApiProperty()
  singular: string;
  @ApiProperty()
  plural: string;
}

export class BusinessLevelSelectedEntity implements IBusinessLevelSelectedEntity {
  @ApiProperty()
  name: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  parentEntityId: string;
}

export class BusinessHierarchyBusinessLevel implements IBusinessHierarchyBusinessLevel {
  @ApiProperty()
  level: number;
  @ApiProperty()
  id: string;
  @ApiProperty()
  count: number;
  @ApiProperty()
  name: BusinessHierarchyBusinessLevelName;
  @ApiProperty()
  selectedEntity: BusinessLevelSelectedEntity;
}

export class BusinessHierarchyNavBusinessLevel implements IBusinessHierarchyNavBusinessLevel {
  @ApiProperty()
  depth: number;
  @ApiProperty({ type: [BusinessHierarchyBusinessLevel] })
  businessLevels: BusinessHierarchyBusinessLevel[];
}

export class BusinessHierarchyOrgErp implements IBusinessHierarchyOrgErp {
  @ApiProperty()
  count: number;
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  isActive: boolean;
}

export class BusinessHierarchyNav implements IBusinessHierarchyNav {
  @ApiProperty()
  organization: BusinessHierarchyOrgErp;
  @ApiProperty()
  erp: BusinessHierarchyOrgErp;
  @ApiProperty()
  businessLevel: BusinessHierarchyNavBusinessLevel;
}
