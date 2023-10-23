import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastService } from '@ui-coe/avidcapture/core/util';
import { IconComponent } from '@ui-coe/shared/ui';
import { DropzoneComponent } from '@ui-coe/shared/ui-v2';
import { UploaderComponent } from '@ui-coe/shared/uploader/feature';
import { MockComponent, MockPipe } from 'ng-mocks';

import { DocumentSwapComponent } from './document-swap.component';

const dialogRefStub = {
  close: jest.fn(),
};

const toastServiceStub = {
  error: jest.fn(),
} as any;

function getFileStub(fileName: string, fileSize: number): any {
  return {
    size: fileSize,
    name: fileName,
  };
}

describe('DocumentSwapComponent', () => {
  let component: DocumentSwapComponent;
  let fixture: ComponentFixture<DocumentSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentSwapComponent,
        MockComponent(IconComponent),
        MockComponent(UploaderComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [MatButtonModule, MatDialogModule, MatIconModule, DropzoneComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefStub,
        },
        {
          provide: ToastService,
          useValue: toastServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fileUploaded()', () => {
    describe('when file passed in does not meet the requirements', () => {
      const fileStub: FileList = {
        0: getFileStub('test.pdf', 12000000),
        length: 1,
        item: {} as any,
      };

      beforeEach(() => {
        component.fileUploaded(fileStub);
      });

      it('should not close the dialog', () => expect(dialogRefStub.close).not.toHaveBeenCalled());
    });

    describe('when file passed in meets the requirements', () => {
      const fileStub: FileList = {
        0: getFileStub('test.pdf', 1200),
        length: 1,
        item: {} as any,
      };

      beforeEach(() => {
        component.fileUploaded(fileStub);
      });

      it('should not close the dialog', () =>
        expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, fileStub[0]));
    });
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should close the dialog', () =>
      expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, null));
  });

  describe('private fileIsAllowed()', () => {
    describe('when user adds more than 1 file', () => {
      let result: boolean;
      const fileStub = {
        0: getFileStub('test.pdf', 1200),
        1: getFileStub('test.pdf', 1200),
        length: 2,
        item: {} as any,
      };
      const files = Array.from(fileStub);

      beforeEach(() => {
        result = component['fileIsAllowed'](files);
      });

      it('should open up an error toast', () => {
        expect(toastServiceStub.error).toHaveBeenNthCalledWith(
          1,
          'Only one file can be chosen to swap.'
        );
      });

      it('should return a false result', () => {
        expect(result).toBeFalsy();
      });
    });

    describe('when user adds a file with 0 bytes', () => {
      let result: boolean;
      const fileStub = {
        0: getFileStub('test.pdf', 0),
        length: 1,
        item: {} as any,
      };
      const files = Array.from(fileStub);

      beforeEach(() => {
        result = component['fileIsAllowed'](files);
      });

      it('should open up an error toast', () => {
        expect(toastServiceStub.error).toHaveBeenNthCalledWith(
          1,
          'Oops! Your file is empty with 0KB. Please check and try again.'
        );
      });

      it('should return a false result', () => {
        expect(result).toBeFalsy();
      });
    });

    describe('when user adds a file with a size greater than 10MB', () => {
      let result: boolean;
      const fileStub = {
        0: getFileStub('test.pdf', 100000000),
        length: 1,
        item: {} as any,
      };
      const files = Array.from(fileStub);

      beforeEach(() => {
        result = component['fileIsAllowed'](files);
      });

      it('should open up an error toast', () => {
        expect(toastServiceStub.error).toHaveBeenNthCalledWith(1, 'File exceeds 10MB limit.');
      });

      it('should return a false result', () => {
        expect(result).toBeFalsy();
      });
    });

    describe('when user adds a file that is not a PDF', () => {
      let result: boolean;
      const fileStub = {
        0: getFileStub('test.docx', 1200),
        length: 1,
        item: {} as any,
      };
      const files = Array.from(fileStub);

      beforeEach(() => {
        result = component['fileIsAllowed'](files);
      });

      it('should open up an error toast', () => {
        expect(toastServiceStub.error).toHaveBeenNthCalledWith(1, 'File type not allowed.');
      });

      it('should return a false result', () => {
        expect(result).toBeFalsy();
      });
    });

    describe('when user adds a file that passes all requirements', () => {
      let result: boolean;
      const fileStub = {
        0: getFileStub('test.pdf', 1200),
        length: 1,
        item: {} as any,
      };
      const files = Array.from(fileStub);

      beforeEach(() => {
        result = component['fileIsAllowed'](files);
      });

      it('should return a true result', () => {
        expect(result).toBeTruthy();
      });
    });
  });
});
