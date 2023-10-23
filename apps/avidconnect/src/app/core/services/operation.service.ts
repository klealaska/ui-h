import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { AvidConnectDataSource, Operation, OperationDetail } from '../../models';
import { BaseAPIService } from './base.service';

const RESOURCE_NAME = 'customers';

@Injectable({
  providedIn: 'root',
})
export class OperationService extends BaseAPIService {
  constructor(public http: HttpClient, public config: AppConfig) {
    super(http, config.apiBaseUrl);
  }

  getByCustomer(customerId: number, params): Observable<AvidConnectDataSource<Operation>> {
    return this.get<AvidConnectDataSource<Operation>>(`${RESOURCE_NAME}/${customerId}/operations`, {
      ...params,
    });
  }

  getById(customerId: number, operationId: number): Observable<Operation> {
    return this.get<Operation>(`${RESOURCE_NAME}/${customerId}/operations/${operationId}`);
  }

  getDetails(customerId: number, operationId: number, isReport?): Observable<OperationDetail<any>> {
    return isReport
      ? this.getCSV<OperationDetail<any>>(
          `${RESOURCE_NAME}/${customerId}/operations/${operationId}/details`,
          { isReport }
        )
      : this.get<OperationDetail<any>>(
          `${RESOURCE_NAME}/${customerId}/operations/${operationId}/details`
        );
  }
}
