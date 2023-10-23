import { ApiProperty } from '@nestjs/swagger';
import { ListWrapper } from '../shared';

export interface IBusinessLevel {
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

export interface IBusinessLevelMapped {
  businessLevelId: string;
  erpId: string;
  businessLevelNameSingular: string;
  businessLevelNamePlural: string;
  level: number;
  isActive: boolean;
}

export interface IBusinessLevelMappedWithCount extends IBusinessLevelMapped {
  count: number;
}

export class BusinessLevelMapped implements IBusinessLevelMapped {
  @ApiProperty()
  businessLevelId: string;
  @ApiProperty()
  erpId: string;
  @ApiProperty()
  businessLevelNameSingular: string;
  @ApiProperty()
  businessLevelNamePlural: string;
  @ApiProperty()
  level: number;
  @ApiProperty()
  isActive: boolean;
}

export class BusinessLevelMappedWithCount implements IBusinessLevelMappedWithCount {
  @ApiProperty()
  businessLevelId: string;
  @ApiProperty()
  erpId: string;
  @ApiProperty()
  businessLevelNameSingular: string;
  @ApiProperty()
  businessLevelNamePlural: string;
  @ApiProperty()
  level: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  count: number;
}

export class BusinessLevelMappedList implements ListWrapper<BusinessLevelMapped> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [BusinessLevelMapped] })
  items: BusinessLevelMapped[];
}

export class BusinessLevel implements IBusinessLevel {
  @ApiProperty()
  businessLevelId: string;
  @ApiProperty()
  erpId: string;
  @ApiProperty()
  businessLevelNameSingular: string;
  @ApiProperty()
  businessLevelNamePlural: string;
  @ApiProperty()
  level: number;
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
