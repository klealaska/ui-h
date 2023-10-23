import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { AvidConnectDataSource, ExecutionEvent } from '../../models';
import { BaseAPIService } from './base.service';

const RESOURCE_NAME = 'customers';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService extends BaseAPIService {
  constructor(public http: HttpClient, public config: AppConfig) {
    super(http, config.apiBaseUrl);
  }

  getEvents(
    customerId: number,
    executionId: number,
    isReport?: boolean
  ): Observable<AvidConnectDataSource<ExecutionEvent>> {
    return isReport
      ? this.getCSV<AvidConnectDataSource<ExecutionEvent>>(
          `${RESOURCE_NAME}/${customerId}/executions/${executionId}/events`,
          { isReport }
        )
      : this.get<AvidConnectDataSource<ExecutionEvent>>(
          `${RESOURCE_NAME}/${customerId}/executions/${executionId}/events`
        );
  }

  getArtifacts(customerId: number, executionId: number): Observable<ArrayBuffer> {
    return this.getBlob<ArrayBuffer>(
      `${RESOURCE_NAME}/${customerId}/executions/${executionId}/artifacts`
    );
  }
}
