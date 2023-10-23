import { TestBed } from '@angular/core/testing';
import { NgxsModule, NGXS_PLUGINS, Store } from '@ngxs/store';
import { CoreStateMock } from '@ui-coe/avidcapture/shared/test';

import { NgxsLogoutPlugin } from './logout.plugin';
import { LogoutService } from './logout.service';

const logoutServiceStub = {
  initialState: {
    core: {
      featureFlags: [],
      orgIds: [],
      orgNames: [],
      token: null,
    },
  },
};

export class LogoutMock {
  static readonly type = '[CoreStateMock] LogoutMock';
}

describe('NgxsLogoutPlugin', () => {
  let plugin: NgxsLogoutPlugin;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([CoreStateMock], { developmentMode: true })],
      providers: [
        NgxsLogoutPlugin,
        {
          provide: LogoutService,
          useValue: logoutServiceStub,
        },
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsLogoutPlugin,
          multi: true,
        },
      ],
    });
    plugin = TestBed.inject(NgxsLogoutPlugin);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(plugin).toBeTruthy();
  });

  describe('handle()', () => {
    describe('when Logout action is called', () => {
      const stateStub = {
        core: {
          token: 'fakeToken',
          featureFlags: [
            {
              flag: 'fakeFlag',
            },
          ],
        },
      };

      beforeEach(() => {
        plugin.handle(stateStub, LogoutMock, jest.fn());
      });

      it('should set store to logoutServices initialState', () =>
        expect(store.snapshot()).toEqual(logoutServiceStub.initialState));
    });
  });
});
