import { of, throwError } from 'rxjs';

import {
  NoOrgId,
  hasAllTheClaimsTokenStub,
  hasAllTheRolesTokenStub,
  hasNoClaimsTokenStub,
} from '../../../testing/test-token.stub';
import { UserPermissions } from '../../shared/enums';
import * as coreActions from './core.actions';
import { CoreState } from './core.state';
import { Dictionary } from '@ngrx/entity';

describe('CoreState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };

  const authServiceStub = {
    getAccessToken: jest.fn(),
    getAvidAuthLoginUrl: jest.fn(),
    refreshToken: jest.fn(),
  };

  const toastServiceStub = {
    warning: jest.fn(),
  };

  const translateServiceStub = {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    instant: (key: any) => {
      const stubObject: Dictionary<string> = {
        'bkws.coreState.noBuyerWarning':
          "Attention! There isn't a Buyer assigned to your user name.",
        'bkws.coreState.sessionExpired': 'Session expired',
      };
      return stubObject[key];
    },
  };

  const coreState = new CoreState(
    authServiceStub as any,
    toastServiceStub as any,
    translateServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should return state back for data', () => {
      expect(CoreState.data({ userAccount: { name: 'mock' } } as any)).toStrictEqual({
        userAccount: { name: 'mock' },
      });
    });
  });

  describe('Action: ngxsOnInit', () => {
    beforeEach(() => {
      coreState.ngxsOnInit(stateContextStub);
    });

    it('should dispatch StartWebSockets, QueryAllFeatureFlags, StartChameleon, & SetToken actions', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new coreActions.SetToken()));
  });

  describe('Action: SetToken', () => {
    describe('when token is null', () => {
      it('should not patchState for token or dispatch any actions after 5 tries', () => {
        authServiceStub.getAccessToken.mockReturnValue(null);
        coreState.setToken(stateContextStub);
        expect(authServiceStub.getAccessToken).toHaveBeenCalledTimes(1);
        expect(stateContextStub.patchState).not.toHaveBeenCalled();
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when token is empty string', () => {
      it('should not patchState for token or dispatch any actions after 5 tries', () => {
        authServiceStub.getAccessToken.mockReturnValue('');
        coreState.setToken(stateContextStub);
        expect(authServiceStub.getAccessToken).toHaveBeenCalledTimes(1);
        expect(stateContextStub.patchState).not.toHaveBeenCalled();
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when token has CanViewAllBuyers claim', () => {
      it('should patchState for token and dispatch HandleSponsorUser', () => {
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
        coreState.setToken(stateContextStub);

        expect(authServiceStub.getAccessToken).toHaveBeenCalledTimes(1);
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          token: hasAllTheClaimsTokenStub,
        });
      });
    });
  });

  describe('Action: QueryUserRoles', () => {
    describe('when orgIds is NULL', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          token: NoOrgId,
        });

        coreState.queryUserRoles(stateContextStub);
      });

      it('should patchState userRoles with some roles & orgIds with empty array', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          userRoles: [
            'ABS Training and Leads',
            'SponsorMgr',
            'PropReceiver',
            UserPermissions.PortalAdmin,
            'SponsorUsers',
            'AC.CustomerAdmin',
          ],
          orgIds: [],
        });
      });

      it('should show warning toast', () => {
        expect(toastServiceStub.warning).toHaveBeenNthCalledWith(
          1,
          "Attention! There isn't a Buyer assigned to your user name."
        );
      });
    });
  });

  describe('when orgIds is NOT NULL', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        token: hasAllTheRolesTokenStub,
      });

      coreState.queryUserRoles(stateContextStub);
    });

    it('should patchState userRoles with some roles & orgIds with empty array', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        userRoles: [
          'ABS Training and Leads',
          'SponsorMgr',
          'PropReceiver',
          'PortalAdmin',
          'SponsorUsers',
          'AC.CustomerAdmin',
        ],
        orgIds: ['25'],
      });
    });

    it('should not show warning toast', () => {
      expect(toastServiceStub.warning).not.toHaveBeenNthCalledWith(
        1,
        "Attention! There isn't a Buyer assigned to your user name."
      );
    });
  });

  describe('Action: RefreshToken', () => {
    describe('when refreshToken api returns successfully', () => {
      const token = {
        return_code: '',
        return_data: {
          access_token: hasAllTheClaimsTokenStub,
          expires_in: 0,
          id_token: '',
          scope: '',
          token_type: '',
          refresh_token: '',
        },
      };
      beforeEach(() => {
        authServiceStub.refreshToken.mockReturnValue(of(token));
        coreState.refreshToken(stateContextStub).subscribe();
      });

      it('should patch new refreshed token', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          token: hasAllTheClaimsTokenStub,
        });
      });
    });

    describe('when refreshToken api returns an error', () => {
      const mockedUrl = 'http://mocking.url.mock';

      Object.defineProperty(window, 'location', {
        writable: true,
        value: { replace: jest.fn() },
      });

      beforeEach(() => {
        authServiceStub.refreshToken.mockReturnValue(throwError(() => ({ status: 400 })));
        authServiceStub.getAvidAuthLoginUrl.mockReturnValue(mockedUrl);
      });

      it('should dispatch Logout action', done => {
        coreState.refreshToken(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new coreActions.Logout());
            expect(window.location.replace).toHaveBeenNthCalledWith(1, mockedUrl);
            done();
          },
        });
      });
    });

    describe('When refreshToken api return a token with no roles', () => {
      const mockedUrl = 'http://mocking.url.mock';
      const token = {
        return_code: '',
        return_data: {
          access_token: hasNoClaimsTokenStub,
          expires_in: 0,
          id_token: '',
          scope: '',
          token_type: '',
          refresh_token: '',
        },
      };
      beforeEach(() => {
        authServiceStub.refreshToken.mockReturnValue(of(token));
        coreState.refreshToken(stateContextStub).subscribe();
      });

      it('should dispatch Logout action', () => {
        expect(toastServiceStub.warning).toHaveBeenNthCalledWith(1, 'Session expired');
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new coreActions.Logout());
        expect(window.location.replace).toHaveBeenNthCalledWith(1, mockedUrl);
      });
    });
  });

  describe('Action: Logout', () => {
    beforeEach(() => {
      jest.spyOn(window.localStorage.__proto__, 'clear').mockImplementation();
      jest.spyOn(window.sessionStorage.__proto__, 'clear').mockImplementation();
      Object.defineProperty(window, 'location', {
        value: new URL('http://localhost/'),
      });
      coreState.logout();
    });

    it('should clear localStorage', () => expect(localStorage.clear).toHaveBeenCalled());

    it('should clear sessionStorage', () => expect(sessionStorage.clear).toHaveBeenCalled());

    it('should navigate to login page', () =>
      expect(window.location.href).toEqual('https://login.qa.avidsuite.com/'));
  });
});
