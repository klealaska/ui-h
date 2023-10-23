import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, take } from 'rxjs';

import { SubscriptionManagerService } from '@ui-coe/shared/util/services';
import { ToastComponent } from '@ui-coe/shared/ui-v2';
import {
  ContentKeys,
  ICreateEditUser,
  ICreateEditUserEvent,
  IRowAction,
  IUser,
  ToastContent,
  UserRowAction,
} from '@ui-coe/usr-mgmt/shared/types';
import { UserFacade } from '@ui-coe/usr-mgmt/data-access';

@Component({
  selector: 'usr-mgmt-list-container',
  templateUrl: './usr-mgmt-list-container.component.html',
  styleUrls: ['./usr-mgmt-list-container.component.scss'],
})
export class UsrMgmtListContainerComponent implements OnInit {
  pageTitle = ContentKeys.TITLE;
  addUserBtnLabel = ContentKeys.ADD_USER_BTN_LABEL;
  tableDisplayedColumns = ContentKeys.TABLE_DISPLAYED_COLUMNS;
  createEditSideSheetContent = ContentKeys.CREATE_EDIT_SIDE_SHEET;
  deactivateUserModal = ContentKeys.DEACTIVATE_USER_MODAL;
  reactivateUserModal = ContentKeys.REACTIVATE_USER_MODAL;
  statusTooltips = ContentKeys.TOOLTIPS;

  fontFamilySemibold = 'font-["inter-semibold"]';
  fontFamilyLight = 'font-["inter-light"]';

  opened = false;
  edit = false;
  userToEdit: IUser;

  users$: Observable<IUser[]> = this.userFacade.users$;

  private readonly _subKey = this.subManager.init();

  constructor(
    private userFacade: UserFacade,
    private subManager: SubscriptionManagerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subManager.add(this._subKey, this.userFacade.toast$, toastConfig => {
      if (toastConfig) {
        this.snackBar
          .openFromComponent(ToastComponent, toastConfig)
          .afterDismissed()
          .pipe(take(1))
          .subscribe(() => this.userFacade.dismissToast());
      }
    });
    this.userFacade.getUsers();
  }

  onRowActionSelected(event: IRowAction) {
    switch (event.action) {
      case UserRowAction.EDIT:
        this.onEditUser(event.user);
        break;
      case UserRowAction.RESET_PASSWORD:
        break;
      case UserRowAction.RESEND_INVITE:
        break;
      case UserRowAction.INVITE:
        break;
    }
  }

  onCreateNew(): void {
    this.edit = false;
    this.opened = true;
  }

  onEditUser(user: IUser): void {
    this.userToEdit = user;
    this.edit = true;
    this.opened = true;
  }

  onCloseSideSheet(): void {
    this.opened = false;
  }

  onSaveUser(createEditUser: ICreateEditUserEvent): void {
    const toastContent: ToastContent = {
      toastFailureText: createEditUser.toastFailureText,
      toastSuccessText: createEditUser.toastSuccessText,
    };

    if (createEditUser.isEdit) {
      this.userFacade.editUser(
        createEditUser.id,
        this.trimUser(createEditUser.formValue),
        toastContent
      );
    } else {
      this.userFacade.addUser(this.trimUser(createEditUser.formValue), toastContent);
    }

    this.opened = false;
  }

  trimUser(user: ICreateEditUser): ICreateEditUser {
    return {
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      email: user.email.trim(),
      username: user.email.trim(),
    };
  }

  onCancel(): void {
    this.opened = false;
  }

  onDeactivateUser(event: string): void {
    this.userFacade.deactivateUser(event);
  }
}
