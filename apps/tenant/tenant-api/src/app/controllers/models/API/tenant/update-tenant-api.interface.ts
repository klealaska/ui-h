import { ApiPropertyOptional } from '@nestjs/swagger';

export interface IUpdateTenantAPI {
  site_name?: string;
}

export class UpdateTenantDto implements IUpdateTenantAPI {
  @ApiPropertyOptional()
  site_name?: string;
}
