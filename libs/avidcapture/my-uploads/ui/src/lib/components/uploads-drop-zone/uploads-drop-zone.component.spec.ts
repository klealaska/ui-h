import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { getBuyersStub } from '@ui-coe/avidcapture/shared/test';
import { DropdownComponent, DropzoneComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';

import { UploadsDropZoneComponent } from './uploads-drop-zone.component';

function getFileStub(fileName: string, fileSize: number): any {
  return {
    size: fileSize,
    name: fileName,
  };
}

describe('UploadsDropZoneComponent', () => {
  let component: UploadsDropZoneComponent;
  let fixture: ComponentFixture<UploadsDropZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UploadsDropZoneComponent,
        MockPipe(TranslatePipe),
        MockComponent(DropdownComponent),
      ],
      imports: [DropzoneComponent, MatIconModule, FormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadsDropZoneComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when filteredBuyers only has 1 selected buyer', () => {
      beforeEach(() => {
        component.filteredBuyers = [getBuyersStub()[0]];
        fixture.detectChanges();
      });

      it('should set orgIdSelected to the filteredBuyer.id', () =>
        expect(component.orgIdSelected).toBe(component.filteredBuyers[0].id));

      it('should set disabled to false', () => expect(component.disabled).toBeFalsy());

      it('should set dropdownOptions using filteredBuyers', () =>
        expect(component.dropdownOptions).toEqual(
          component.filteredBuyers.map(buyer => ({
            text: buyer.name,
            value: buyer.id,
          }))
        ));
    });

    describe('when filteredBuyers only has more than 1 selected buyer', () => {
      beforeEach(() => {
        component.filteredBuyers = getBuyersStub();
        fixture.detectChanges();
      });

      it('should set orgIdSelected to an empty string', () =>
        expect(component.orgIdSelected).toBe(''));

      it('should set disabled to true', () => expect(component.disabled).toBeTruthy());

      it('should set dropdownOptions using filteredBuyers', () =>
        expect(component.dropdownOptions).toEqual(
          component.filteredBuyers.map(buyer => ({
            text: buyer.name,
            value: buyer.id,
          }))
        ));
    });
  });

  describe('fileAdded()', () => {
    describe('when dropping more than 50 files', () => {
      let fileStub: FileList = {
        length: 0,
        item: {} as any,
      };

      for (let i = 0; i < 60; i++) {
        fileStub = {
          ...fileStub,
          [i]: getFileStub('test.pdf', 12000),
          length: i,
        };
      }

      beforeEach(() => {
        jest.spyOn(component.uploadError, 'emit').mockImplementation();
        component.fileAdded(fileStub);
      });

      it('should set errorMessage to a max of 50 files text', () =>
        expect(component.errorMessage).toBe('maxFiles'));

      it('should emit a nasty message for uploadError emitter', () =>
        expect(component.uploadError.emit).toHaveBeenNthCalledWith(
          1,
          'Only 50 files can be uploaded at one time.'
        ));
    });

    describe('when dropping in a file that is NOT a PDF file', () => {
      const fileStub: FileList = {
        0: getFileStub('test.docx', 12000),
        length: 1,
        item: {} as any,
      };

      beforeEach(() => {
        jest.spyOn(component.uploadError, 'emit').mockImplementation();
        component.fileAdded(fileStub);
      });

      it('should set errorMessage to not a pdf message', () => {
        expect(component.errorMessage).toBe('format');
      });

      it('should emit a nasty message for uploadError emitter', () =>
        expect(component.uploadError.emit).toHaveBeenNthCalledWith(1, 'File type not allowed.'));
    });

    describe('when dropping a file that has 0 bytes', () => {
      const fileStub: FileList = {
        0: getFileStub('test.pdf', 0),
        length: 1,
        item: {} as any,
      };

      beforeEach(() => {
        jest.spyOn(component.uploadError, 'emit').mockImplementation();
        component.fileAdded(fileStub);
      });

      it('should set errorMessage to no bytes message', () =>
        expect(component.errorMessage).toBe('noBytes'));

      it('should emit a nasty message for uploadError emitter', () =>
        expect(component.uploadError.emit).toHaveBeenNthCalledWith(
          1,
          'Oops! Your file is empty with 0KB. Please check and try again.'
        ));
    });

    describe('when dropping in a file larger than 10MB', () => {
      const fileStub: FileList = {
        0: getFileStub('test.pdf', 12000000),
        length: 1,
        item: {} as any,
      };

      beforeEach(() => {
        jest.spyOn(component.uploadError, 'emit').mockImplementation();
        component.fileAdded(fileStub);
      });

      it('should set errorMessage to size limit capacity message', () =>
        expect(component.errorMessage).toBe('maxSize'));

      it('should emit a nasty message for uploadError emitter', () =>
        expect(component.uploadError.emit).toHaveBeenNthCalledWith(1, 'File exceeds 10MB limit.'));
    });

    describe('when dropping in a file that meets all requirements', () => {
      const fileStub: FileList = {
        0: getFileStub('test.pdf', 12000),
        length: 1,
        item: {} as any,
      };

      beforeEach(() => {
        jest.spyOn(component.filesDropped, 'emit');
        component.fileName = '';
        component.orgIdSelected = '25';

        component.fileAdded(fileStub);
      });

      it('should emit for fileDropped emitter', () =>
        expect(component.filesDropped.emit).toHaveBeenNthCalledWith(1, {
          file: {
            name: 'test.pdf',
            size: 12000,
          } as any,
          orgId: component.orgIdSelected,
          correlationId: expect.anything(),
        }));
    });
  });

  describe('fileUploaded()', () => {
    it('should call onFileUpload on change', () => {
      component.filteredBuyers = getBuyersStub();
      const element = fixture.nativeElement;
      const input = element.querySelector('#fileUpload');

      jest.spyOn(component, 'fileUploaded');
      jest.spyOn(component, 'fileAdded');
      input.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      expect(component.fileUploaded).toHaveBeenCalled();
      expect(component.fileAdded).toHaveBeenCalled();
    });
  });

  describe('optionSelected()', () => {
    beforeEach(() => {
      component.optionSelected('25');
    });

    it('should set orgIdSelected to passed in value', () =>
      expect(component.orgIdSelected).toBe('25'));

    it('should set disabled to false', () => expect(component.disabled).toBeFalsy());
  });
});
