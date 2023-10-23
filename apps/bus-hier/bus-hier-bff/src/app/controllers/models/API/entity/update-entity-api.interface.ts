import { ApiPropertyOptional } from '@nestjs/swagger';

export interface IUpdateEntityAPI {
  entity_name?: string;
  entity_code?: string;
}

export class UpdateEntityDTO implements IUpdateEntityAPI {
  @ApiPropertyOptional()
  entity_name?: string;
  @ApiPropertyOptional()
  entity_code?: string;
}
