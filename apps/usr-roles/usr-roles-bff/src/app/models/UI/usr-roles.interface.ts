import { ApiProperty } from '@nestjs/swagger';
import { IListWrapper } from '@ui-coe/shared/types';
import { ActorRoleType, RoleStatusType, RoleType } from '../shared';

export interface IUserRole {
  roleId: string;
  roleName: string;
  roleDescription: string;
  roleType: RoleType;
  actorRoleType: ActorRoleType;
  permissions: IUserPermission[];
  status: RoleStatusType;
  createdTimestamp: string;
  createdByActorId: string;
  lastModifiedTimestamp: string;
  lastModifiedByActorId: string;
}

export interface IUserPermission {
  permissionId: string;
  permissionName: string;
  permissionDescription: string;
  createdTimestamp: string;
  createdByActorId: string;
  lastModifiedTimestamp: string;
  lastModifiedByActorId: string;
}

export interface IUpdateCustomRoleRequest {
  roleName: string;
  description: string;
  permissionIds: string[];
}

export class UserPermission implements IUserPermission {
  @ApiProperty()
  permissionId: string;
  @ApiProperty()
  permissionName: string;
  @ApiProperty()
  permissionDescription: string;
  @ApiProperty()
  createdTimestamp: string;
  @ApiProperty()
  createdByActorId: string;
  @ApiProperty()
  lastModifiedTimestamp: string;
  @ApiProperty()
  lastModifiedByActorId: string;
}

export class UserRole implements IUserRole {
  @ApiProperty()
  roleId: string;
  @ApiProperty()
  roleName: string;
  @ApiProperty()
  roleDescription: string;
  @ApiProperty({ enum: ['Custom'] })
  roleType: RoleType;
  @ApiProperty({ enum: ['External'] })
  actorRoleType: ActorRoleType;
  @ApiProperty({ type: [UserPermission] })
  permissions: UserPermission[];
  @ApiProperty({ enum: ['active', 'inactive'] })
  status: RoleStatusType;
  @ApiProperty()
  createdTimestamp: string;
  @ApiProperty()
  createdByActorId: string;
  @ApiProperty()
  lastModifiedTimestamp: string;
  @ApiProperty()
  lastModifiedByActorId: string;
}

export class UserRolesList implements IListWrapper<UserRole> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [UserRole] })
  items: UserRole[];
}

export class UpdateCustomRoleRequest implements IUpdateCustomRoleRequest {
  @ApiProperty()
  roleName: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: [String] })
  permissionIds: string[];
}
