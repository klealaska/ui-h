import { IBusinessLevelEntity } from './business-level-entity.interface';

export interface IBusinessLevel {
  depth: number;
  businessLevels: IBusinessLevelEntity[];
}

export interface IEditBusinessLevelName {
  businessLevelId: string;
  body: {
    businessLevelNameSingular: string;
    businessLevelNamePlural: string;
  };
  orgId?: string;
  erpId?: string;
  selectedNode?: string | number;
  entityId?: string;
}

export interface IBusinessLevelDetails {
  businessLevelId: string;
  erpId: string;
  businessLevelNameSingular: string;
  businessLevelNamePlural: string;
  level: number;
  isActive: boolean;
  createdTimestamp: string;
  createdByUserId: string;
  lastModifiedTimestamp: string;
  lastModifiedByUserId: string;
}
