import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
// import { ConfigSettings } from '../../../shared/models/configuration/configuration-settings.model';
// import { TestConfigSettingsFactory } from '../../../shared/test/test-config-settings.factory';
import { AttachmentMetaData, PendingUpload, UploaderConfig } from '../models/uploader.model';
import { AttachmentsService } from './attachments.service';
import * as testData from '../test-data/attachments.testdata.json';
import { XdcApiUrls } from '@ui-coe/avidcapture/shared/types';

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  // let configSettings: ConfigSettings;
  let httpTestingController: HttpTestingController;
  const requisitionId: string = testData.requisitionId;

  const uploaderConfig: UploaderConfig = {
    sourceSystem: 'Experience-QA',
    baseUrl: 'http://localhost:3333/api',
    attachmentUrl: 'https://ax-ae1-qa-atmapi-svc-api.azurewebsites.net',
    maxFiles: 5,
    maxSize: 20000000,
    acceptedFiles: '.pdf, .xls, .xlsx, .doc, .docx, .ppt, .pptx, .jpg, .jpeg, .png, .svg',
  };

  const environmentStub = {
    apiBaseUri: 'http://idcapi.avidxchange.com/',
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      // providers: [{ provide: ConfigSettings, useFactory: TestConfigSettingsFactory }],
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    // configSettings = TestBed.inject(ConfigSettings);
    service = TestBed.inject(AttachmentsService);
    service.setConfig(uploaderConfig);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createAttachmentMetaData', () => {
    it('should hit the Requisition Attachments POST endpoint', () => {
      // const url = `${configSettings.GatewayBaseUrl}/requisitions/${requisitionId}/attachments`;
      const url = `http://localhost:3333/api/requisitions/${testData.requisitionId}/attachments`;

      service
        .createAttachmentMetaData(requisitionId, testData.metaData as AttachmentMetaData)
        .subscribe(data => {
          expect(data).toEqual(testData.response);
        });

      const request = httpTestingController.expectOne(url);
      expect(request.request.method).toEqual('POST');
      request.flush(testData.response);
    });
  });

  describe('uploadAttachmentFile', () => {
    it('should hit the Attachment File POST endpoint', () => {
      // const url = `${configSettings.AttachmentBaseUrl}/attachments/${testData.attachmentId}/file`;
      const url = `https://ax-ae1-qa-atmapi-svc-api.azurewebsites.net/attachments/${testData.attachmentId}/file`;

      const formData = new FormData();
      formData.append('file', testData.addedFileScenario.addedFiles[0] as File);

      service.uploadAttachmentFile(testData.attachmentId, formData).subscribe(data => {
        expect(data).toBeTruthy();
      });
      const request = httpTestingController.expectOne(url);
      expect(request.request.method).toEqual('POST');
      request.flush(testData.response);
    });
  });

  describe('deleteAttachmentFile', () => {
    it('should hit the Attachment File DELETE endpoint', () => {
      //  const url = `${configSettings.GatewayBaseUrl}/requisitions/` +
      //  `${testData.requisitionId}/attachments/${testData.attachmentId}?source_system=${configSettings.SourceSystem}`;
      const url =
        `http://localhost:3333/api/requisitions/${requisitionId}/attachments/${testData.attachmentId}?` +
        `source_system=Experience-QA`;

      service
        .deleteAttachmentFile(testData.requisitionId, testData.attachmentId)
        .subscribe(data => {
          expect(data).toBeTruthy();
        });
      const request = httpTestingController.expectOne(url);
      expect(request.request.method).toEqual('DELETE');
      request.flush(testData.response);
    });
  });

  describe('downloadAttachmentFile', () => {
    it('should hit the Attachment File GET endpoint', () => {
      // const url = `${configSettings.AttachmentBaseUrl}/attachments/${testData.attachmentId}/file`;
      const url = `https://ax-ae1-qa-atmapi-svc-api.azurewebsites.net/attachments/${testData.attachmentId}/file`;

      service.downloadAttachmentFile(testData.attachmentId).subscribe((data: Blob) => {
        expect(data).toBeTruthy();
      });
      const request = httpTestingController.expectOne(url);
      expect(request.request.method).toEqual('GET');
    });
  });

  describe('getAttachmentsList', () => {
    it('should hit the Requisition Attachments GET endpoint', () => {
      //  const url = `${configSettings.GatewayBaseUrl}/requisitions/` +
      //  `${testData.requisitionId}/attachments?source_system=${configSettings.SourceSystem}`;
      const url =
        `http://localhost:3333/api/requisitions/${testData.requisitionId}/attachments?` +
        `source_system=Experience-QA`;
      service.getAttachments(testData.requisitionId).subscribe(data => {
        expect(data).toBeTruthy();
      });
      const request = httpTestingController.expectOne(url);
      expect(request.request.method).toEqual('GET');
    });
  });

  describe('pendingUpload', () => {
    it('should call pendingUpload POST endpoint', done => {
      const document: PendingUpload[] = [
        {
          correlationId: 'correlationMock',
          buyerId: 'buyerMock',
          username: 'usernameMock',
          fileName: 'fileNameMock',
        },
      ];

      service.pendingUpload(document, environmentStub.apiBaseUri).subscribe(response => {
        expect(response).toBeDefined();
        done();
      });

      const req = httpTestingController.expectOne(
        `${environmentStub.apiBaseUri}${XdcApiUrls.POST_PENDINGUPLOAD}`
      );
      expect(req.request.method).toEqual('POST');
      req.flush('');
    });
  });
});
