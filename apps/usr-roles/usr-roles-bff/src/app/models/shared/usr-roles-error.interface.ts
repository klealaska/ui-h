import { ApiProperty } from '@nestjs/swagger';

export interface IUserRolesError {
  message: string;
  code: string;
  status: number;
  statusText: string;
  data: any;
}

export class UserRolesError implements IUserRolesError {
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
