import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ConfigService } from '@ui-coe/shared/util/services';
import {
  IGetProductEntitlementsParams,
  IEntitlementsService,
  IProductEntitlementMapped,
  ITenantEntitlementMapped,
  IAssignProductEntitlementToTenant,
} from '@ui-coe/tenant/shared/types';

@Injectable({
  providedIn: 'root',
})
export class EntitlementsService implements IEntitlementsService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}

  private readonly _tenantApiBaseUrl = `${this.configService.get(
    'tenantApiBaseUrl'
  )}/product-entitlement`;

  public getEntitlementsData(
    entitlementsParams?: IGetProductEntitlementsParams
  ): Observable<IProductEntitlementMapped[]> {
    let params: HttpParams = new HttpParams();

    if (entitlementsParams) {
      entitlementsParams.name && (params = params.set('name', entitlementsParams.name));
      entitlementsParams.status && (params = params.set('status', entitlementsParams.status));
      entitlementsParams.sortBy && (params = params.set('sortBy', entitlementsParams.sortBy));
      entitlementsParams.offset && (params = params.set('offset', entitlementsParams.offset));
    }
    params = params.set('limit', entitlementsParams?.limit || 100);

    return this.httpClient.get<IProductEntitlementMapped[]>(this._tenantApiBaseUrl, {
      params,
    });
  }

  public getEntitlementsByTenantId(id: string): Observable<ITenantEntitlementMapped[]> {
    return this.httpClient.get<ITenantEntitlementMapped[]>(
      `${this._tenantApiBaseUrl}/tenants/${id}`
    );
  }

  public assignProductEntitlement(
    productEntitlementId: string,
    tenantId: string,
    body: IAssignProductEntitlementToTenant
  ): Observable<ITenantEntitlementMapped> {
    return this.httpClient.post<ITenantEntitlementMapped>(
      `${this._tenantApiBaseUrl}/${productEntitlementId}/tenants/${tenantId}`,
      body
    );
  }
}
