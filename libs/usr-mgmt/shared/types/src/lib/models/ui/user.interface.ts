import { FormControl } from '@angular/forms';
import { UserStatus } from '../../enums/user-status-type.enum';

export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  userType: string;
  status: UserStatus;
  createdTimestamp: string;
  createdByActorId: string;
  lastModifiedTimestamp: string;
  lastModifiedByActorId: string;
}

export interface ICreateEditUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface ICreateUserForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
}

export interface ICreateEditUserEvent {
  formValue: ICreateEditUser;
  toastSuccessText: string;
  toastFailureText: string;
  isEdit: boolean;
  id?: string;
}

export type UserLifecycleOperationsType = 'Activate' | 'Deactivate' | 'ExpirePassword';
