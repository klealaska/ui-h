import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import * as actions from './admin-users-page.actions';

describe('Archive Page Actions', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  describe('InitAdminUsersPage', () => {
    beforeEach(() => store.dispatch(new actions.InitAdminUsersPage()));

    it('should dispatch InitArchiveInInitAdminUsersPagevoicePage action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.InitAdminUsersPage());
    });
  });

  describe('SetFilteredUsers', () => {
    beforeEach(() => store.dispatch(new actions.SetFilteredUsers('1')));

    it('should dispatch SetFilteredUsers action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetFilteredUsers('1'));
    });
  });

  describe('QueryUsers', () => {
    beforeEach(() => store.dispatch(new actions.QueryUsers([])));

    it('should dispatch QueryUsers action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryUsers([]));
    });
  });
});
