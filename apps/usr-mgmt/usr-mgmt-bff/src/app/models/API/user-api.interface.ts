import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { UserLifecycleOperationsType, UserStatusType } from '../shared';
import { UserLifecycleOperations } from '../UI';

export interface IUserBaseAPI {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

export interface IUserResponseAPI extends IUserBaseAPI {
  user_id: string;
  full_name: string;
  user_type: string;
  status: UserStatusType;
  created_timestamp: string;
  created_by_actor_id: string;
  last_modified_timestamp: string;
  last_modified_by_actor_id: string;
}

export interface IUserLifecycleOperationsAPI {
  name: UserLifecycleOperationsType;
}

export class CreateUserRequestDTO implements IUserBaseAPI {
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;

  constructor({
    firstName,
    lastName,
    email,
    username,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  }) {
    this.first_name = firstName;
    this.last_name = lastName;
    this.email = email;
    this.username = username;
  }
}

export class UpdateUserRequestDTO implements Partial<IUserBaseAPI> {
  @ApiPropertyOptional()
  first_name?: string;
  @ApiPropertyOptional()
  last_name?: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  username?: string;

  constructor({
    firstName,
    lastName,
    email,
    username,
  }: {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
  }) {
    this.first_name = firstName;
    this.last_name = lastName;
    this.email = email;
    this.username = username;
  }
}

export class UserResponseAPI implements IUserResponseAPI {
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  user_id: string;
  @ApiProperty()
  full_name: string;
  @ApiProperty()
  user_type: string;
  @ApiProperty({ enum: ['Active', 'Inactive', 'Invited', 'NotInvited'] })
  status: UserStatusType;
  @ApiProperty()
  created_timestamp: string;
  @ApiProperty()
  created_by_actor_id: string;
  @ApiProperty()
  last_modified_timestamp: string;
  @ApiProperty()
  last_modified_by_actor_id: string;
}

export class UserListResponseAPI implements IListWrapperAPI<UserResponseAPI> {
  @ApiProperty()
  items_requested: number;
  @ApiProperty()
  items_returned: number;
  @ApiProperty()
  items_total: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [UserResponseAPI] })
  items: UserResponseAPI[];
}

export class UserLifecycleOperationsDTO implements IUserLifecycleOperationsAPI {
  @ApiProperty({ enum: ['Activate', 'Deactivate', 'ExpirePassword'] })
  name: UserLifecycleOperationsType;

  constructor(body: UserLifecycleOperations) {
    this.name = body.name;
  }
}
