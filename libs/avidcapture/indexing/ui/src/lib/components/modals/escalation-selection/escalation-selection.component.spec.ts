import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { internalEscalationChoices } from '@ui-coe/avidcapture/shared/util';
import { ButtonComponent, TextareaComponent } from '@ui-coe/shared/ui-v2';
import { MockPipe } from 'ng-mocks';

import { EscalationSelectionComponent } from './escalation-selection.component';

const dialogRefStub = {
  close: jest.fn(),
};

const matDialogDataStub = {
  dropdownOptions: internalEscalationChoices,
  escalationCategory: 'Internal QA',
};

describe('EscalationSelectionComponent', () => {
  let component: EscalationSelectionComponent;
  let fixture: ComponentFixture<EscalationSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EscalationSelectionComponent, MockPipe(TranslatePipe)],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        ButtonComponent,
        TextareaComponent,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: matDialogDataStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationSelectionComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when dropdownOptions has more than one option', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should set escalationChoices to internalEscalationChoices', () =>
        expect(component.dropdownOptions).toEqual(internalEscalationChoices));

      it('should set escalation title to escalationCategory', () =>
        expect(component.title).toEqual('Internal QA'));

      it('should instantiate markAsEscalationForm', () =>
        expect(component.markAsEscalationForm.value).toEqual({
          selectedValue: '',
          comment: '',
        }));
    });

    describe('when dropdownOptions has only one option', () => {
      beforeEach(() => {
        matDialogDataStub.dropdownOptions = [{ text: 'Mock', value: 'mock' }];
        fixture.detectChanges();
      });
      afterAll(() => (matDialogDataStub.dropdownOptions = internalEscalationChoices));

      it('should instantiate markAsEscalationForm', () =>
        expect(component.markAsEscalationForm.value).toEqual({
          selectedValue: component.dropdownOptions[0].value,
          comment: '',
        }));
    });
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

    it('should close dialog', () => expect(dialogRefStub.close).toHaveBeenCalled());
  });

  describe('confirm()', () => {
    beforeEach(() => fixture.detectChanges());
    describe('when dropdownOptions is NOT empty & when comment is left blank', () => {
      beforeEach(() => {
        component.markAsEscalationForm
          .get('selectedValue')
          .setValue(internalEscalationChoices[0].value);
        component.confirm();
      });

      it('should close dialog with a returnValue for selectedValue & comment with an empty string', () =>
        expect(dialogRefStub.close).toHaveBeenCalledWith({
          selectedValue: internalEscalationChoices[0].value,
          comment: '',
        }));
    });

    describe('when dropdownOptions is NOT empty & when comment has a value', () => {
      beforeEach(() => {
        component.markAsEscalationForm
          .get('selectedValue')
          .setValue(internalEscalationChoices[0].value);
        component.markAsEscalationForm.get('comment').setValue('fake comment');
        component.confirm();
      });

      it('should close dialog with a returnValue of values for selectedValue & comment', () =>
        expect(dialogRefStub.close).toHaveBeenCalledWith({
          selectedValue: internalEscalationChoices[0].value,
          comment: 'fake comment',
        }));
    });

    describe('when dropdownOptions is empty & no comment was left', () => {
      beforeEach(() => {
        component.dropdownOptions = [];
        component.confirm();
      });

      it('should close dialog with a returnValue of empty strings for selectedValue & comment', () =>
        expect(dialogRefStub.close).toHaveBeenCalledWith({
          selectedValue: '',
          comment: '',
        }));
    });

    describe('when dropdownOptions is empty but a comment was left', () => {
      beforeEach(() => {
        component.dropdownOptions = [];
        component.markAsEscalationForm.get('comment').setValue('fake comment');
        component.confirm();
      });

      it('should close dialog with a returnValue of empty string for selectedValue & comment with a value', () =>
        expect(dialogRefStub.close).toHaveBeenCalledWith({
          selectedValue: '',
          comment: 'fake comment',
        }));
    });
  });
});
