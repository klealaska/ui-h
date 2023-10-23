import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from '@ui-coe/shared/util/services';
import {
  ICreateTenant,
  IGetTenant,
  IGetTenantParams,
  ITenant,
  ITenantMapped,
  ITenantService,
  IUpdateTenant,
} from '@ui-coe/tenant/shared/types';

@Injectable({
  providedIn: 'root',
})
export class TenantService implements ITenantService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}

  private readonly _tenantApiBaseUrl = `${this.configService.get('tenantApiBaseUrl')}/tenants`;

  public getTenantData(tenantParams?: IGetTenantParams): Observable<IGetTenant<ITenantMapped>> {
    let params: HttpParams = new HttpParams();
    if (tenantParams) {
      tenantParams.siteName && (params = params.set('siteName', tenantParams.siteName));
      tenantParams.dateCreated && (params = params.set('dateCreated', tenantParams.dateCreated));
      tenantParams.status && (params = params.set('status', tenantParams.status));
      tenantParams.sortBy && (params = params.set('sortBy', tenantParams.sortBy));
    }
    params = params.set('limit', tenantParams?.limit || 100);
    return this.httpClient.get<IGetTenant<ITenantMapped>>(this._tenantApiBaseUrl, { params });
  }

  public getTenantById(id: string): Observable<ITenant> {
    return this.httpClient.get<ITenant>(`${this._tenantApiBaseUrl}/${id}`);
  }

  public postTenantData(body: ICreateTenant): Observable<ITenant> {
    return this.httpClient.post<ITenant>(this._tenantApiBaseUrl, body);
  }

  public updateTenant(id: string, body: IUpdateTenant): Observable<ITenant> {
    return this.httpClient.put<ITenant>(`${this._tenantApiBaseUrl}/${id}`, body);
  }
}
