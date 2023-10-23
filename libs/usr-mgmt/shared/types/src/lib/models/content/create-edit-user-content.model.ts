export interface formItemContent {
  labelText: string;
  requiredValidationErrorText?: string;
  invalidFormatValidationErrorText?: string;
  hintText?: string;
}

export interface CreateEditUserFormContent {
  firstName: formItemContent;
  lastName: formItemContent;
  email: formItemContent;
}

export interface ICreateEditUserToasterContent {
  successText: string;
  failureText: string;
}

export interface ICreateEditUserContent {
  createTitle: string;
  editTitle: string;
  saveButtonText: string;
  cancelButtonText: string;
  form: CreateEditUserFormContent;
  toaster: {
    create: ICreateEditUserToasterContent;
    edit: ICreateEditUserToasterContent;
  };
}
