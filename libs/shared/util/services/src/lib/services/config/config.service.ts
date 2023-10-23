import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { setRemoteDefinitions } from '@nx/angular/mf';
import { AuthConfig } from '@ui-coe/shared/util/auth';

@Injectable()
export class ConfigService {
  appConfig: any;

  cmsUrl = '';
  currentAppKey = '';

  constructor(private http: HttpClient) {}

  loadAppConfig(path?: string, appKey?: string): Promise<void> {
    return this.http
      .get(path ? path : '/assets/config/app.config.json')
      .toPromise()
      .then(config => {
        this.currentAppKey = appKey || '';
        this.appConfig = config;
      });
  }

  get(key: string): string {
    return this.appConfig ? this.appConfig[key] : '';
  }
}
