import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { AxTranslateMockPipe } from '@ui-coe/shared/util/testing';
import { UsrMgmtUiModule } from '@ui-coe/usr-mgmt/ui';
import { translations } from '@ui-coe/usr-mgmt/shared/util';
import {
  ICreateEditUser,
  ICreateEditUserEvent,
  IRowAction,
  IUser,
  UserRowAction,
  UserStatus,
} from '@ui-coe/usr-mgmt/shared/types';

import { UsrMgmtListContainerComponent } from './usr-mgmt-list-container.component';

describe('UsrMgmtListContainerComponent', () => {
  let component: UsrMgmtListContainerComponent;
  let fixture: ComponentFixture<UsrMgmtListContainerComponent>;
  let store: MockStore;
  const initialState = {
    users: [],
    loading: false,
    error: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsrMgmtListContainerComponent],
      imports: [UsrMgmtUiModule, ButtonComponent, AxTranslateMockPipe],
      providers: [
        provideMockStore(),
        {
          provide: 'TRANSLATIONS',
          useValue: translations,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsrMgmtListContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUsers in OnInit', () => {
    const spy = jest.spyOn(component['userFacade'], 'getUsers');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  describe('onRowActionSelected', () => {
    it('should call onEditUser when passed edit action', () => {
      const spy = jest.spyOn(component, 'onEditUser').mockImplementation();
      const event: IRowAction = {
        user: {} as IUser,
        action: UserRowAction.EDIT,
      };

      component.onRowActionSelected(event);
      expect(spy).toHaveBeenCalledWith(event.user);
    });

    // TODO: add tests for other switch cases
  });

  it('should call onCreateNew', () => {
    const spy = jest.spyOn(component, 'onCreateNew');
    component.onCreateNew();
    expect(spy).toHaveBeenCalled();
    expect(component.opened).toBeTruthy();
    expect(component.edit).toBeFalsy();
  });

  it('should update userToEdit, edit, opened when onSelectUser is called', () => {
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

    component.onEditUser(user);
    expect(component.userToEdit).toEqual(user);
    expect(component.edit).toBeTruthy();
    expect(component.opened).toBeTruthy();
  });

  it('should call onCloseSideSheet', () => {
    const spy = jest.spyOn(component, 'onCloseSideSheet');
    component.onCloseSideSheet();
    expect(spy).toHaveBeenCalled();
    expect(component.opened).toBeFalsy();
  });

  it('should call onSaveUser', () => {
    const spy = jest.spyOn(component, 'onSaveUser');
    const spyTrim = jest.spyOn(component, 'trimUser');
    const spyFacade = jest.spyOn(component['userFacade'], 'addUser');
    const createUserEvent: ICreateEditUserEvent = {
      formValue: {
        firstName: 'John',
        lastName: 'Doe, Jr.',
        email: 'mail@mail.com',
        username: 'mail@mail.com',
      },
      toastFailureText: 'fail',
      toastSuccessText: 'success',
      isEdit: false,
    };

    component.onSaveUser(createUserEvent);

    expect(spy).toHaveBeenCalledWith(createUserEvent);
    expect(spyFacade).toBeCalled();
    expect(spyTrim).toBeCalledWith(createUserEvent.formValue);
    expect(component.opened).toBeFalsy();
  });

  it('should edit a user when isEdit is true', () => {
    const spy = jest.spyOn(component, 'onSaveUser');
    const spyTrim = jest.spyOn(component, 'trimUser');
    const spyFacade = jest.spyOn(component['userFacade'], 'editUser');
    const createUserEvent: ICreateEditUserEvent = {
      formValue: {
        firstName: 'John',
        lastName: 'Doe, Jr.',
        email: 'mail@mail.com',
        username: 'mail@mail.com',
      },
      toastFailureText: 'fail',
      toastSuccessText: 'success',
      isEdit: true,
    };

    component.onSaveUser(createUserEvent);

    expect(spy).toHaveBeenCalledWith(createUserEvent);
    expect(spyFacade).toBeCalled();
    expect(spyTrim).toBeCalledWith(createUserEvent.formValue);
    expect(component.opened).toBeFalsy();
  });

  it('should call trimUser', () => {
    const spy = jest.spyOn(component, 'trimUser');
    const user: ICreateEditUser = {
      firstName: ' John ',
      lastName: ' Doe, Jr. ',
      email: ' mail@mail.com ',
      username: ' mail@mail.com ',
    };

    const expected = component.trimUser(user);

    expect(spy).toHaveBeenCalledWith(user);
    expect(expected).toStrictEqual({
      firstName: 'John',
      lastName: 'Doe, Jr.',
      email: 'mail@mail.com',
      username: 'mail@mail.com',
    });
  });

  it('should call onCancel', () => {
    const spy = jest.spyOn(component, 'onCancel');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
    expect(component.opened).toBeFalsy();
  });

  it('should call onDeactivateUser', () => {
    const event = 'Deactivate';
    const spyFacade = jest.spyOn(component['userFacade'], 'deactivateUser');
    component.onDeactivateUser(event);
    expect(spyFacade).toBeCalled();
  });
});
