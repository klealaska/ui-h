import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpConfigService } from '../../../services/http-config.service';
import { tenantErrorMapper } from '../../shared';
import {
  CreateTenantDto,
  ITenant,
  ITenantMapped,
  ITenantAPI,
  Tenant,
  TenantError,
  TenantMapped,
  UpdateTenantDto,
  IListWrapper,
} from '../models';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';

@Injectable()
export class TenantService {
  constructor(private http: HttpService, private httpConfigService: HttpConfigService) {}

  getTenants(
    headers: { [key: string]: string },
    query: { [key: string]: string }
  ): Observable<IListWrapper<TenantMapped>> {
    return this.http
      .get(this.httpConfigService.getTenant(), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: IListWrapper<ITenant> = camelCaseObjectKeys<
            IListWrapperAPI<ITenantAPI>,
            IListWrapper<ITenant>
          >(response.data);

          const items: ITenantMapped[] = camelCaseResponse.items.map((item: ITenant) => ({
            tenantId: item.tenantId,
            siteName: item.siteName,
            createdDate: item.createdDate,
            tenantStatus: item.tenantStatus,
          }));
          // TODO remove this once sitename issue resolved
          console.log('get all tenants', items);
          return {
            ...camelCaseResponse,
            items,
          };
        }),
        catchError(err => {
          throw new HttpException(tenantErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method getTenantById
   * @param {string} id string representing the tenantId
   * @returns {Observable<Tenant>}
   */
  getTenantById(id: string, headers: { [key: string]: string }): Observable<Tenant | TenantError> {
    return this.http.get(this.httpConfigService.getTenantById(id), { headers }).pipe(
      map(response => camelCaseObjectKeys<ITenantAPI, Tenant>(response.data)),
      catchError(err => {
        throw new HttpException(tenantErrorMapper(err), err.response?.status);
      })
    );
  }

  /**
   * @method createTenant
   * @param {Object} headers
   * @param {CreateTenantDto} body CreateTenantDto
   * @returns {Observable<TenantInterface>}
   */
  createTenant(
    headers: { [key: string]: string },
    body: CreateTenantDto
  ): Observable<Tenant | TenantError> {
    return this.http
      .post(this.httpConfigService.postTenant(), snakeCaseObjectKeys(body), {
        headers,
      })
      .pipe(
        map(data => camelCaseObjectKeys<ITenantAPI, Tenant>(data.data)),
        catchError(err => {
          throw new HttpException(tenantErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method updateTenant
   * @param {Object} headers
   * @param {UpdateTenantDto} body UpdateTenantDto
   * @returns {Observable<TenantInterface>}
   */
  updateTenant(
    id: string,
    headers: { [key: string]: string },
    body: UpdateTenantDto
  ): Observable<Tenant | TenantError> {
    return this.http
      .put(this.httpConfigService.updateTenant(id), snakeCaseObjectKeys(body), {
        headers,
      })
      .pipe(
        map(data => camelCaseObjectKeys<ITenantAPI, Tenant>(data.data)),
        catchError(err => {
          throw new HttpException(tenantErrorMapper(err), err.response?.status);
        })
      );
  }
}
