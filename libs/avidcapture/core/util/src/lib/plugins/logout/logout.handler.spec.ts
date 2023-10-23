import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Actions, InitState, NgxsModule, Store, UpdateState } from '@ngxs/store';
import { of } from 'rxjs';

import { LogoutHandler } from './logout.handler';
import { LogoutService } from './logout.service';

const actionsStub = jest.fn(() => of());
const logoutServiceStub = {
  initialState: {
    pendingPage: {
      filters: {},
    },
  },
};

describe('LogoutHandler', () => {
  let handler: LogoutHandler;
  let store: Store;
  let logoutService: LogoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([], { developmentMode: true })],
      providers: [
        {
          provide: Actions,
          userValue: actionsStub,
        },
      ],
    });
    handler = TestBed.inject(LogoutHandler);
    store = TestBed.inject(Store);
    logoutService = TestBed.inject(LogoutService);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  describe('when InitState is called', () => {
    beforeEach(() => {
      logoutService.initialState = {};
      jest.spyOn(store, 'snapshot').mockImplementation(() => ({
        pendingPage: {
          filters: {},
        },
      }));
    });

    it('should update logoutService initialState with stored filters', fakeAsync(() => {
      store.dispatch(InitState);
      tick();
      expect(logoutServiceStub.initialState).toEqual({
        pendingPage: { filters: {} },
      });
    }));
  });

  describe('when UpdateState is called', () => {
    beforeEach(() => {
      logoutService.initialState = { pendipendingPagegQueue: { filters: {} } };
    });

    it('should update logoutService initialState', fakeAsync(() => {
      store.dispatch(UpdateState);
      tick();
      expect(logoutServiceStub.initialState).toEqual({
        pendingPage: { filters: {} },
      });
    }));
  });
});
