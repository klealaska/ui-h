import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { AvidConnectDataSource, OperationType, Platform } from '../../models';
import { BaseAPIService } from './base.service';

const RESOURCE_NAME = 'platforms';

@Injectable({
  providedIn: 'root',
})
export class PlatformService extends BaseAPIService {
  constructor(public http: HttpClient, public config: AppConfig) {
    super(http, config.apiBaseUrl);
  }

  getAll(params?): Observable<AvidConnectDataSource<Platform>> {
    return this.get<AvidConnectDataSource<Platform>>(RESOURCE_NAME, {
      ...params,
    });
  }

  getById(platformId: number): Observable<Platform> {
    return this.get<Platform>(`${RESOURCE_NAME}/${platformId}`);
  }

  getOperationTypes(platformId: number): Observable<OperationType[]> {
    return this.get<OperationType[]>(`${RESOURCE_NAME}/${platformId}/operationtypes`);
  }
}
