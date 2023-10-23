import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserLifecycleOperationsType, UserStatusType } from '../shared';
import { IListWrapper } from '@ui-coe/shared/types';

export interface IUserBase {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface IUserResponse extends IUserBase {
  userId: string;
  fullName: string;
  userType: string;
  status: UserStatusType;
  createdTimestamp: string;
  createdByActorId: string;
  lastModifiedTimestamp: string;
  lastModifiedByActorId: string;
}

export interface IUserLifecycleOperations {
  name: UserLifecycleOperationsType;
}

export class CreateUserRequest implements IUserBase {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
}

export class UpdateUserRequest implements Partial<IUserBase> {
  @ApiPropertyOptional()
  firstName?: string;
  @ApiPropertyOptional()
  lastName?: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  username?: string;
}

export class UserResponse implements IUserResponse {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  userType: string;
  @ApiProperty({ enum: ['Active', 'Inactive', 'Invited', 'NotInvited'] })
  status: UserStatusType;
  @ApiProperty()
  createdTimestamp: string;
  @ApiProperty()
  createdByActorId: string;
  @ApiProperty()
  lastModifiedTimestamp: string;
  @ApiProperty()
  lastModifiedByActorId: string;
}

export class UserListResponse implements IListWrapper<UserResponse> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [UserResponse] })
  items: UserResponse[];
}

export class UserLifecycleOperations implements IUserLifecycleOperations {
  @ApiProperty({ enum: ['Activate', 'Deactivate', 'ExpirePassword'] })
  name: UserLifecycleOperationsType;
}
