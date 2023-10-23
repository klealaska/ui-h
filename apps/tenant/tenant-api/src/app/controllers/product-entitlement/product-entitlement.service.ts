import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';

import { HttpConfigService } from '../../../services/http-config.service';
import { tenantEntitlementMapper, tenantErrorMapper } from '../../shared';
import {
  IProductEntitlement,
  ProductEntitlementMapped,
  ProductEntitlementsList,
  TenantEntitlement,
  TenantEntitlementMapped,
} from '../models';
import {
  AssignTenantEntitlementDto,
  IProductEntitlementAPI,
  ITenantEntitlementAPI,
} from '../models/API/product-entitlement';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { IGenericStringObject, IListWrapperAPI } from '@ui-coe/shared/bff/types';

@Injectable()
export class ProductEntitlementService {
  constructor(private http: HttpService, private httpConfigService: HttpConfigService) {}

  /**
   * @method getProductEntitlements
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<ProductEntitlementsList>`
   */
  getProductEntitlements(
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<ProductEntitlementMapped[]> {
    return this.http
      .get(this.httpConfigService.getProductEntitlements(), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: ProductEntitlementsList = camelCaseObjectKeys<
            IListWrapperAPI<IProductEntitlementAPI>,
            ProductEntitlementsList
          >(response.data);

          const mappedResponse: ProductEntitlementMapped[] = camelCaseResponse.items.map(
            (item: IProductEntitlement) => ({
              id: item.id,
              name: item.name,
              status: item.status,
            })
          );

          return mappedResponse;
        }),
        catchError(err => {
          throw new HttpException(tenantErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method getProductEntitlementsByTenantId
   * @param id string
   * @param headers IGenericStringObject
   * @returns `Observable<TenantEntitlement>`
   */
  getProductEntitlementsByTenantId(
    id: string,
    headers: IGenericStringObject
  ): Observable<TenantEntitlementMapped[]> {
    return this.http
      .get(this.httpConfigService.getProductEntitlementsByTenantId(id), { headers })
      .pipe(
        map(response => {
          const data: ITenantEntitlementAPI[] = response.data || [];
          const camelCaseResponse: TenantEntitlement[] = camelCaseObjectKeys<
            ITenantEntitlementAPI[],
            TenantEntitlement[]
          >(data);

          const tenantEntitlementMapped: TenantEntitlementMapped[] =
            camelCaseResponse.map(tenantEntitlementMapper);

          return tenantEntitlementMapped;
        }),
        catchError(err => {
          throw new HttpException(tenantErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method assignEntitlement
   * @param productEntitlementId string
   * @param tenantId string
   * @param body AssignTenantEntitlementDto
   * @param headers IGenericStringObject
   * @returns `Observable<TenantEntitlement>`
   */
  assignEntitlement(
    productEntitlementId: string,
    tenantId: string,
    body: AssignTenantEntitlementDto,
    headers: IGenericStringObject
  ): Observable<TenantEntitlementMapped> {
    return this.http
      .post(
        this.httpConfigService.postProductEntitlementByTenantId(productEntitlementId, tenantId),
        snakeCaseObjectKeys(body),
        { headers }
      )
      .pipe(
        map(response => {
          const camelCaseResponse: TenantEntitlement = camelCaseObjectKeys<
            ITenantEntitlementAPI,
            TenantEntitlement
          >(response.data);

          const tenantEntitlementMapped: TenantEntitlementMapped =
            tenantEntitlementMapper(camelCaseResponse);

          return tenantEntitlementMapped;
        }),
        catchError(err => {
          throw new HttpException(tenantErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method activateTenantEntitlement
   * @param productEntitlementId string
   * @param tenantId string
   * @param headers IGenericStringObject
   * @returns `Observable<void>`
   */
  activateTenantEntitlement(productEntitlementId, tenantId, headers): Observable<void> {
    return this.http
      .patch(
        this.httpConfigService.activateTenantEntitlement(productEntitlementId, tenantId),
        {},
        {
          headers,
        }
      )
      .pipe(
        map(response => response.data),
        catchError(err => {
          throw new HttpException(tenantErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method deactivateTenantEntitlement
   * @param productEntitlementId string
   * @param tenantId string
   * @param headers IGenericStringObject
   * @returns `Observable<void>`
   */
  deactivateTenantEntitlement(productEntitlementId, tenantId, headers): Observable<void> {
    return this.http
      .patch(
        this.httpConfigService.deactivateTenantEntitlement(productEntitlementId, tenantId),
        {},
        {
          headers,
        }
      )
      .pipe(
        map(response => response.data),
        catchError(err => {
          throw new HttpException(tenantErrorMapper(err), err.response?.status);
        })
      );
  }
}
