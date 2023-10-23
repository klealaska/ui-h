import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule, Store } from '@ngxs/store';
import { QueryUsers, SetFilteredUsers } from '@ui-coe/avidcapture/admin/data-access';
import { AdminUsersFilterComponent, AdminUsersGridComponent } from '@ui-coe/avidcapture/admin/ui';
import { usersStub } from '@ui-coe/avidcapture/shared/test';
import { AddAdminUserComponent, User } from '@ui-coe/shared/ui';
import { MockComponents } from 'ng-mocks';

import { AdminUsersComponent } from './admin-users.component';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminUsersComponent,
        MockComponents(AdminUsersFilterComponent, AdminUsersGridComponent, AddAdminUserComponent),
      ],
      imports: [NgxsModule.forRoot([], { developmentMode: true }), MatButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onUserSelected()', () => {
    describe('when userSelected.status is Active', () => {
      beforeEach(() => {
        component.onUserSelected(usersStub[0]);
      });

      it('should add selectedUser to the user object', () =>
        expect(component.user).toEqual({ ...usersStub[0] }));

      it('should set showUserForm to true', () => expect(component.showUserForm).toBeTruthy());
    });

    describe('when userSelected.status is NOT Active', () => {
      beforeEach(() => {
        component.onUserSelected(usersStub[1]);
      });

      it('should not add selected user to the user object', () =>
        expect(component.user).toEqual({}));

      it('should keep showUserForm to false', () => expect(component.showUserForm).toBeFalsy());
    });
  });

  describe('setSearchValue', () => {
    describe('should dispatch setSearchValue action', () => {
      beforeEach(() => {
        component.setSearchValue('');
      });

      it('should dispatch searchFilteredCustomers action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetFilteredUsers('')));
    });
  });

  describe('queryRecycleBinDocuments', () => {
    describe('dispatch queryRecycleBinDocuments', () => {
      beforeEach(() => {
        component.queryUsers([]);
      });

      it('should dispatch the setFilteredCustomers action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryUsers([])));
    });
  });

  describe('addNewUser', () => {
    beforeEach(() => {
      component.showUserForm = false;
      component.user = null;
      component.addNewUser();
    });
    it('should open user form and create a user instance', () => {
      expect(component.showUserForm).toBeTruthy();
      expect(component.user).toBeDefined();
    });
  });

  describe('saveUser', () => {
    const userStub: User = usersStub[0];
    beforeEach(() => {
      component.showUserForm = true;
      component.saveUser(userStub);
    });
    it('should close user form', () => expect(component.showUserForm).toBeFalsy());
  });
});
