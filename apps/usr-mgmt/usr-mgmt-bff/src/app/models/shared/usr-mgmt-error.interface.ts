import { ApiProperty } from '@nestjs/swagger';

export interface IUserManagementError {
  message: string;
  code: string;
  status: number;
  statusText: string;
  data: any;
}

export class UserManagementError implements IUserManagementError {
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
