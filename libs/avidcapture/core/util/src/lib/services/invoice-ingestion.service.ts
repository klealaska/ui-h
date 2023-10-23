import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  Environment,
  IndexedData,
  InvoiceIngestionUrls,
  SearchContext,
  XdcApiUrls,
} from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { BaseAPIService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceIngestionService extends BaseAPIService {
  constructor(protected http: HttpClient, @Inject('environment') private environment: Environment) {
    super(http);
  }

  uploadInvoice(
    file: File,
    sourceOrganizationId: string,
    organizationId: string,
    sourceEmail: string,
    correlationId: string
  ): Observable<void> {
    const sourceInvoiceId = this.getSourceInvoiceId();
    const customField = {
      bypassFormRecognizer: true,
      manualUpload: true,
      username: sourceEmail,
      dateUploaded: DateTime.now().toFormat('MM/dd/yyyy'),
    };

    const headers = new HttpHeaders({
      'X-Correlation-ID': correlationId,
    });

    const formData = this.createFormData(
      file,
      sourceOrganizationId,
      organizationId,
      sourceInvoiceId,
      sourceEmail,
      JSON.stringify(customField)
    );

    return this.post<void>(
      `${this.environment.invoiceIngestionApiBaseUri}${InvoiceIngestionUrls.POST_FILE}`,
      formData,
      {
        headers,
      }
    );
  }

  swapInvoice(
    file: File,
    organizationId: string,
    sourceEmail: string,
    indexedDocument: IndexedData
  ): Observable<IndexedData> {
    const sourceInvoiceId = this.getSourceInvoiceId();

    const headers = new HttpHeaders({
      'X-Correlation-ID': this.getSourceInvoiceId(),
    });

    const formData = this.createFormData(
      file,
      null,
      organizationId,
      sourceInvoiceId,
      sourceEmail,
      JSON.stringify(indexedDocument)
    );

    return this.post<IndexedData>(
      `${this.environment.apiBaseUri}${XdcApiUrls.POST_FILE}`,
      formData,
      {
        headers,
      }
    );
  }

  private createFormData(
    file: File,
    sourceOrganizationId: string,
    organizationId: string,
    sourceInvoiceId: string,
    sourceEmail: string,
    customParam: string
  ): FormData {
    const formData = new FormData();

    formData.append('SourceEmail', sourceEmail);
    formData.append('SourceOrganizationId', sourceOrganizationId);
    formData.append('OrganizationId', organizationId);
    formData.append('SourceInvoiceId', sourceInvoiceId);
    formData.append('SourceId', SearchContext.AvidSuite);
    formData.append('File', file);
    formData.append('Custom', customParam);
    return formData;
  }

  private getSourceInvoiceId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
