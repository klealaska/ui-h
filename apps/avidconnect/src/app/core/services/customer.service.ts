import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import {
  AvidConnectDataSource,
  Customer,
  GroupSettings,
  OnPremAgent,
  OnPremAgentItem,
  Registration,
  SchemaSettingsValue,
} from '../../models';
import { BaseAPIService } from './base.service';

const RESOURCE_NAME = 'customers';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseAPIService {
  constructor(public http: HttpClient, public appConfig: AppConfig) {
    super(http, appConfig.apiBaseUrl);
  }

  getCustomerWithToken(): Observable<Customer> {
    return this.get(`${RESOURCE_NAME}/token`);
  }

  getAll(params): Observable<AvidConnectDataSource<Customer>> {
    return this.get<AvidConnectDataSource<Customer>>(RESOURCE_NAME, {
      ...params,
    });
  }

  getById(customerId: number): Observable<Customer> {
    return this.get<Customer>(`${RESOURCE_NAME}/${customerId}`);
  }

  addCustomer(customer: Customer): Observable<number> {
    return this.post<number>(RESOURCE_NAME, customer);
  }

  getSettings(customerId: number): Observable<SchemaSettingsValue> {
    return this.get<SchemaSettingsValue>(`${RESOURCE_NAME}/${customerId}/settings`);
  }

  getRegistrationSettings(
    customerId: number,
    registrationId: number
  ): Observable<SchemaSettingsValue[]> {
    return this.get<SchemaSettingsValue[]>(
      `${RESOURCE_NAME}/${customerId}/registrations/${registrationId}/settings`
    );
  }

  saveRegistrationSettings(
    customerId: number,
    registrationId: number,
    settings: GroupSettings[]
  ): Observable<null> {
    return this.post<null>(
      `${RESOURCE_NAME}/${customerId}/registrations/${registrationId}/settings`,
      settings
    );
  }

  saveSettings(customerId: number, settings: GroupSettings[]): Observable<null> {
    return this.post<null>(`${RESOURCE_NAME}/${customerId}/settings`, settings);
  }

  getAgentList(customerId: number): Observable<OnPremAgent> {
    return this.get<OnPremAgent>(`${RESOURCE_NAME}/${customerId}/agents`);
  }

  activateAgent(customerId: number, userCode: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const theBody = new HttpParams().set('user_code', userCode);
    return this.post(
      `${RESOURCE_NAME}/${customerId}/agents/activate`,
      theBody.toString(),
      undefined,
      undefined,
      headers
    );
  }

  deactivateAgent(agentId: number, customerId: number): Observable<any> {
    return this.delete(`${RESOURCE_NAME}/${customerId}/agents/${agentId}`);
  }

  agentRegistration(
    customerId: number,
    registrationId: number,
    agent: OnPremAgentItem,
    registration: Registration
  ): Observable<any> {
    const body = {
      ConnectorHostModelTypeId: agent.customerId !== null ? 2 : 1,
      Topic: agent.topic,
      Subscription: agent.subscription,
      IsActive: registration.isActive,
      Description: registration.description,
      ExternalKey: registration.externalKey,
      AgentSID: agent.agentSID,
    };
    return this.post<any>(`${RESOURCE_NAME}/${customerId}/registrations/${registrationId}`, body);
  }
}
