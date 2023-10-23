import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import {
  UserManagementError,
  CreateUserRequest,
  UserResponse,
  CreateUserRequestDTO,
  UpdateUserRequestDTO,
  UserLifecycleOperations,
  UserLifecycleOperationsDTO,
  UserListResponse,
  UpdateUserRequest,
} from '../../models';

import { IGenericStringObject } from '@ui-coe/shared/bff/types';

@ApiTags('Users Module')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Invalid Request Format', type: UserManagementError })
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: UserManagementError })
@ApiInternalServerErrorResponse({
  description: 'Something has gone wrong.',
  type: UserManagementError,
})
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * @method createUser
   * @description Create a new user
   * @param body CreateUserRequest
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<UserResponse>`
   */
  @Post()
  @ApiBody({
    description: 'Create a new user account',
    type: CreateUserRequest,
  })
  @ApiCreatedResponse({
    description: 'Created user account',
    type: UserResponse,
  })
  @ApiConflictResponse({
    description: 'Conflict - User already exists',
    type: UserManagementError,
  })
  createUser(
    @Body() body: CreateUserRequest,
    @Headers() headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    const dtoBody: CreateUserRequestDTO = new CreateUserRequestDTO(body);

    return this.usersService.createUser(dtoBody, headers);
  }

  /**
   * @methods getUsers
   * @description get list of all users
   * @param orgId string
   * @param headers IGenericStringObject
   * @returns `Observable<UserListResponse | UserManagementError>`
   */
  @Get()
  getUsers(
    @Headers() headers: IGenericStringObject
  ): Observable<UserListResponse | UserManagementError> {
    return this.usersService.getUsers(headers);
  }

  /**
   * @method getUserById
   * @description gets a user by the given userId
   * @param userId string
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  @Get(':userId')
  @ApiOkResponse({
    type: UserResponse,
  })
  getUserById(
    @Param('userId') userId: string,
    @Headers() headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    return this.usersService.getUserById(userId, headers);
  }

  /**
   * @method updateUserById
   * @description partially updates a user with the given ID with the given data
   * @param userId string
   * @param body UpdateUserRequestDTO
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  @Patch(':userId')
  @ApiOkResponse({
    type: UserResponse,
  })
  updateUserById(
    @Param('userId') userId: string,
    @Body() body: UpdateUserRequest,
    @Headers() headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    const dtoBody: UpdateUserRequestDTO = new UpdateUserRequestDTO(body);

    return this.usersService.updateUserById(userId, dtoBody, headers);
  }

  /**
   * @method updateUserLifecycleById
   * @description updates a user's lifecycle state based on the given action to be taken:
   *              one of 'Activate', 'Deactivate', 'ExpirePassword'
   * @param userId string
   * @param body UserLifecycleOperations
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  @Post(':userId/lifecycle-operations')
  @ApiOkResponse({
    type: UserResponse,
  })
  updateUserLifecycleById(
    @Param('userId') userId: string,
    @Body() body: UserLifecycleOperations,
    @Headers() headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    const dtoBody: UserLifecycleOperationsDTO = new UserLifecycleOperationsDTO(body);

    return this.usersService.updateUserLifecycleById(userId, dtoBody, headers);
  }

  /***
   * @method inviteUserById
   * @description Sends the welcome/invitation email. Will sets the user's status to Invited.
   * @param userId string
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  @Post(':userId/invite')
  @ApiOkResponse({
    type: UserResponse,
  })
  inviteUserById(
    @Param('userId') userId: string,
    @Headers() headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    return this.usersService.inviteUserById(userId, headers);
  }
}
