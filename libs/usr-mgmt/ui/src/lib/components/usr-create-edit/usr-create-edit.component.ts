import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ButtonTypes, FormFieldError } from '@ui-coe/shared/types';
import {
  ICreateEditUser,
  ICreateEditUserContent,
  ICreateEditUserEvent,
  ICreateEditUserToasterContent,
  ICreateUserForm,
  IUser,
} from '@ui-coe/usr-mgmt/shared/types';

@Component({
  selector: 'usr-create-edit',
  templateUrl: './usr-create-edit.component.html',
  styleUrls: ['./usr-create-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsrCreateEditComponent implements OnInit {
  userForm: FormGroup;
  @Input() opened: boolean;
  @Input() isEdit: boolean;
  @Input() content: ICreateEditUserContent;
  @Input() user: IUser;

  @Output() closeSideSheet = new EventEmitter<void>();
  @Output() save = new EventEmitter<ICreateEditUserEvent>();
  @Output() cancel = new EventEmitter<void>();

  default: ButtonTypes = ButtonTypes.secondary;
  primary: ButtonTypes = ButtonTypes.primary;

  ngOnInit(): void {
    this.userForm = new FormGroup<ICreateUserForm>({
      firstName: new FormControl(this.isEdit ? this.user.firstName : '', {
        validators: [Validators.required],
      }),
      lastName: new FormControl(this.isEdit ? this.user.lastName : '', {
        validators: [Validators.required],
      }),
      email: new FormControl(this.isEdit ? this.user.email : '', {
        validators: [Validators.required, Validators.email],
      }),
    });
  }

  buildErrorMessage(fieldName: string) {
    if (this.userForm.controls[fieldName].errors) {
      if (this.userForm.controls[fieldName].errors.required) {
        return this.requiredErrorMessage(fieldName);
      }
      if (this.userForm.controls[fieldName].errors.email) {
        return this.emailFormatErrorMessage();
      }
    }
  }

  requiredErrorMessage(fieldName: string): FormFieldError {
    return {
      message: `${this.content?.form?.[fieldName]?.requiredValidationErrorText}`,
      icon: 'warning',
    };
  }

  emailFormatErrorMessage(): FormFieldError {
    return {
      message: `${this.content?.form?.email.invalidFormatValidationErrorText}`,
      icon: 'warning',
    };
  }

  onSaveButtonClick(): void {
    const toastContent: ICreateEditUserToasterContent = this.isEdit
      ? this.content.toaster.edit
      : this.content.toaster.create;

    const formValue: ICreateEditUser = {
      ...this.userForm.value,
      username: this.userForm.value.email,
    };

    const createEditUserEvent: ICreateEditUserEvent = {
      formValue,
      toastSuccessText: toastContent.successText,
      toastFailureText: toastContent.failureText,
      isEdit: this.isEdit,
    };

    if (this.isEdit) {
      createEditUserEvent.id = this.user.userId;
    }

    this.save.emit(createEditUserEvent);
  }

  closeSideSheetClick(): void {
    this.userForm.reset();
    this.closeSideSheet.emit();
  }

  cancelButtonClicked(): void {
    this.userForm.reset();
    this.cancel.emit();
  }
}
