import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { AvidConnectDataSource, Organization, OrganizationAccountingSystem } from '../../models';
import { BaseAPIService } from './base.service';

const RESOURCE_NAME = 'platformdata';

@Injectable({
  providedIn: 'root',
})
export class PlatformDataService extends BaseAPIService {
  constructor(public http: HttpClient, public appConfig: AppConfig) {
    super(http, appConfig.apiBaseUrl);
  }

  searchOrganizations(params): Observable<AvidConnectDataSource<Organization>> {
    return this.get<AvidConnectDataSource<Organization>>(`${RESOURCE_NAME}/organizations/search`, {
      ...params,
    });
  }

  getOrganizationAccountingSystems(
    params
  ): Observable<AvidConnectDataSource<OrganizationAccountingSystem>> {
    return this.get<AvidConnectDataSource<OrganizationAccountingSystem>>(
      `${RESOURCE_NAME}/accountingsystems`,
      {
        ...params,
      }
    );
  }
}
