import { ApiProperty } from '@nestjs/swagger';

export interface IBusHierError {
  message: string;
  code: string;
  status: number;
  statusText: string;
  data: any;
}

export class BusHierError implements IBusHierError {
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
