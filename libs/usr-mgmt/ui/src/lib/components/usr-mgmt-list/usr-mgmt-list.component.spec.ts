import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ButtonColors } from '@ui-coe/shared/types';
import { User } from '@ui-coe/shared/ui';
import { ButtonComponent, SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { IUser, UserRowAction, UserStatus } from '@ui-coe/usr-mgmt/shared/types';

import { UsrMgmtListComponent } from './usr-mgmt-list.component';

describe('UsrMgmtListComponent', () => {
  let component: UsrMgmtListComponent;
  let fixture: ComponentFixture<UsrMgmtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, ButtonComponent, SharedUiV2Module],
      declarations: [UsrMgmtListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsrMgmtListComponent);
    component = fixture.componentInstance;
    component.deactivateUserModal = { bodyText: 'Remove access for {{ user }}' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the value of displayedColumns with truthy value', () => {
    component.ngOnChanges({
      displayedColumns: {
        currentValue: {
          name: 'Name',
          email: 'Email',
          status: 'Status',
          actions: 'Actions',
        },
      },
    });

    expect(component.displayedColumns).toEqual(['Name', 'Email', 'Status', 'Actions']);
  });

  it('should not set the value of displayedColumns when changes is falsy', () => {
    component.ngOnChanges({});

    expect(component.displayedColumns).toBe(undefined);

    component.ngOnChanges({
      displayedColumns: undefined,
    });

    expect(component.displayedColumns).toBe(undefined);
  });

  describe('onDeactivateUser', () => {
    const user: IUser = {
      userId: 'fooId123',
      firstName: 'Peter',
      lastName: 'Parker',
      fullName: 'Peter Parker',
      email: 'spiderman@gmail.com',
      username: 'amazingSpiderMan',
      userType: 'External',
      status: UserStatus.ACTIVE,
      createdTimestamp: 'fooTime',
      createdByActorId: 'fooCreatedBy',
      lastModifiedTimestamp: 'fooLastMod',
      lastModifiedByActorId: 'fooLastModByActorId',
    };
    it('should open a dialogbox to deactivate an user', () => {
      const spy = jest.spyOn(component['dialog'], 'open');
      component.onDeactivateUserModal(user);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.dialogData.type).toEqual('alert');
      expect(component.dialogData.actionBtn.color).toEqual(ButtonColors.critical);
    });
  });

  describe('menuClicked', () => {
    const row: IUser = {
      userId: 'fooId123',
      firstName: 'Peter',
      lastName: 'Parker',
      fullName: 'Peter Parker',
      email: 'spiderman@gmail.com',
      username: 'amazingSpiderMan',
      userType: 'External',
      status: UserStatus.ACTIVE,
      createdTimestamp: 'fooTime',
      createdByActorId: 'fooCreatedBy',
      lastModifiedTimestamp: 'fooLastMod',
      lastModifiedByActorId: 'fooLastModByActorId',
    };

    const menuItem = {
      edit: UserRowAction.EDIT,
      deactivate: UserRowAction.DEACTIVATE,
      reactivate: UserRowAction.REACTIVATE,
      restPassword: UserRowAction.RESET_PASSWORD,
      resendInvite: UserRowAction.RESEND_INVITE,
      invite: UserRowAction.INVITE,
    };
    it('should open menu to select an action', () => {
      const spy = jest.spyOn(component, 'onDeactivateUserModal');
      component.menuClicked(menuItem.deactivate, row);
      expect(spy).toBeCalledWith(row);
    });
    it('should emit rowActionSlected when corresponding action is called', () => {
      const spy = jest.spyOn(component.rowActionSelected, 'emit');
      component.menuClicked(menuItem.edit, row);
      expect(spy).toBeCalledWith({ user: row, action: menuItem.edit });
    });
  });
});
