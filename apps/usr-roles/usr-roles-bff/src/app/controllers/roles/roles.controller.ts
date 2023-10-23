import { Body, Controller, Get, Headers, Param, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { IGenericStringObject } from '@ui-coe/shared/bff/types';

import {
  UserRolesList,
  UserRolesError,
  UpdateCustomRoleRequest,
  UpdateCustomRoleRequestDTO,
  UserRole,
} from '../../models';
import { RolesService } from './roles.service';

@ApiTags('Roles Module')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Invalid Request Format', type: UserRolesError })
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: UserRolesError })
@ApiInternalServerErrorResponse({
  description: 'Something has gone wrong.',
  type: UserRolesError,
})
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  /**
   * @method getRoles
   * @description gets all roles for a tenantId
   * @param headers IGenericStringObject
   * @returns `Observable<UserRolesList | UserRolesError>`
   */
  @ApiOkResponse({
    type: UserRolesList,
  })
  @Get()
  getRoles(@Headers() headers: IGenericStringObject): Observable<UserRolesList | UserRolesError> {
    return this.rolesService.getRoles(headers);
  }

  /**
   * @method updateCustomRole
   * @description updates one or more properties for the role with the given `roleId`
   * @param roleId string
   * @param body UpdateCustomRoleRequest
   * @param headers IGenericStringObject
   * @returns `Observable<UserRoles | UserRolesError>`
   */
  @ApiOkResponse({
    type: UserRole,
  })
  @Put(':roleId')
  updateCustomRole(
    @Param('roleId') roleId: string,
    @Body() body: UpdateCustomRoleRequest,
    @Headers() headers: IGenericStringObject
  ): Observable<UserRole | UserRolesError> {
    const dtoBody = new UpdateCustomRoleRequestDTO(body);

    return this.rolesService.updateCustomRole(roleId, dtoBody, headers);
  }
}
