import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';

import { HttpConfigService } from '../../../services/http-config.service';
import {
  UserManagementError,
  CreateUserRequestDTO,
  UserResponse,
  UserResponseAPI,
  UpdateUserRequestDTO,
  UserLifecycleOperationsDTO,
  UserListResponse,
  UserListResponseAPI,
} from '../../models';
import { userManagementErrorMapper } from '../../shared';

import { IGenericStringObject } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

@Injectable()
export class UsersService {
  constructor(private http: HttpService, private httpConfigService: HttpConfigService) {}

  /**
   * @method createUser
   * @description Creates a new user
   * @param body CreateUserRequestDTO
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  createUser(
    body: CreateUserRequestDTO,
    headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    return this.http.post(this.httpConfigService.createUser(), body, { headers }).pipe(
      map(response => camelCaseObjectKeys<UserResponseAPI, UserResponse>(response.data)),
      catchError(err => {
        throw new HttpException(userManagementErrorMapper(err), err.response?.status);
      })
    );
  }

  /**
   * @methods getUsers
   * @description get list of all users
   * @param headers IGenericStringObject
   * @returns `Observable<UserListResponse | UserManagementError>`
   */
  getUsers(headers: IGenericStringObject): Observable<UserListResponse | UserManagementError> {
    return this.http.get(this.httpConfigService.getUsers(), { headers }).pipe(
      map(response => camelCaseObjectKeys<UserListResponseAPI, UserListResponse>(response.data)),
      catchError(err => {
        throw new HttpException(userManagementErrorMapper(err), err.response?.status);
      })
    );
  }

  /**
   * @method getUserById
   * @description Gets a user by id
   * @param id string
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  getUserById(
    id: string,
    headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    return this.http
      .get(this.httpConfigService.getUserById(id), {
        headers,
      })
      .pipe(
        map(response => camelCaseObjectKeys<UserResponseAPI, UserResponse>(response.data)),
        catchError(err => {
          throw new HttpException(userManagementErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method updateUserById
   * @description Updates a user by id
   * @param id string
   * @param body UpdateUserRequestDTO
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  updateUserById(
    id: string,
    body: UpdateUserRequestDTO,
    headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    return this.http
      .patch(this.httpConfigService.updateUserById(id), body, {
        headers,
      })
      .pipe(
        map(response => camelCaseObjectKeys<UserResponseAPI, UserResponse>(response.data)),
        catchError(err => {
          throw new HttpException(userManagementErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method updateUserLifecycleById
   * @description updates a user's lifecycle state based on the given action to be taken:
   *              one of 'Activate', 'Deactivate', 'ExpirePassword'
   * @param userId string
   * @param body UserLifecycleOperationsDTO
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  updateUserLifecycleById(
    userId: string,
    body: UserLifecycleOperationsDTO,
    headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    return this.http
      .post(this.httpConfigService.updateUserLifecycleById(userId, body), body, { headers })
      .pipe(
        map(response => camelCaseObjectKeys<UserResponseAPI, UserResponse>(response.data)),
        catchError(err => {
          throw new HttpException(userManagementErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method inviteUserById
   * @description Sends the welcome/invitation email. Will sets the user's status to Invited.
   * @param userId string
   * @param headers IGenericStringObject
   * @returns `Observable<UserResponse | UserManagementError>`
   */
  inviteUserById(
    userId: string,
    headers: IGenericStringObject
  ): Observable<UserResponse | UserManagementError> {
    return this.http.post(this.httpConfigService.inviteUserById(userId), {}, { headers }).pipe(
      map(response => camelCaseObjectKeys<UserResponseAPI, UserResponse>(response.data)),
      catchError(err => {
        throw new HttpException(userManagementErrorMapper(err), err.response?.status);
      })
    );
  }
}
