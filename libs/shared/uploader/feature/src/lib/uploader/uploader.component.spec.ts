import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { of, throwError } from 'rxjs';
import { AttachmentsService } from './services/attachments.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsService } from './services/alerts.service';
import { UploaderComponent } from './uploader.component';
import * as testData from './test-data/uploader.testdata.json';
import { FileComponent } from './components/file/file.component';
import { MockComponent } from 'ng-mocks';

describe('UploaderComponent', () => {
  let component: UploaderComponent;
  let fixture: ComponentFixture<UploaderComponent>;
  let attachmentService: AttachmentsService;
  let alertService: AlertsService;

  const mockAlertService = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploaderComponent, MockComponent(FileComponent)],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        NgxDropzoneModule,
        MatIconModule,
      ],
      providers: [
        MatSnackBar,
        { provide: AlertsService, useValue: mockAlertService },
        AttachmentsService,
      ],
    }).compileComponents();
    attachmentService = TestBed.inject(AttachmentsService);
    alertService = TestBed.inject(AlertsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderComponent);
    component = fixture.componentInstance;
    jest.spyOn(alertService, 'open');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('files validation', () => {
    beforeEach(() => {
      component.files = [];
    });
    it('should not allow to upload more than 5 files', () => {
      component.fileSelectEvent(testData.moreThanFiveFilesScenario);
      expect(component.files.length).toBe(0);
      expect(alertService.open).toHaveBeenCalled();
    });

    it('should not allow duplicate file names to be uploaded', () => {
      component.files = testData.duplicateFileNameScenario.previouslyUploadedFiles;
      component.fileSelectEvent(testData.duplicateFileNameScenario);
      expect(component.files.length).toBe(2);
      expect(alertService.open).toHaveBeenCalled();
    });

    it('should not allow to upload files with unsupported types', () => {
      component.fileSelectEvent(testData.rejectedFileTypeScenario);
      expect(component.files.length).toBe(0);
      expect(alertService.open).toHaveBeenCalled();
    });

    it('should not allow to upload files with bigger than 20 Mb', () => {
      component.fileSelectEvent(testData.rejectedFileSizeScenario);
      expect(component.files.length).toBe(0);
      expect(alertService.open).toHaveBeenCalled();
    });

    it('should not allow to upload files with bigger than 0 kb', () => {
      component.fileSelectEvent(testData.addedFileNoSizeScenario);
      expect(component.files.length).toBe(0);
      expect(alertService.open).toHaveBeenCalled();
    });

    it('should not allow to upload files with bigger than 20 Mb and with an allowed type', () => {
      component.fileSelectEvent(testData.rejectedFileSize_TypeScenario);
      expect(component.files.length).toBe(0);
      expect(alertService.open).toHaveBeenCalled();
    });

    it('should allow two correct files into the files array', () => {
      component.files = [];
      jest.spyOn(component, 'uploadFiles').mockImplementation();
      component.fileSelectEvent(testData.addedFileScenario);
      expect(component.files.length).toBe(3);
    });
  });

  describe('component functions', () => {
    beforeEach(() => {
      component.files = testData.addedFileScenario.addedFiles as File[];
    });

    it('should call the uploadFiles function', () => {
      component.files = [];
      jest.spyOn(component, 'uploadFiles').mockImplementation();
      component.fileSelectEvent(testData.addedFileScenario);
      expect(component.uploadFiles).toHaveBeenCalledWith(testData.addedFileScenario.addedFiles);
    });

    it('should call createRequisitionMetadata function after uploadFiles function', () => {
      component.files = [];
      jest.spyOn(component, 'createRequisitionMetadata').mockImplementation();
      component.uploadFiles(testData.addedFileScenario.addedFiles);
      expect(component.createRequisitionMetadata).toHaveBeenCalledTimes(3);
    });

    it('should allow two correct files into the files array', () => {
      jest.spyOn(component, 'uploadFile').mockImplementation();
      configureAttachmentsServiceSpy(testData.response);
      configureAttachmentsUploadServiceSpy(testData.response);
      component.createRequisitionMetadata(testData.addedFileScenario.addedFiles[0] as File);
      expect(component.uploadFile).toHaveBeenCalledWith(
        testData.response.id,
        testData.addedFileScenario.addedFiles[0] as File
      );
    });

    it('should remove the file if the Attachment service to create metadata fails', () => {
      metadataAttachmentServiceSpyError();
      component.createRequisitionMetadata(testData.addedFileScenario.addedFiles[2] as File);
      expect(component.files.length).toBe(2);
      expect(alertService.open).toHaveBeenCalled();
    });

    it('should preserve the files if the Attachment service does not fail', () => {
      configureAttachmentsServiceSpy(testData.response);
      configureAttachmentsUploadServiceSpy(testData.response);
      component.uploadFile(testData.response.id, testData.addedFileScenario.addedFiles[0] as File);
      expect(component.files.length).toBe(3);
    });

    it('should remove the file if the Attachment service to upload file fails', () => {
      component.files = testData.addedFileScenario.addedFiles as File[];
      fileAttachmentServiceSpyError();
      component.uploadFile(testData.response.id, testData.addedFileScenario.addedFiles[0] as File);
      expect(component.files.length).toBe(2);
    });
    it('should remove the file if it exists on the pending deletes array', () => {
      component.pendingDeletes = [testData.addedFileScenario.addedFiles[0]];
      component.files = testData.addedFileScenario.addedFiles as File[];
      configureAttachmentsUploadServiceSpy(testData.response);
      component.uploadFile(testData.response.id, testData.addedFileScenario.addedFiles[0] as File);
      expect(component.files.length).toBe(3);
    });
  });

  describe('delete files', () => {
    beforeEach(() => {
      component.files = testData.addedFileForDeleteScenario.addedFiles as File[];
    });
    afterEach(() => {
      component.pendingDeletes = [];
    });
    it('should push a new file to pending deletes', () => {
      component.pendingDeletes = [];
      component.files = testData.addedFileForDeleteScenario.addedFiles as File[];
      component.deleteFile(testData.addedFileScenario.addedFiles[1] as File);
      expect(component.pendingDeletes.length).toBe(1);
    });

    it('should delete the file', () => {
      component.pendingDeletes = [];
      configureAttachmentsDeleteServiceSpy();
      component.deleteFile(component.files[2] as File);
      expect(component.pendingDeletes.length).toBe(0);
    });

    it('should push the file back on delete error', () => {
      component.files = testData.twoFilesScenario.addedFiles as File[];
      component.pendingDeletes = [];
      deleteAttachmentServiceSpyError();
      component.deleteFile(testData.twoFilesScenario.addedFiles[2] as File);
      expect(component.files.length).toBe(2);
    });

    it('should not delete file on service error', () => {
      component.pendingDeletes = [testData.addedFileForDeleteScenario.addedFiles[2]];
      deleteAttachmentServiceSpyError();
      component.deleteFileAfter(
        testData.addedFileForDeleteScenario.addedFiles[2] as File,
        testData.response.id
      );
      expect(component.pendingDeletes.length).toBe(1);
    });
  });

  describe('retrievebakan files', () => {
    beforeEach(() => {
      component.files = [];
    });
    afterEach(() => {
      component.files = [];
    });
    // it('should respond with formated file', () => {
    //   const formatedFile = component.filePipe(testData.retrieveFiles.response[0]);
    //   expect(formatedFile).toEqual(testData.retrieveFiles.formatedFiles[0]);
    // });
    it('should add file from the response to files array', () => {
      component.parentId = testData.response.id;
      configureAttachmentsRetrieveServiceSpy(testData.retrieveFiles.response);
      component.getAttachments(component.parentId);
      expect(component.files.length).toBe(4);
    });
  });

  describe('Action: UploadInvoice', () => {
    describe('upload invoice', () => {
      const file = getFileStub('test.pdf', true, 12000);
      const sourceInvoiceId = '70d7bc1d-2e65-45b5-9299-7120d43e400d';
      const organizationId = 'org.25';

      beforeEach(() => {
        jest.spyOn(component.fileUploadedSuccessfully, 'emit').mockImplementation();
        jest.spyOn(attachmentService, 'pendingUpload').mockReturnValue(of({ status: 200 }));
        component.files.push(file);
        component.uploadAvidInvoice(file);
      });

      it('should change to uploading true', () => {
        expect(component.files[0].isUploading).toBeTruthy();
      });

      it('should call formData', () => {
        const formData = attachmentService.getAvidFormData(
          file,
          component.sourceEmail,
          null,
          sourceInvoiceId,
          organizationId,
          component.customInvoiceUploadParam,
          null
        );
        expect(formData).toBeDefined();
      });

      it('should call postFormData & emit event for fileUploadedSuccessfully', () => {
        const formData = attachmentService.getAvidFormData(
          file,
          component.sourceEmail,
          null,
          sourceInvoiceId,
          organizationId,
          component.customInvoiceUploadParam,
          null
        );

        attachmentService.postFormData(formData).subscribe(response => {
          expect(response).toBeDefined();
          expect(component.fileUploadedSuccessfully.emit).toHaveBeenNthCalledWith(1, 'test.pdf');
        });
      });
    });
  });

  describe('pendingUploadCreate', () => {
    const pendingUpload = [
      {
        correlationId: 'mockId',
        buyerId: 'buyerMock',
        username: 'userMock',
        fileName: 'fileNameMock',
      },
    ];
    beforeEach(() => {
      jest.spyOn(attachmentService, 'pendingUpload').mockReturnValue(of({ status: 200 }));
      component.pendingUploadCreate(pendingUpload);
    });

    it('should be called', () => {
      attachmentService.pendingUpload(pendingUpload, 'mockUrl').subscribe(response => {
        expect(response).toBeDefined();
        expect(component.fileUploadedSuccessfully.emit).toHaveBeenNthCalledWith(
          1,
          pendingUpload,
          'mockUrl'
        );
      });
    });
  });

  // Helper functions

  function initializeComponent() {
    component.ngOnInit();
    fixture.detectChanges();
  }

  function configureAttachmentsServiceSpy(response) {
    jest.spyOn(attachmentService, 'createAttachmentMetaData').mockReturnValue(of(response));
  }

  function configureAttachmentsUploadServiceSpy(response) {
    jest.spyOn(attachmentService, 'uploadAttachmentFile').mockReturnValue(of(response));
  }

  function configureAttachmentsDeleteServiceSpy() {
    jest.spyOn(attachmentService, 'deleteAttachmentFile').mockReturnValue(of({ status: 204 }));
  }

  function configureAttachmentsRetrieveServiceSpy(response) {
    jest.spyOn(attachmentService, 'getAttachments').mockReturnValue(of(response));
  }

  function deleteAttachmentServiceSpyError() {
    jest.spyOn(attachmentService, 'deleteAttachmentFile').mockImplementation(() => {
      return throwError(new Error('Fake error'));
    });
  }

  function metadataAttachmentServiceSpyError() {
    jest.spyOn(attachmentService, 'createAttachmentMetaData').mockImplementation(() => {
      return throwError(new Error('Fake error'));
    });
  }

  function fileAttachmentServiceSpyError() {
    jest.spyOn(attachmentService, 'uploadAttachmentFile').mockImplementation(() => {
      return throwError(new Error('Fake error'));
    });
  }

  function getFileStub(fileName: string, isFile: boolean, fileSize: number): any {
    return {
      fileEntry: {
        file: jest.fn(cb =>
          cb({
            size: fileSize,
            name: fileName,
          })
        ),
        name: fileName,
        isFile,
      },
    };
  }
});
