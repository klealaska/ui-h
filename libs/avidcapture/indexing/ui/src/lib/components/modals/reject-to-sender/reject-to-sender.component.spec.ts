import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { IndexedData, emailTemplateReplace } from '@ui-coe/avidcapture/shared/types';
import { TextEditorComponent } from '@ui-coe/avidcapture/shared/ui';
import { internalEscalationChoices } from '@ui-coe/avidcapture/shared/util';
import { ButtonComponent, InputComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';

import { RejectToSenderComponent } from './reject-to-sender.component';

const dialogRefStub = {
  close: jest.fn(),
};
const HTMLElements = {};
const matDialogDataStub = {
  templates: internalEscalationChoices,
  sourceEmail: 'test@user.com',
  indexedData: {
    dateReceived: '02/02/2022',
    labels: [{ label: 'sourceEmail', value: { text: 'mock@test.com' } }],
  },
};

describe('RejectToSenderComponent', () => {
  let component: RejectToSenderComponent;
  let fixture: ComponentFixture<RejectToSenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RejectToSenderComponent,
        MockPipe(TranslatePipe),
        MockComponent(TextEditorComponent),
      ],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        ButtonComponent,
        InputComponent,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        NgxsModule.forRoot([]),
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefStub,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: matDialogDataStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectToSenderComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should define the rejectToSenderForm', () =>
      expect(component.rejectToSenderForm).toBeDefined());
  });

  describe('ngAfterViewInit()', () => {
    jest.useFakeTimers();

    beforeEach(() => {
      fixture.detectChanges();
      component.matSelect = {
        toggle: jest.fn(),
      } as any;
      fixture.detectChanges();
      jest.advanceTimersByTime(100);
    });

    it('should toggle the select field', () =>
      expect(component.matSelect.toggle).toHaveBeenCalledTimes(1));
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should close dialog', () => expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
  });

  describe('send()', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.send();
    });

    it('should close dialog', () =>
      expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, component.rejectToSenderForm.value));
  });

  describe('selectTemplate', () => {
    describe('when templateName is not Duplicate Research', () => {
      const formBuilder = new FormBuilder();
      const formGroup = formBuilder.group({
        toEmailAddress: [''],
        templateId: [''],
        htmlBody: [''],
      });

      beforeEach(() => {
        mockGetElementById();
        component.rejectToSenderForm = formGroup;
        component.templates = [
          {
            templateId: '1',
            sourceSystemBuyerId: '',
            templateName: '',
            templateSubjectLine: '',
            notificationTemplate: 'mockTemplate',
          } as any,
        ];
        component.indexedData = {
          dateReceived: '02/02/2022',
          labels: [
            {
              label: 'sourceEmail',
              id: '',
              page: 0,
              value: {
                text: 'mock@test.com',
                confidence: 0,
                boundingBox: [0],
                required: false,
                verificationState: '',
                incomplete: false,
                incompleteReason: '',
                type: '',
              },
            },
          ],
        } as IndexedData;
        component.selectTemplate('1');
      });

      it('should get templateNotification with ID 1', () => {
        expect(component.notificationTemplate).toBe('mockTemplate');
      });

      it('should rejectToSenderForm get all the HTML temple', () => {
        expect(component.rejectToSenderForm.get('htmlBody').value).toBe('mockTemplate');
      });
    });

    describe('when templateName is Duplicate Research', () => {
      const formBuilder = new FormBuilder();
      const formGroup = formBuilder.group({
        toEmailAddress: [''],
        templateId: [''],
        htmlBody: [''],
      });

      beforeEach(() => {
        jest.spyOn(component, 'replaceText');
        mockGetElementById();
        component.rejectToSenderForm = formGroup;
        component.templates = [
          {
            templateId: '1',
            sourceSystemBuyerId: '',
            templateName: 'Duplicate Research',
            templateSubjectLine: '',
            notificationTemplate: 'mockTemplate',
          } as any,
        ];
        component.duplicateIndexedData = {
          dateReceived: '02/02/2022',
          labels: [
            {
              label: 'sourceEmail',
              id: '',
              page: 0,
              value: {
                text: 'mock@test.com',
                confidence: 0,
                boundingBox: [0],
                required: false,
                verificationState: '',
                incomplete: false,
                incompleteReason: '',
                type: '',
              },
            },
          ],
        } as IndexedData;

        component.selectTemplate('1');
      });

      it('should call replaceText fn', () =>
        expect(component.replaceText).toHaveBeenNthCalledWith(
          1,
          'mockTemplate',
          component.duplicateIndexedData,
          component.replaceData
        ));

      it('should get templateNotification with ID 1', () => {
        expect(component.notificationTemplate).toBe('mockTemplate');
      });

      it('should rejectToSenderForm get all the HTML temple', () => {
        expect(component.rejectToSenderForm.get('htmlBody').value).toBe('mockTemplate');
      });
    });
  });

  describe('updateTemplate', () => {
    const formBuilder = new FormBuilder();
    const formGroup = formBuilder.group({
      toEmailAddress: [''],
      templateId: [''],
      htmlBody: [''],
    });
    beforeEach(() => {
      component.rejectToSenderForm = formGroup;
      component.updateHtmlTemplate('update mockTemplate');
    });

    it('should rejectToSenderForm get all the HTML temple', () => {
      expect(component.rejectToSenderForm.get('htmlBody').value).toBe('update mockTemplate');
    });
  });

  describe('replaceText', () => {
    const replaceData = emailTemplateReplace;
    const emailTemplate = 'Mock template, {{DateReceived}} {{SubmitterEmailAddress}}';
    const indexedData = {
      dateReceived: '20220305',
      labels: [{ label: 'sourceEmail', value: { text: 'mock@test.com' } }],
    } as IndexedData;

    it('should get templateNotification with ID 1', () => {
      expect(component.replaceText(emailTemplate, indexedData, replaceData)).toBe(
        'Mock template, 03/05/2022 12:00AM mock@test.com'
      );
    });
  });

  function mockGetElementById(): void {
    document.getElementById = jest.fn(function (ID) {
      if (!HTMLElements[ID]) {
        const newElement = document.createElement('notificationTemplate');
        HTMLElements[ID] = newElement;
      }
      return HTMLElements[ID];
    });
  }
});
