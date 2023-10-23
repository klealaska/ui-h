import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as UserActions from './user.actions';
import * as fromUser from './user.reducer';
import { UserFacade } from './user.facade';

describe('UserFacade', () => {
  let facade: UserFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromUser.userFeatureKey, fromUser.reducer),
      ],
      providers: [UserFacade],
    });
    facade = TestBed.inject(UserFacade);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should get Users', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.getUsers();
    expect(spy).toHaveBeenCalledWith(UserActions.loadUsers({}));
  });

  it('should add User', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const user = { firstName: 'test', lastName: 'test', email: 'mail@mail', username: 'mail@mail' };
    const content = { toastFailureText: 'fail', toastSuccessText: 'success' };
    facade.addUser(user, content);
    expect(spy).toHaveBeenCalledWith(UserActions.addUser({ body: user, toastContent: content }));
  });

  it('should edit a user', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const id = '1234';
    const body = { firstName: 'test', lastName: 'test', email: 'mail@mail', username: 'mail@mail' };
    const toastContent = { toastFailureText: 'fail', toastSuccessText: 'success' };
    facade.editUser(id, body, toastContent);
    expect(spy).toHaveBeenCalledWith(UserActions.editUser({ id, body, toastContent }));
  });

  it('should dismiss toast', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.dismissToast();
    expect(spy).toHaveBeenCalledWith(UserActions.dismissToast());
  });

  it('should deactivate User', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const userId = 'fooId';

    facade.deactivateUser(userId);
    expect(spy).toHaveBeenCalledWith(UserActions.deactivateUser({ userId: userId }));
  });
});
