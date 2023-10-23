import { ApiProperty } from '@nestjs/swagger';

export interface IBusinessHierarchyCount {
  numberOfOrganizations: number;
  numberOfErps: number;
  maximumDepthOfBusinessLevels: number;
  numberOfEntitiesByBusinessLevel: IEntitiesByBusinessLevel[];
}

export interface IEntitiesByBusinessLevel {
  businessLevel: number;
  numberOfEntities: number;
}

export class BusinessHierarchyCount implements IBusinessHierarchyCount {
  @ApiProperty()
  numberOfOrganizations: number;
  @ApiProperty()
  numberOfErps: number;
  @ApiProperty()
  maximumDepthOfBusinessLevels: number;
  @ApiProperty()
  numberOfEntitiesByBusinessLevel: EntitiesByBusinessLevel[];
}

export class EntitiesByBusinessLevel implements IEntitiesByBusinessLevel {
  @ApiProperty()
  businessLevel: number;
  @ApiProperty()
  numberOfEntities: number;
}
