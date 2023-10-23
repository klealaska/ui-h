import { ApiProperty } from '@nestjs/swagger';
import { IUpdateBusinessLevel } from '../../UI';

export interface IUpdateBusinessLevelAPI {
  business_level_name_singular: string;
  business_level_name_plural: string;
}

export class UpdateBusinessLevelDto implements IUpdateBusinessLevelAPI {
  @ApiProperty()
  business_level_name_singular: string;
  @ApiProperty()
  business_level_name_plural: string;

  constructor(data: IUpdateBusinessLevel) {
    this.business_level_name_singular = data.businessLevelNameSingular;
    this.business_level_name_plural = data.businessLevelNamePlural;
  }
}
