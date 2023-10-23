import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import {
  registrationStub,
  routerStub,
  storeStub,
  toastServiceStub,
} from '../../../../../test/test-stubs';
import { SharedModule } from '../../../../shared/shared.module';

import { SyncNowComponent } from './sync-now.component';
import * as actions from '../../../sync.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { AvidPage, ToastStatus } from '../../../../core/enums';
import { ToastService } from '../../../../core/services/toast.service';
import { RegistrationEnablement } from '../../../../models';
import { of } from 'rxjs';

describe('SyncNowComponent', () => {
  let component: SyncNowComponent;
  let fixture: ComponentFixture<SyncNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncNowComponent, MockComponents(MatSlideToggle)],
      imports: [SharedModule, NgxsModule.forRoot([]), FormsModule],
      providers: [
        {
          provide: Store,
          useValue: storeStub,
        },
        {
          provide: Router,
          useValue: routerStub,
        },
        {
          provide: ToastService,
          useValue: toastServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(registrationStub);
    });

    it('should dispatch GetRegistrationEnablements and GetNavigationChevron', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith([
        new actions.GetRegistrationEnablements(),
        new coreActions.GetNavigationChevron(AvidPage.CustomerSync),
      ]);
    });
  });

  describe('onIsPreviewClick()', () => {
    it('should check if each operation can preview', () => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce(['CompanyInvoice', 'test']);
      jest.spyOn(component, 'verifySelectedOperationCanPreview').mockReturnValueOnce(false);

      component.onIsPreviewClick({});
      expect(component.verifySelectedOperationCanPreview).toHaveBeenCalledTimes(2);
    });

    it('should open a warning toast if an operation cannot be previewed', () => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce(['CompanyInvoice', 'test']);
      jest.spyOn(component, 'verifySelectedOperationCanPreview').mockReturnValueOnce(true);
      jest.spyOn(component['toast'], 'open').mockImplementation();

      component.onIsPreviewClick({ preventDefault: jest.fn() });
      expect(component['toast'].open).toHaveBeenCalledWith(
        'Invoice sync is not allowed in preview mode',
        ToastStatus.Warning
      );
    });

    it('should set isPreview to false if an operation cannot be previewed', () => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce(['CompanyInvoice', 'test']);
      jest.spyOn(component, 'verifySelectedOperationCanPreview').mockReturnValueOnce(true);

      component.onIsPreviewClick({ preventDefault: jest.fn() });
      expect(component.isPreview).toBe(false);
    });
  });

  describe('verifySelectedOperationCanPreview()', () => {
    describe('when CompanyInvoice is not added', () => {
      beforeEach(() => {
        component.operations = [];
        component.isPreview = true;
        component.operationTypesNotAllowedPreview = ['CompanyInvoice'];
        component.checkBoxChanged(true, {
          operationTypeName: 'GlobalCodes',
        } as RegistrationEnablement);
        component.verifySelectedOperationCanPreview('CompanyInvoice');
      });

      it('preview should', () => {
        expect(component.isPreview).toEqual(true);
      });
    });

    describe('when CompanyInvoice is added', () => {
      beforeEach(() => {
        component.operations = [];
        component.isPreview = true;
        component.operationTypesNotAllowedPreview = ['CompanyInvoice'];
        component.checkBoxChanged(true, {
          operationTypeName: 'CompanyInvoice',
        } as RegistrationEnablement);
        component.verifySelectedOperationCanPreview('CompanyInvoice');
      });

      it('preview should', () => {
        expect(component.isPreview).toEqual(false);
      });
    });
  });

  describe('syncOperations()', () => {
    it('should dispatch a PostExecution action', () => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(undefined);
      jest
        .spyOn(storeStub, 'dispatch')
        .mockClear()
        .mockImplementationOnce(() => of());

      component.syncOperations();
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.PostExecution({
          origin: 'ac-portal-sync-now',
          isPreview: false,
          createdBy: undefined,
          platformKey: undefined,
          customerKey: undefined,
          registrationKey: undefined,
          operations: undefined,
        })
      );
    });

    it('should dispatch a PostExecution action with locations', () => {
      jest
        .spyOn(storeStub, 'selectSnapshot')
        .mockReturnValueOnce({ test: { fileId: '123' } })
        .mockReturnValue(undefined);
      jest
        .spyOn(storeStub, 'dispatch')
        .mockClear()
        .mockImplementationOnce(() => of());

      component.syncOperations();
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.PostExecution({
          origin: 'ac-portal-sync-now',
          isPreview: false,
          createdBy: undefined,
          platformKey: undefined,
          customerKey: undefined,
          registrationKey: undefined,
          operations: undefined,
          parameters: {
            system: {
              locations: [
                {
                  operationType: 'test',
                  path: 'ac-blob://123',
                },
              ],
            },
          },
        })
      );
    });

    it('should dispatch a PostExecution action without locations', () => {
      jest
        .spyOn(storeStub, 'selectSnapshot')
        .mockReturnValueOnce({ test: null })
        .mockReturnValue(undefined);
      jest
        .spyOn(storeStub, 'dispatch')
        .mockClear()
        .mockImplementationOnce(() => of());

      component.syncOperations();
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.PostExecution({
          origin: 'ac-portal-sync-now',
          isPreview: false,
          createdBy: undefined,
          platformKey: undefined,
          customerKey: undefined,
          registrationKey: undefined,
          operations: undefined,
        })
      );
    });
  });

  describe('checkBoxChanged()', () => {
    describe('when is checked', () => {
      beforeEach(() => {
        component.operations = [];
        component.checkBoxChanged(true, {
          operationTypeName: 'CompanyInvoice',
          isApibased: true,
        } as RegistrationEnablement);
        component.verifySelectedOperationCanPreview('CompanyInvoice');
      });

      it('should dispatch an event to add an operation', () => {
        expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.AddOperation('CompanyInvoice'));
      });
    });

    describe('when is unchecked', () => {
      beforeEach(() => {
        component.operations = [{ operationTypeId: 1, operationTypeName: 'CompanyInvoice' }];
        component.checkBoxChanged(false, {
          operationTypeName: 'CompanyInvoice',
        } as RegistrationEnablement);
        component.verifySelectedOperationCanPreview('CompanyInvoice');
      });

      it('should dispatch an event to remove the operation', () => {
        expect(storeStub.dispatch).toHaveBeenCalledWith(
          new actions.RemoveOperation('CompanyInvoice')
        );
      });
    });
  });

  describe('goBack()', () => {
    beforeEach(() => {
      jest.spyOn(window.history, 'back');
      component.goBack();
    });

    it('should redirect back to connectors page', () => {
      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe('uploadFile()', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'dispatch').mockImplementation().mockClear();
    });

    it('should dispatch a PostFileUpload action', () => {
      const enablement = {
        operationTypeName: 'test',
      } as RegistrationEnablement;

      component.uploadFile({} as File, enablement);
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.PostFileUpload(enablement.operationTypeName, {} as File)
      );
    });

    it('should not dispatch an action if there is no file', () => {
      const enablement = {
        operationTypeName: 'test',
      } as RegistrationEnablement;

      component.uploadFile(null, enablement);
      expect(storeStub.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('openFileDialog', () => {
    it('should create an input element', () => {
      const mockInput = { click: jest.fn() };
      jest.spyOn(document, 'createElement').mockReturnValueOnce(mockInput as any);

      component.openFileDialog({} as RegistrationEnablement);
      expect(mockInput['type']).toEqual('file');
      expect(mockInput['accept']).toEqual('.csv, .txt');
    });
  });

  describe('handleFileSelect()', () => {
    it('should check the file size before uploading the file', () => {
      jest.spyOn(component, 'checkFileSize').mockReturnValue(true);
      jest.spyOn(component, 'uploadFile').mockImplementation();

      component.handleFileSelect([{}] as any, {} as RegistrationEnablement);
      expect(component.checkFileSize).toHaveBeenCalled();
      expect(component.uploadFile).toHaveBeenCalledWith({}, {});
    });

    it('should not upload a file if the file is too large', () => {
      jest.spyOn(component, 'checkFileSize').mockReturnValue(false);
      jest.spyOn(component, 'uploadFile').mockImplementation();

      component.handleFileSelect([{}] as any, {} as RegistrationEnablement);
      expect(component.checkFileSize).toHaveBeenCalled();
      expect(component.uploadFile).not.toHaveBeenCalled();
    });

    it('should display a failure toast if the file is too large', () => {
      jest.spyOn(component, 'checkFileSize').mockReturnValue(false);
      jest.spyOn(component['toast'], 'open').mockImplementation();

      component.handleFileSelect([{}] as any, {} as RegistrationEnablement);
      expect(component['toast'].open).toHaveBeenCalledWith(
        'File size is larger than the maximum supported size',
        ToastStatus.Error
      );
    });
  });

  describe('checkFileSize()', () => {
    it('should return true if the file size is less than 250MB', () => {
      const file = { size: 12345 } as File;
      expect(component.checkFileSize(file)).toBe(true);
    });

    it('should return false if the file size is greater than 250MB', () => {
      const file = { size: 3000000000 } as File;
      expect(component.checkFileSize(file)).toBe(false);
    });
  });
});
