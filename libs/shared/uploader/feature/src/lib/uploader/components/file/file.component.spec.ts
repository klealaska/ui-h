import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { of, throwError } from 'rxjs';
import { AttachmentsService } from '../../services/attachments.service';
import * as testData from '../../test-data/uploader.testdata.json';
import { fileTypesIconMap } from '../../models/file-types';
import { FileComponent } from './file.component';

describe('FileComponent', () => {
  let component: FileComponent;
  let fixture: ComponentFixture<FileComponent>;
  let attachmentService: AttachmentsService;

  const mockAttachmentsService = {
    downloadAttachmentFile: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileComponent],
      imports: [
        NgxDropzoneModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatDividerModule,
        MatProgressBarModule,
      ],
      providers: [{ provide: AttachmentsService, useValue: mockAttachmentsService }],
    }).compileComponents();
    attachmentService = TestBed.inject(AttachmentsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileComponent);
    component = fixture.componentInstance;
    component.file = testData.FileTypes.addedFiles[0] as File;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should show correct file type icon', () => {
    it('should shown image icon', () => {
      const path = component.getFileIcon();
      expect(path).toBe(getType('image'));
    });

    it('should shown pdf icon', () => {
      component.file = testData.FileTypes.addedFiles[4] as File;
      const path = component.getFileIcon();
      expect(path).toBe(getType('application/pdf'));
    });

    it('should shown word icon', () => {
      component.file = testData.FileTypes.addedFiles[5] as File;
      const path = component.getFileIcon();
      expect(path).toBe(getType('application/msword'));
    });

    it('should shown excel icon', () => {
      component.file = testData.FileTypes.addedFiles[6] as File;
      const path = component.getFileIcon();
      expect(path).toBe(getType('application/vnd.ms-excel'));
    });

    it('should shown power point icon', () => {
      component.file = testData.FileTypes.addedFiles[7] as File;
      const path = component.getFileIcon();
      expect(path).toBe(getType('application/vnd.ms-powerpoint'));
    });
  });

  function getType(type) {
    return fileTypesIconMap.find(ft => ft.type === type)?.path;
  }
});
