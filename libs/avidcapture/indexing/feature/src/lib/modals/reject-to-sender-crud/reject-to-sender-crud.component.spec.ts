import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import {
  CreateRejectToSenderTemplate,
  DeleteRejectToSenderTemplate,
  EditRejectToSenderTemplate,
} from '@ui-coe/avidcapture/indexing/data-access';
import { RejectToSenderTemplate, SearchContext } from '@ui-coe/avidcapture/shared/types';
import { TextEditorComponent } from '@ui-coe/shared/ui';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';

import { RejectToSenderCrudComponent } from './reject-to-sender-crud.component';

const dialogRefStub = {
  close: jest.fn(),
};

describe('RejectToSenderCrudComponent', () => {
  let component: RejectToSenderCrudComponent;
  let fixture: ComponentFixture<RejectToSenderCrudComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RejectToSenderCrudComponent,
        MockPipe(TranslatePipe),
        MockComponent(TextEditorComponent),
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTabsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefStub,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            buyerId: 1,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectToSenderCrudComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch').mockImplementation(() => of(null));
    jest.spyOn(store, 'select').mockImplementation(() =>
      of([
        {
          templateId: '1',
          sourceSystemBuyerId: '25',
          templateName: 'Mock',
          templateSubjectLine: 'Schmock',
          notificationTemplate: 'mockTemplate',
        } as RejectToSenderTemplate,
      ])
    );

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the templateForm and get the custom templates from state', () => {
    expect(component.templateForm).toBeDefined();
    expect(component.templates$).toBeDefined();
  });

  describe('ngAfterViewInit()', () => {
    jest.useFakeTimers();

    beforeEach(() => {
      fixture.detectChanges();
      component.addTemplateNameInput = {
        nativeElement: {
          focus: jest.fn(),
        } as any,
      } as any;
      fixture.detectChanges();
      jest.advanceTimersByTime(150);
    });

    it('should toggle the select field', () =>
      expect(component.addTemplateNameInput.nativeElement.focus).toHaveBeenCalledTimes(1));
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should close the dialog', () => expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
  });

  describe('addTemplate()', () => {
    beforeEach(() => {
      component.templateForm.patchValue({
        templateId: null,
        templateName: 'mock name',
        templateSubject: 'mock subject',
        templateBody: 'mock body',
      });
      component.addTemplate();
    });

    it('should dispatch CreateRejectToSenderTemplate action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new CreateRejectToSenderTemplate({
          sourceSystemBuyerId: '1',
          sourceSystemId: SearchContext.AvidSuite,
          templateName: 'mock name',
          templateSubjectLine: 'mock subject',
          notificationTemplate: 'mock body',
          isActive: true,
        })
      ));
  });

  describe('editTemplate()', () => {
    beforeEach(() => {
      component.templateForm.patchValue({
        templateId: '1',
        templateName: 'mock name',
        templateSubject: 'mock subject',
        templateBody: 'mock body',
      });
      component.editTemplate();
    });

    it('should dispatch EditRejectToSenderTemplate action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new EditRejectToSenderTemplate({
          sourceSystemBuyerId: '1',
          sourceSystemId: SearchContext.AvidSuite,
          templateName: 'mock name',
          templateSubjectLine: 'mock subject',
          notificationTemplate: 'mock body',
          templateId: '1',
          isActive: true,
        })
      ));
  });

  describe('deleteTemplate()', () => {
    describe('when a templateId is not passed in for deleteTemplate', () => {
      beforeEach(() => {
        component.templateForm.patchValue({
          templateId: '1',
        });
        component.deleteTemplate();
      });

      it('should dispatch DeleteRejectToSenderTemplate action using the forms templateId', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new DeleteRejectToSenderTemplate('1')));
    });

    describe('when a templateId is passed in for deleteTemplate', () => {
      beforeEach(() => {
        component.deleteTemplate('25');
      });

      it('should dispatch DeleteRejectToSenderTemplate action using passed in templateId', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new DeleteRejectToSenderTemplate('25')));
    });
  });

  describe('updateTemplate()', () => {
    const templateStub: RejectToSenderTemplate = {
      sourceSystemBuyerId: '1',
      sourceSystemId: SearchContext.AvidSuite,
      templateName: 'mock name',
      templateSubjectLine: 'mock subject',
      notificationTemplate: 'mock body',
      templateId: '1',
      isActive: true,
    };

    beforeEach(() => {
      component.updateTemplate(templateStub);
    });

    it('should update the templateForm with the passed in template values', () =>
      expect(component.templateForm.value).toEqual(
        expect.objectContaining({
          templateId: '1',
          templateName: 'mock name',
          templateSubject: 'mock subject',
          templateBody: 'mock body',
        })
      ));

    it('should set templateSelected flag to true', () =>
      expect(component.templateSelected).toBeTruthy());

    it('should set htmlTemplate variable to the passed in template.notificationTemplate value', () =>
      expect(component.htmlTemplate).toBe(templateStub.notificationTemplate));
  });

  describe('tabChanged()', () => {
    describe('when tab selected is index of 0', () => {
      const tabChangedEventStub = {
        index: 0,
      } as any;

      beforeEach(() => {
        jest.spyOn(component as any, 'resetForm');

        component.templateForm.patchValue({
          templateId: '1',
          templateName: 'mock name',
          templateSubject: 'mock subject',
          templateBody: 'mock body',
        });
        component.templateSelected = true;
        component.tabChanged(tabChangedEventStub);
      });

      it('should call resetForm fn', () => expect(component['resetForm']).toHaveBeenCalledTimes(1));

      it('should set forms values back to default values', () =>
        expect(component.templateForm.value).toEqual(
          expect.objectContaining({
            templateId: null,
            templateName: '',
            templateSubject: '',
            templateBody: '',
          })
        ));

      it('should set templateSelected flag to false', () =>
        expect(component.templateSelected).toBeFalsy());
    });

    describe('when tab selected is index other than 0', () => {
      const tabChangedEventStub = {
        index: 1,
      } as any;

      beforeEach(() => {
        jest.spyOn(component as any, 'resetForm');

        component.templateForm.patchValue({
          templateId: '1',
          templateName: 'mock name',
          templateSubject: 'mock subject',
          templateBody: 'mock body',
        });
        component.templateSelected = true;
        component.tabChanged(tabChangedEventStub);
      });

      it('should NOT call resetForm fn', () =>
        expect(component['resetForm']).not.toHaveBeenCalled());

      it('should NOT set forms values back to default values', () =>
        expect(component.templateForm.value).toEqual(
          expect.objectContaining({
            templateId: '1',
            templateName: 'mock name',
            templateSubject: 'mock subject',
            templateBody: 'mock body',
          })
        ));

      it('should NOT set templateSelected flag to false', () =>
        expect(component.templateSelected).toBeTruthy());
    });
  });
});
