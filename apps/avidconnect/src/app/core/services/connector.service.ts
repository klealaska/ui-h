import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../assets/config/app.config.model';
import { Observable } from 'rxjs';
import {
  AvidConnectDataSource,
  Connector,
  ConnectorSummary,
  Customer,
  JsonSchema,
  Operation,
  OperationType,
} from '../../models';
import { BaseAPIService } from './base.service';

const RESOURCE_NAME = 'connectors';

@Injectable({
  providedIn: 'root',
})
export class ConnectorService extends BaseAPIService {
  constructor(public http: HttpClient, public config: AppConfig) {
    super(http, config.apiBaseUrl);
  }

  getAll(params): Observable<AvidConnectDataSource<Connector>> {
    return this.get<AvidConnectDataSource<Connector>>(RESOURCE_NAME, {
      ...params,
    });
  }

  getById(connectorId: number): Observable<Connector> {
    return this.get<Connector>(`${RESOURCE_NAME}/${connectorId}`);
  }

  search(payload, params): Observable<AvidConnectDataSource<Connector>> {
    return this.post<AvidConnectDataSource<Connector>>(`${RESOURCE_NAME}/search`, payload, params);
  }

  getSummaryList(params): Observable<ConnectorSummary[]> {
    return this.get<ConnectorSummary[]>(`${RESOURCE_NAME}/summarylist`, {
      ...params,
    });
  }

  getLogo(logoUrl: number): Observable<any> {
    return this.getBlob<string>(`${RESOURCE_NAME}/${logoUrl}/logo`);
  }

  getConnectorSettings(connectorId: number, params?): Observable<JsonSchema> {
    return this.get<JsonSchema>(`${RESOURCE_NAME}/${connectorId}/settings-schema`, params);
  }

  getOperationTypes(connectorId: number): Observable<OperationType[]> {
    return this.get<OperationType[]>(`${RESOURCE_NAME}/${connectorId}/operationtypes`);
  }

  getOperations(connectorId: number, params): Observable<AvidConnectDataSource<Operation>> {
    return this.get<AvidConnectDataSource<Operation>>(
      `${RESOURCE_NAME}/${connectorId}/operations`,
      {
        ...params,
      }
    );
  }

  getCustomers(connectorId: number, params?): Observable<AvidConnectDataSource<Customer>> {
    return this.get<AvidConnectDataSource<Customer>>(
      `${RESOURCE_NAME}/${connectorId}/customers`,
      params
    );
  }
}
