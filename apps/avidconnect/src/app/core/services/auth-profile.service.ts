import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../assets/config/app.config.model';
import { BaseAPIService } from './base.service';
import { Observable } from 'rxjs';

const RESOURCE_NAME = 'auth';

@Injectable({
  providedIn: 'root',
})
export class AuthProfileService extends BaseAPIService {
  constructor(public http: HttpClient, public appConfig: AppConfig) {
    super(http, appConfig.apiBaseUrl);
  }

  initializeAuth(registrationId: number, profileParam: any): string {
    const { profile } = profileParam;
    return `${this.appConfig.apiBaseUrl}${RESOURCE_NAME}/initialize?registrationId=${registrationId}&profile=${profile}`;
  }

  checkAuth(registrationId: number, profileParam: any): Observable<any> {
    const { profile } = profileParam;
    return this.http.get(
      `${this.appConfig.apiBaseUrl}${RESOURCE_NAME}/check?registrationId=${registrationId}&profile=${profile}`
    );
  }
}
