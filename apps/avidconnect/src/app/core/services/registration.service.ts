import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { AvidConnectDataSource, Registration, RegistrationEnablement } from '../../models';
import { BaseAPIService } from './base.service';

const RESOURCE_NAME = 'customers';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService extends BaseAPIService {
  constructor(public http: HttpClient, public appConfig: AppConfig) {
    super(http, appConfig.apiBaseUrl);
  }

  addRegistration(customerId: number, registration: Registration): Observable<number> {
    return this.post<number>(`${RESOURCE_NAME}/${customerId}/registrations`, registration);
  }

  getById(customerId: number, registrationId: number): Observable<Registration> {
    return this.get<Registration>(`${RESOURCE_NAME}/${customerId}/registrations/${registrationId}`);
  }

  getRegistrationsDetail(customerId: number): Observable<AvidConnectDataSource<Registration>> {
    return this.get<AvidConnectDataSource<Registration>>(
      `${RESOURCE_NAME}/${customerId}/registrations/details`
    );
  }

  getEnablements(customerId: number, registrationId: number): Observable<RegistrationEnablement[]> {
    return this.get<RegistrationEnablement[]>(
      `${RESOURCE_NAME}/${customerId}/registrations/${registrationId}/registrationenablements`
    );
  }

  saveEnablements(
    customerId: number,
    registrationId: number,
    registrationEnablements: RegistrationEnablement[]
  ): Observable<null> {
    return this.post<null>(
      `${RESOURCE_NAME}/${customerId}/registrations/${registrationId}/registrationenablements`,
      registrationEnablements
    );
  }

  postMappingFile(
    customerId: number,
    registrationId: number,
    operationTypeId: number,
    file: File
  ): Observable<null> {
    return this.post<null>(
      `${RESOURCE_NAME}/${customerId}/registrations/${registrationId}/registrationenablements/mapping-file`,
      file,
      { operationTypeId }
    );
  }
}
