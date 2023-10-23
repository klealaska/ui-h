import { ApiProperty } from '@nestjs/swagger';

export interface ITenantError {
  message: string;
  code: string;
  status: number;
  statusText: string;
  data: any;
}

export class TenantError implements ITenantError {
  @ApiProperty()
  message: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  status: number;
  @ApiProperty()
  statusText: string;
  @ApiProperty()
  data: any;
}
