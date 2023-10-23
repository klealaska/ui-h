import { ApiProperty } from '@nestjs/swagger';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { ActorRoleType, RoleStatusType, RoleType } from '../shared';

export interface IUserRoleMetadata {
  created_timestamp: string;
  created_by_actor_id: string;
  last_modified_timestamp: string;
  last_modified_by_actor_id: string;
}

export interface IUserRoleAPI extends IUserRoleMetadata {
  role_id: string;
  role_name: string;
  role_description: string;
  role_type: RoleType;
  actor_role_type: ActorRoleType;
  permissions: IUserPermissionAPI[];
  status: RoleStatusType;
}

export interface IUserPermissionAPI extends IUserRoleMetadata {
  permission_id: string;
  permission_name: string;
  permission_description: string;
}

export interface IUpdateCustomRoleRequestAPI {
  role_name: string;
  description: string;
  permission_ids: string[];
}

export class UserPermissionAPI implements IUserPermissionAPI {
  permission_id: string;
  permission_name: string;
  permission_description: string;
  created_timestamp: string;
  created_by_actor_id: string;
  last_modified_timestamp: string;
  last_modified_by_actor_id: string;
}

export class UserRoleAPI implements IUserRoleAPI {
  @ApiProperty()
  role_id: string;
  @ApiProperty()
  role_name: string;
  @ApiProperty()
  role_description: string;
  @ApiProperty({ enum: ['Custom'] })
  role_type: RoleType;
  @ApiProperty({ enum: ['External'] })
  actor_role_type: ActorRoleType;
  @ApiProperty({ type: [UserPermissionAPI] })
  permissions: UserPermissionAPI[];
  @ApiProperty({ enum: ['active', 'inactive'] })
  status: RoleStatusType;
  @ApiProperty()
  created_timestamp: string;
  @ApiProperty()
  created_by_actor_id: string;
  @ApiProperty()
  last_modified_timestamp: string;
  @ApiProperty()
  last_modified_by_actor_id: string;
}

export class UserRolesListAPI implements IListWrapperAPI<UserRoleAPI> {
  @ApiProperty()
  items_requested: number;
  @ApiProperty()
  items_returned: number;
  @ApiProperty()
  items_total: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [UserRoleAPI] })
  items: UserRoleAPI[];
}

export class UpdateCustomRoleRequestDTO implements IUpdateCustomRoleRequestAPI {
  @ApiProperty()
  role_name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: [String] })
  permission_ids: string[];

  constructor({
    roleName,
    description,
    permissionIds,
  }: {
    roleName: string;
    description: string;
    permissionIds: string[];
  }) {
    this.role_name = roleName;
    this.description = description;
    this.permission_ids = permissionIds;
  }
}
