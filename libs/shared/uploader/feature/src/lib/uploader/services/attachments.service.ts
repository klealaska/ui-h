import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AttachmentMetaData } from '../models/uploader.model';
import { UploaderConfig, PendingUpload } from '../models/uploader.model';
import { XdcApiUrls } from '@ui-coe/avidcapture/shared/types';

@Injectable({
  providedIn: 'root',
})
export class AttachmentsService {
  private config: UploaderConfig;

  constructor(private http: HttpClient) {}

  // TODO: Get config from config service once it is available
  setConfig(config: UploaderConfig): void {
    this.config = config;
  }

  createAttachmentMetaData(
    requisitionId: string,
    fileMetaData: AttachmentMetaData
  ): Observable<any> {
    return this.http.post(
      `${this.config.baseUrl}/requisitions/${requisitionId}/attachments`,
      fileMetaData
    );
  }

  uploadAttachmentFile(attachmentId: string, fileInfo: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileInfo);

    return this.http.post(
      `${this.config.attachmentUrl}/attachments/${attachmentId}/file`,
      formData
    );
  }

  deleteAttachmentFile(requisitionId: string, attachmentId: string): Observable<any> {
    return this.http.delete(
      `${this.config.baseUrl}/requisitions/${requisitionId}/attachments/${attachmentId}?source_system=${this.config.sourceSystem}`
    );
  }

  downloadAttachmentFile(attachmentId: string): Observable<any> {
    return this.http.get(`${this.config.attachmentUrl}/attachments/${attachmentId}/file`, {
      responseType: 'blob',
    });
  }

  getAttachments(requisitionId: string): Observable<any> {
    return this.http.get(
      `${this.config.baseUrl}/requisitions/${requisitionId}/attachments?source_system=${this.config.sourceSystem}`
    );
  }

  postFormData(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.config.baseUrl}`, formData);
  }

  pendingUpload(document: PendingUpload[], indexingURL: string): Observable<any> {
    return this.http.post(`${indexingURL}${XdcApiUrls.POST_PENDINGUPLOAD}`, document);
  }

  getAvidFormData(
    file: File,
    sourceEmail: string,
    sourceOrganizationId: string,
    organizationId: string,
    sourceInvoiceId: string,
    customParam: string,
    correlationId: string
  ): FormData {
    const formData = new FormData();
    formData.append('SourceEmail', sourceEmail);
    formData.append('SourceOrganizationId', sourceOrganizationId);
    formData.append('OrganizationId', organizationId);
    formData.append('SourceInvoiceId', sourceInvoiceId);
    formData.append('SourceId', 'AvidSuite');
    formData.append('File', file);
    formData.append('Custom', customParam);
    formData.append('X-Correlation-Id', correlationId);
    return formData;
  }
}
