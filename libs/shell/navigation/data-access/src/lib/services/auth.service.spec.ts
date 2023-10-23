import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TokenResponse } from '../models';
import { AuthService } from './auth.service';
import { AppName } from '../enums/app-name';
import { CallbackData } from '../models/login-callback-config';
import { AuthFacade } from '../+state/auth/auth.facade';
import { ConfigService } from '@ui-coe/shared/util/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const httpStub = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const routerStub = {
  navigateByUrl: jest.fn(),
  navigate: jest.fn(),
};

const configStuf = {
  getShell: jest.fn(),
};

const callBackData: CallbackData = {
  avidAuthBaseUrl: 'https://login.qa.avidsuite.com',
  state: 'state',
  code: 'code',
  redirectUrl: 'dashboard',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        AuthFacade,
        { provide: HttpClient, useValue: httpStub },
        { provide: Router, useValue: routerStub },
        ConfigService,
      ],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Disable logout tests for now until logout gets better implementation

  // describe('logout', () => {
  //   it('should clear sessionStorage tokens', () => {
  //     const mockAvidAuthUrl = 'https://auth.example.com';
  //     spyOn(shellConfigService, 'get').and.returnValue(mockAvidAuthUrl);

  //     jest.spyOn(window.sessionStorage.__proto__, 'removeItem');
  //     jest.spyOn(window.localStorage.__proto__, 'removeItem');
  //     window.sessionStorage.__proto__.setItem = jest.fn();
  //     window.localStorage.__proto__.setItem = jest.fn();
  //     service.logout();
  //     expect(sessionStorage.removeItem).toHaveBeenCalled();
  //     expect(localStorage.removeItem).toHaveBeenCalled();
  //   });

  //   it('should clear localStorage refreshToken', () => {
  //     const mockAvidAuthUrl = 'https://auth.example.com';
  //     spyOn(shellConfigService, 'get').and.returnValue(mockAvidAuthUrl);

  //     jest.spyOn(window.localStorage.__proto__, 'removeItem');
  //     window.localStorage.__proto__.setItem = jest.fn();
  //     service.logout();
  //     expect(localStorage.removeItem).toHaveBeenCalled();
  //   });
  // });

  describe('isLoggedIn', () => {
    it('should return true when tokens are found', () => {
      jest.spyOn(window.sessionStorage.__proto__, 'getItem');
      window.sessionStorage.__proto__.getItem = jest
        .fn()
        .mockImplementationOnce(() => '{ "access_token": "test" }');
      expect(service.isLoggedIn()).toBeTruthy();
    });

    it('should return false when tokens are NOT found', () => {
      jest.spyOn(window.sessionStorage.__proto__, 'getItem');
      window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() => null);
      expect(service.isLoggedIn()).toBeFalsy();
    });
  });

  describe('getAccessToken', () => {
    it('should return access token as string', () => {
      jest.spyOn(window.sessionStorage.__proto__, 'getItem');
      window.sessionStorage.__proto__.getItem = jest
        .fn()
        .mockImplementationOnce(() => '{ "access_token": "test" }');
      expect(service.getAccessToken()).toEqual('test');
    });

    it('should return undefined when token not in sessionStorage', () => {
      jest.spyOn(window.sessionStorage.__proto__, 'getItem');
      window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() => '');
      expect(service.getAccessToken()).toEqual('');
    });

    it('should return null when token is null', () => {
      jest.spyOn(window.sessionStorage.__proto__, 'getItem');
      window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() => null);
      expect(service.getAccessToken()).toEqual('');
    });

    it('should return null when access token is null', () => {
      jest.spyOn(window.sessionStorage.__proto__, 'getItem');
      window.sessionStorage.__proto__.getItem = jest
        .fn()
        .mockImplementationOnce(() => '{ "access_token": "" }');
      expect(service.getAccessToken()).toEqual('');
    });
  });

  describe('getUserInfo', () => {
    it('should return UserAccount', () => {
      jest.spyOn(window.sessionStorage.__proto__, 'getItem');
      window.sessionStorage.__proto__.getItem = jest
        .fn()
        .mockImplementationOnce(
          () =>
            '{ "id_token": "eyJraWQiOiI1Y0FIcHlUb2VMckpEOFoza0hCekNWbHp2VDZzMGUzLUVZd2R0SFNTU1pZIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMHUxM3Bqam1qeExOUG9IOTFkNyIsIm5hbWUiOiJsaW5nZXNoOTAzIHBhbGFuaSIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9hdmlkeGNoYW5nZS5va3RhcHJldmlldy5jb20vb2F1dGgyL2F1c3IwaWR5ZHVDbEpUaE9KMWQ2IiwiYXVkIjoiMG9hbm05bHN2OWo3ZE5KWVUxZDYiLCJpYXQiOjE2NTEwODgyNjAsImV4cCI6MTY1MTA5MTg2MCwianRpIjoiSUQudTM5QjJFNzQyd2lHWi10LTl5NHBwYVYySTFnczFlWHpvbWt2ZXdGdk0zMCIsImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvMmoycHFxYjhXQXNKajExZDYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJsaW5nZXNoOTAzLVFBQGdtYWlsLmNvbSIsImF1dGhfdGltZSI6MTY1MTA4ODI1MSwiYXRfaGFzaCI6Im5nSkFJaFY3Yk1sVF9Ea1NMNDhuR2cifQ.KhjQTF7pJ9TVdw58A3491q7JRLWF0n_p25tH5hX3-PqIY-NztP9RZFyIcOlGBJUGoZw2X_NgBG-2QVlIiynoyXDj8nkS7Z6sLi-4mpwLinQA9TyP4NuaPmPJOJ1QyW0UdNSKVpkFcg_-MhQP2d49u5HNnIwg2PxmLRafqCy5Jm9yk7nUqLjOndZcwtbr8Rb7vqyBL2URyok0wzOfbNzPqBoM4jEt7Zu2PBGcLCQTnbgQgfVAo_wcWEyAjdkf4UxLPplMWPrdAmbnyiJo7P9GjqboFoWfDF6wWCYoWGfwKDBGmZw5OA8zzwwt3U3-TLDC8IzQpD6rJL2mo3fZkvLHuQ" }'
        );
      expect(service.getUserInfo()?.name).toEqual('lingesh903 palani');
    });

    it('should return null when tokenDetail is null', () => {
      jest.spyOn(window.sessionStorage.__proto__, 'getItem');
      window.sessionStorage.__proto__.getItem = jest
        .fn()
        .mockImplementationOnce(() => '{ "id_token": "" }');
      expect(service.getUserInfo()).toBeNull();
    });
  });

  describe('getAvidAuthLoginUrl', () => {
    it('should return login url', () =>
      expect(
        service.getAvidAuthLoginUrl('https://login.qa.avidsuite.com', AppName.DataCapture)
      ).toEqual(
        'https://login.qa.avidsuite.com/auth/login?to_app=DataCapture&sso_callback=http://localhost/login/callback'
      ));
  });

  describe('handleSsoCallback', () => {
    const tokens =
      '{"token_type":"Bearer","expires_in":300,"access_token":"eyJraWQiOiI1Y0FIcHlUb2VMckpEOFoza0hCekNWbHp2VDZzMGUzLUVZd2R0SFNTU1pZIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmhFQW96by1FaEEwa2V6V0tHS0V3Q1B6bldFeEdtSzZZc0FQS2d1YUdUNFUub2FyamIwZDF4OEhvb1czR0QxZDYiLCJpc3MiOiJodHRwczovL2F2aWR4Y2hhbmdlLm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzcjBpZHlkdUNsSlRoT0oxZDYiLCJhdWQiOiJBdmlkQXV0aDovL0RhdGFDYXB0dXJlIiwiaWF0IjoxNjUxMDg4MjYwLCJleHAiOjE2NTEwODg1NjAsImNpZCI6IjBvYW5tOWxzdjlqN2ROSllVMWQ2IiwidWlkIjoiMDB1MTNwamptanhMTlBvSDkxZDciLCJzY3AiOlsib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIiwib3BlbmlkIl0sImF1dGhfdGltZSI6MTY1MTA4ODI1MSwiSXNJbnRlcm5hbFVzZXIiOiJ0cnVlIiwic3ViIjoibGluZ2VzaDkwMy1RQUBnbWFpbC5jb20iLCJvcmdJZCI6WyJvcmcuMSJdLCJhcHBzIjpbIkF2aWRTdWl0ZSIsIkRhdGFDYXB0dXJlIl19.OctZjAVP2CQ56HeLb7V8Dj2WzFZO_uXDiN6WQrK0rf8QE0DGFiXzOkYqAdx6DKPC6mQ9DHyKZ707QxZLD-7TFxfprN-oKrCxQ8PQMzyA9LOZ1nWWpggTS3PO-jGkbChgCp9DCLqnUBov7BrI7_fdi40zLkzTtihz00-FJZscsQQxzUX5yzczbsqSLo9mejCiQpK_M9ITwHFd6NjyFD18NND-AAHWGzqVyZ-koMCCA17pBG-xFJzsOEIpuRnit0GqgzxiNIK7HyTLlFnZMy8aFtekNTEEDLcE8PQmuu1CMpD9l5KPNhD1CMj1RakWLCPKQQrvKklns0j6T0qeNpy_sg","scope":"offline_access profile openid","id_token":"eyJraWQiOiI1Y0FIcHlUb2VMckpEOFoza0hCekNWbHp2VDZzMGUzLUVZd2R0SFNTU1pZIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMHUxM3Bqam1qeExOUG9IOTFkNyIsIm5hbWUiOiJsaW5nZXNoOTAzIHBhbGFuaSIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9hdmlkeGNoYW5nZS5va3RhcHJldmlldy5jb20vb2F1dGgyL2F1c3IwaWR5ZHVDbEpUaE9KMWQ2IiwiYXVkIjoiMG9hbm05bHN2OWo3ZE5KWVUxZDYiLCJpYXQiOjE2NTEwODgyNjAsImV4cCI6MTY1MTA5MTg2MCwianRpIjoiSUQudTM5QjJFNzQyd2lHWi10LTl5NHBwYVYySTFnczFlWHpvbWt2ZXdGdk0zMCIsImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvMmoycHFxYjhXQXNKajExZDYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJsaW5nZXNoOTAzLVFBQGdtYWlsLmNvbSIsImF1dGhfdGltZSI6MTY1MTA4ODI1MSwiYXRfaGFzaCI6Im5nSkFJaFY3Yk1sVF9Ea1NMNDhuR2cifQ.KhjQTF7pJ9TVdw58A3491q7JRLWF0n_p25tH5hX3-PqIY-NztP9RZFyIcOlGBJUGoZw2X_NgBG-2QVlIiynoyXDj8nkS7Z6sLi-4mpwLinQA9TyP4NuaPmPJOJ1QyW0UdNSKVpkFcg_-MhQP2d49u5HNnIwg2PxmLRafqCy5Jm9yk7nUqLjOndZcwtbr8Rb7vqyBL2URyok0wzOfbNzPqBoM4jEt7Zu2PBGcLCQTnbgQgfVAo_wcWEyAjdkf4UxLPplMWPrdAmbnyiJo7P9GjqboFoWfDF6wWCYoWGfwKDBGmZw5OA8zzwwt3U3-TLDC8IzQpD6rJL2mo3fZkvLHuQ","refreshToken":"V0DNly2SO4ZCU0DyMOS8ncWM7Oq-IbhTvQp_WgY-LDc"}';
    const refreshToken = 'V0DNly2SO4ZCU0DyMOS8ncWM7Oq-IbhTvQp_WgY-LDc';
    describe('no redirectUrl saved in sessionStorage', () => {
      beforeEach(() => {
        jest.spyOn(window.sessionStorage.__proto__, 'setItem');
        jest.spyOn(window.localStorage.__proto__, 'setItem');
        window.sessionStorage.__proto__.setItem = jest.fn().mockImplementationOnce(() => tokens);
        window.localStorage.__proto__.setItem = jest
          .fn()
          .mockImplementationOnce(() => refreshToken);
      });

      it('should navigate to passed redirectUrl', () => {
        httpStub.post.mockReturnValueOnce(
          of({
            return_data: {
              tokens: JSON.parse(tokens),
            },
          } as TokenResponse)
        );
        service.handleSsoCallback(callBackData);

        expect(httpStub.post).toHaveBeenCalled();
        expect(sessionStorage.setItem).toHaveBeenCalledWith('tokens', tokens);
        // expect(routerStub.navigateByUrl).toHaveBeenCalledWith(['dashboard']);
      });

      it('should catch error calling getAuthToken', () => {
        httpStub.post.mockReturnValueOnce(throwError({ status: 500 }));
        service.handleSsoCallback(callBackData);
        expect(httpStub.post).toHaveBeenCalled();
        expect(sessionStorage.setItem).not.toHaveBeenCalledWith('tokens', tokens);
        expect(localStorage.setItem).not.toHaveBeenCalledWith('refreshToken', refreshToken);
        expect(routerStub.navigateByUrl).not.toHaveBeenCalledWith(['dashboard']);
      });

      it('should not call actions when post response is empty', () => {
        httpStub.post.mockReturnValueOnce(of(null));
        service.handleSsoCallback(callBackData);
        expect(httpStub.post).toHaveBeenCalled();
        expect(sessionStorage.setItem).not.toHaveBeenCalledWith('tokens', tokens);
        expect(localStorage.setItem).not.toHaveBeenCalledWith('refreshToken', refreshToken);
        expect(routerStub.navigateByUrl).not.toHaveBeenCalledWith(['dashboard']);
      });

      it('should not call actions when post response return_data is empty', () => {
        httpStub.post.mockReturnValueOnce(
          of({
            return_data: {},
          } as TokenResponse)
        );
        service.handleSsoCallback(callBackData);
        expect(httpStub.post).toHaveBeenCalled();
        expect(sessionStorage.setItem).not.toHaveBeenCalledWith('tokens', tokens);
        expect(routerStub.navigateByUrl).not.toHaveBeenCalledWith(['dashboard']);
      });

      it('should not call actions when post response tokens is empty', () => {
        httpStub.post.mockReturnValueOnce(
          of({
            return_data: {
              tokens: null,
            },
          })
        );
        service.handleSsoCallback(callBackData);
        expect(httpStub.post).toHaveBeenCalled();
        expect(sessionStorage.setItem).not.toHaveBeenCalledWith('tokens', tokens);
        expect(routerStub.navigateByUrl).not.toHaveBeenCalledWith(['dashboard']);
      });
    });

    describe('requested_url tests', () => {
      beforeEach(() => {
        Object.defineProperty(window, 'location', {
          value: new URL('http://localhost/dashboard'),
        });
        jest.spyOn(window.sessionStorage.__proto__, 'setItem');
        window.sessionStorage.__proto__.setItem = jest.fn().mockImplementationOnce(() => tokens);
      });

      it('should redirect to requested_url', () => {
        httpStub.post.mockReturnValueOnce(
          of({
            return_data: {
              requested_url: 'http://localhost/dashboard',
              tokens: JSON.parse(tokens),
            },
          } as TokenResponse)
        );
        service.handleSsoCallback(callBackData);

        expect(httpStub.post).toHaveBeenCalled();
        expect(sessionStorage.setItem).toHaveBeenCalledWith('tokens', tokens);
        expect(window.location.href).toEqual('http://localhost/dashboard');
      });

      it('should redirect to default redirect url when requested_url is null', () => {
        httpStub.post.mockReturnValueOnce(
          of({
            return_data: {
              requested_url: null,
              tokens: JSON.parse(tokens),
            },
          } as TokenResponse)
        );
        service.handleSsoCallback(callBackData);

        expect(httpStub.post).toHaveBeenCalled();
        expect(sessionStorage.setItem).toHaveBeenCalledWith('tokens', tokens);
        // expect(routerStub.navigateByUrl).toHaveBeenCalledWith('dashboard']);
      });
    });
  });

  describe('refreshToken', () => {
    const tokens = '{"token_type":"Bearer","expires_in":300,"access_token":"mockToken"}';

    beforeEach(() => {
      jest.spyOn(service as any, 'saveToken');
      httpStub.post.mockImplementationOnce(() =>
        of({
          return_data: {
            tokens: JSON.parse(tokens),
          },
        } as TokenResponse)
      );
    });

    it('should call refresh token API', () => {
      service
        .refreshToken('https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/')
        .subscribe();

      expect(httpStub.post).toHaveBeenCalled();
      expect(service['saveToken']).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'ngOnDestroy');
      service['subscriptions'].push(of().subscribe());
      service.ngOnDestroy();
    });

    it('should call ngOnDestroy sucessfully', () => expect(service.ngOnDestroy).toHaveBeenCalled());
  });
});
