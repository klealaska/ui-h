import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { UploaderUtilService } from './uploader-util.service';
import { AttachmentsService } from './attachments.service';
import * as testData from '../test-data/uploader.testdata.json';
import { UploaderComponent } from '../uploader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UploaderUtilService', () => {
  let service: UploaderUtilService;
  let component: UploaderComponent;
  let fixture: ComponentFixture<UploaderComponent>;
  let attachmentsService: AttachmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderComponent],
      imports: [
        MatSnackBarModule,
        HttpClientTestingModule,
        MatIconModule,
        NgxDropzoneModule,
        BrowserAnimationsModule,
      ],
      providers: [MatSnackBar],
    });
    fixture = TestBed.createComponent(UploaderComponent);
    service = TestBed.inject(UploaderUtilService);
    attachmentsService = TestBed.inject(AttachmentsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should download the file', () => {
    global.URL.createObjectURL = jest.fn();
    it('should download the image file', () => {
      jest.spyOn(service, 'openDownloadLink').mockImplementation();
      configureAttachmentsDownloadServiceSpy(testData.downloadResponseImage);
      component.downloadFile(testData.response.id);
      expect(service.openDownloadLink).toHaveBeenCalledWith(testData.downloadResponseImage);
    });

    it('should call openDownloadLink', () => {
      const data = new Blob(['example'], { type: 'text/plain' });
      service.openDownloadLink(data);
    });

    it('should call openSeeLink', () => {
      const data = new Blob(['example'], { type: 'text/plain' });
      service.openFileLink(data);
    });

    it('should download the xls file', () => {
      jest.spyOn(service, 'openDownloadLink').mockImplementation();
      configureAttachmentsDownloadServiceSpy(testData.downloadResponseXls);
      component.downloadFile(testData.response.id);
      expect(service.openDownloadLink).toHaveBeenCalledWith(testData.downloadResponseXls);
    });
  });

  describe('should see the file', () => {
    it('should see the image file', () => {
      jest.spyOn(service, 'openFileLink').mockImplementation();
      configureAttachmentsDownloadServiceSpy(testData.downloadResponseImage);
      component.openFile(testData.response.id);
      expect(service.openFileLink).toHaveBeenCalledWith(testData.downloadResponseImage);
    });

    it('should download the xls file', () => {
      jest.spyOn(service, 'openDownloadLink').mockImplementation();
      configureAttachmentsDownloadServiceSpy(testData.downloadResponseXls);
      component.openFile(testData.response.id);
      expect(service.openDownloadLink).toHaveBeenCalledWith(testData.downloadResponseXls);
    });
  });

  describe('minSizeCheck', () => {
    const files = {
      addedFiles: [
        { name: 'mock1', size: 0 },
        { name: 'mock2', size: 1024 },
      ],
    };

    describe('When receives a file with size 0', () => {
      it('Should remove files with size 0 and returns 1 file', () => {
        expect(service.minSizeCheck(files)).toEqual({
          addedFiles: [{ name: 'mock2', size: 1024 }],
        });
      });
    });
  });

  function configureAttachmentsDownloadServiceSpy(response) {
    jest.spyOn(attachmentsService, 'downloadAttachmentFile').mockReturnValue(of(response));
  }
});
