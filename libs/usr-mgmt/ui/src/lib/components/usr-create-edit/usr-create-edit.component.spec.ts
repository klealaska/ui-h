import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonComponent, InputComponent, SideSheetV2Component } from '@ui-coe/shared/ui-v2';
import {
  ICreateEditUserContent,
  ICreateEditUserEvent,
  IUser,
  UserStatus,
} from '@ui-coe/usr-mgmt/shared/types';

import { UsrCreateEditComponent } from './usr-create-edit.component';

describe('UsrCreateEditComponent', () => {
  let component: UsrCreateEditComponent;
  let fixture: ComponentFixture<UsrCreateEditComponent>;

  const content: ICreateEditUserContent = {
    form: {
      firstName: {
        labelText: 'First name',
        requiredValidationErrorText: 'first name is required',
      },
      lastName: {
        labelText: 'Last name',
        requiredValidationErrorText: 'last name is required',
      },
      email: {
        labelText: 'Email',
        requiredValidationErrorText: 'email is required',
        invalidFormatValidationErrorText: 'incorrect email format',
      },
    },
    saveButtonText: 'Save',
    cancelButtonText: 'Cancel',
    createTitle: 'Create User',
    editTitle: 'Edit user',
    toaster: {
      create: {
        successText: 'User created.',
        failureText: 'Network failure.',
      },
      edit: {
        successText: 'User updated.',
        failureText: 'Network failure.',
      },
    },
  };

  const id = '00u98v1wp5ONavBDt1d8';
  const user: IUser = {
    userId: id,
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    username: 'johndoe@example.com',
    userType: 'External',
    status: UserStatus.INACTIVE,
    createdTimestamp: '2021-10-03T12: 22: 13Z',
    createdByActorId: 'v1df1c37h7tp8u5dhzvn',
    lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
    lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsrCreateEditComponent],
      imports: [
        InputComponent,
        SideSheetV2Component,
        ButtonComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsrCreateEditComponent);
    component = fixture.componentInstance;
    component.content = content;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate error first name required message with undefined', () => {
    component.content = null;
    const name = component.requiredErrorMessage('firstName');
    expect(name).toStrictEqual({ icon: 'warning', message: 'undefined' });
  });

  it('should generate error  first name required message with defined content', () => {
    const name = component.requiredErrorMessage('lastName');
    expect(name).toStrictEqual({
      icon: 'warning',
      message: content.form.lastName.requiredValidationErrorText,
    });
  });

  it('should generate error  email invalid format message with defined content', () => {
    const name = component.emailFormatErrorMessage();
    expect(name).toStrictEqual({
      icon: 'warning',
      message: content.form.email.invalidFormatValidationErrorText,
    });
  });

  it('should generate error required message for field when invalid', () => {
    component.userForm.controls.lastName.setValue('');
    const spy = jest.spyOn(component, 'requiredErrorMessage');

    const lastName = component.buildErrorMessage('lastName');

    expect(lastName).toStrictEqual({
      icon: 'warning',
      message: content.form.lastName.requiredValidationErrorText,
    });
    expect(spy).toBeCalledWith('lastName');
  });

  it('should generate error invalid format email format message for field when invalid', () => {
    component.userForm.controls.email.setValue('email');
    const spy = jest.spyOn(component, 'emailFormatErrorMessage');

    const email = component.buildErrorMessage('email');
    expect(email).toStrictEqual({
      icon: 'warning',
      message: content.form.email.invalidFormatValidationErrorText,
    });
    expect(spy).toBeCalled();
  });

  it('should generate error required message for field when invalid', () => {
    component.userForm.controls.lastName.setValue('');
    const spy = jest.spyOn(component, 'requiredErrorMessage');

    const lastName = component.buildErrorMessage('lastName');

    expect(lastName).toStrictEqual({
      icon: 'warning',
      message: content.form.lastName.requiredValidationErrorText,
    });
    expect(spy).toBeCalledWith('lastName');
  });

  describe('userForm', () => {
    it('should default the value to empty string when isEdit is false', () => {
      component.isEdit = false;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.userForm.controls.firstName.value).toBe('');
      expect(component.userForm.controls.lastName.value).toBe('');
      expect(component.userForm.controls.email.value).toBe('');
    });

    it('should default the value to the user values when isEdit is true', () => {
      component.isEdit = true;
      component.user = user;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.userForm.controls.firstName.value).toBe(user.firstName);
      expect(component.userForm.controls.lastName.value).toBe(user.lastName);
      expect(component.userForm.controls.email.value).toBe(user.email);
    });
  });

  describe('onSaveButtonClick', () => {
    it('should emit an create event when isEdit is false', () => {
      const spy = jest.spyOn(component.save, 'emit');
      const createEditUserEvent: ICreateEditUserEvent = {
        formValue: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        },
        toastFailureText: content.toaster.create.failureText,
        toastSuccessText: content.toaster.create.successText,
        isEdit: false,
      };

      component.userForm.setValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      component.isEdit = false;
      fixture.detectChanges();

      component.onSaveButtonClick();
      expect(spy).toHaveBeenCalledWith(createEditUserEvent);
    });

    it('should emit an edit event when isEdit is true', () => {
      const spy = jest.spyOn(component.save, 'emit');
      const createEditUserEvent: ICreateEditUserEvent = {
        formValue: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        },
        toastFailureText: content.toaster.edit.failureText,
        toastSuccessText: content.toaster.edit.successText,
        isEdit: true,
        id,
      };

      component.userForm.setValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      component.isEdit = true;
      component.user = user;
      fixture.detectChanges();

      component.onSaveButtonClick();
      expect(spy).toHaveBeenCalledWith(createEditUserEvent);
    });
  });

  describe('closeSideSheetClick', () => {
    it('should reset the form and emit closeSideSheet', () => {
      const formSpy = jest.spyOn(component.userForm, 'reset');
      const closeSpy = jest.spyOn(component.closeSideSheet, 'emit');

      component.closeSideSheetClick();

      expect(formSpy).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('cancelButtonClicked', () => {
    it('should reset the form and emit cancel', () => {
      const formSpy = jest.spyOn(component.userForm, 'reset');
      const closeSpy = jest.spyOn(component.cancel, 'emit');

      component.cancelButtonClicked();

      expect(formSpy).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
