import { ApiProperty } from '@nestjs/swagger';

export interface ICreateOrganizationAPI {
  organization_name: string;
  organization_code: string;
  source_system: string;
}

export class CreateOrganizationDto implements ICreateOrganizationAPI {
  @ApiProperty()
  organization_name: string;
  @ApiProperty()
  organization_code: string;
  @ApiProperty()
  source_system: string;
}
