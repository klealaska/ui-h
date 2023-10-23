import { ApiProperty } from '@nestjs/swagger';

export interface IBusinessHierarchyCountAPI {
  number_of_organizations: number;
  number_of_erps: number;
  maximum_depth_of_business_levels: number;
  number_of_entities_by_business_level: IEntitiesByBusinessLevelAPI[];
}

export interface IEntitiesByBusinessLevelAPI {
  business_level: number;
  number_of_entities: number;
}

export class BusinessHierarchyCountDto implements IBusinessHierarchyCountAPI {
  @ApiProperty()
  number_of_organizations: number;
  @ApiProperty()
  number_of_erps: number;
  @ApiProperty()
  maximum_depth_of_business_levels: number;
  @ApiProperty()
  number_of_entities_by_business_level: IEntitiesByBusinessLevelAPI[];
}
