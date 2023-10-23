import { ApiProperty } from '@nestjs/swagger';

// TODO: do we want to map organization to org throughout or keep it organization?
/**
 * Interfaces
 */

export interface IBusinessHierarchyListOrgObject {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  isActive: boolean;
  erps: string[];
}

export interface IBusinessHierarchyListErpObject {
  organizationId: string;
  erpId: string;
  erpName: string;
  erpCode: string;
  isActive: boolean;
}

export interface IBusinessHierarchyList {
  organizations: IBusinessHierarchyListOrgObject[];
  erps: IBusinessHierarchyListErpObject[];
}

/**
 * Class Implementations
 */

export class BusinessHierarchyListOrgObject implements IBusinessHierarchyListOrgObject {
  @ApiProperty()
  organizationId: string;
  @ApiProperty()
  organizationName: string;
  @ApiProperty()
  organizationCode: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  erps: string[];
}

export class BusinessHierarchyListErpObject implements IBusinessHierarchyListErpObject {
  @ApiProperty()
  organizationId: string;
  @ApiProperty()
  erpId: string;
  @ApiProperty()
  erpName: string;
  @ApiProperty()
  erpCode: string;
  @ApiProperty()
  isActive: boolean;
}

export class BusinessHierarchyList implements IBusinessHierarchyList {
  @ApiProperty({ type: [BusinessHierarchyListOrgObject] })
  organizations: BusinessHierarchyListOrgObject[];
  @ApiProperty({ type: [BusinessHierarchyListErpObject] })
  erps: BusinessHierarchyListErpObject[];
}
