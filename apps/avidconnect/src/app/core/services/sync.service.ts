import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { Execution } from '../../models';
import { BaseAPIService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService extends BaseAPIService {
  constructor(public http: HttpClient, public appConfig: AppConfig) {
    super(http, appConfig.apiBaseUrl);
  }

  postExecution(execution: Execution): Observable<number> {
    return this.post<number>(`sync/external-execution`, execution);
  }

  postFileUpload(
    customerExternalKey: string,
    platformExternalKey: string,
    file: File
  ): Observable<any> {
    return this.post<string>(
      `files/${platformExternalKey}/${customerExternalKey}`,
      file,
      null,
      'text'
    );
  }
}
