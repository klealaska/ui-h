import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';

import { IGenericStringObject } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { HttpConfigService } from '../../../services/http-config.service';
import {
  UpdateCustomRoleRequestDTO,
  UserRole,
  UserRoleAPI,
  UserRolesError,
  UserRolesList,
  UserRolesListAPI,
} from '../../models';
import { userRolesErrorMapper } from '../../shared';

@Injectable()
export class RolesService {
  constructor(private http: HttpService, private httpConfigService: HttpConfigService) {}

  /**
   * @method getRoles
   * @description gets list of all roles for a tenantId
   * @param headers IGenericStringObject
   * @returns `Observable<UserRolesList | UserRolesError>`
   */
  getRoles(headers: IGenericStringObject): Observable<UserRolesList | UserRolesError> {
    return this.http.get(this.httpConfigService.getUsers(), { headers }).pipe(
      map(response => camelCaseObjectKeys<UserRolesListAPI, UserRolesList>(response.data)),
      catchError(err => {
        throw new HttpException(userRolesErrorMapper(err), err.response?.status);
      })
    );
  }

  /**
   * @method updateCustomRole
   * @description updates one or more properties for the role with the given `roleId`
   * @param roleId string
   * @param body UpdateUserRoledRequestDTO
   * @param headers IGenericStringObject
   * @returns `Observable<UserRoles | UserRolesError>`
   */
  updateCustomRole(
    roleId: string,
    body: UpdateCustomRoleRequestDTO,
    headers: IGenericStringObject
  ): Observable<UserRole | UserRolesError> {
    return this.http.put(this.httpConfigService.updateCustomRole(roleId), body, { headers }).pipe(
      map(response => camelCaseObjectKeys<UserRoleAPI, UserRole>(response.data)),
      catchError(err => {
        throw new HttpException(userRolesErrorMapper(err), err.response?.status);
      })
    );
  }
}
