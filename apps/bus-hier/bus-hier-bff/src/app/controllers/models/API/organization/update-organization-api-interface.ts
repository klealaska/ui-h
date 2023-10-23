import { ApiPropertyOptional } from '@nestjs/swagger';

export interface IUpdateOrganizationAPI {
  organization_name?: string;
  organization_code?: string;
}

export class UpdateOrganizationDto implements IUpdateOrganizationAPI {
  @ApiPropertyOptional()
  organization_name?: string;
  @ApiPropertyOptional()
  organization_code?: string;
}
