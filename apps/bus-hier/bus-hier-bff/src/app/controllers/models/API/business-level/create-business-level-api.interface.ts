import { ApiProperty } from '@nestjs/swagger';
import { ICreateBusinessLevel } from '../../UI';

export interface ICreateBusinessLevelAPI {
  business_level_name_singular: string;
  business_level_name_plural: string;
  source_system: string;
}

export class CreateBusinessLevelDto implements ICreateBusinessLevelAPI {
  @ApiProperty()
  business_level_name_singular: string;
  @ApiProperty()
  business_level_name_plural: string;
  @ApiProperty()
  source_system: string;

  constructor(data: ICreateBusinessLevel) {
    this.business_level_name_singular = data.businessLevelNameSingular;
    this.business_level_name_plural = data.businessLevelNamePlural;
    this.source_system = data.sourceSystem;
  }
}
