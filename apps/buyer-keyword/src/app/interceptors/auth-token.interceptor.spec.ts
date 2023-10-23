import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { AuthService } from '@ui-coe/shared/util/auth';
import { of } from 'rxjs';

import { RefreshToken } from '../core/state/core.actions';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { expiredTokenStub } from '../../testing/test-token.stub';

const authServiceStub = {
  getAvidAuthLoginUrl: jest.fn(),
  getAccessToken: jest.fn(),
  refreshToken: jest.fn(),
  isTokenExpired: jest.fn(),
};

const storeMock = {
  selectSnapshot: jest.fn(),
  dispatch: jest.fn(),
} as any;

describe('AuthTokenInterceptor', () => {
  let interceptor: AuthTokenInterceptor;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthTokenInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthTokenInterceptor,
          multi: true,
        },
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
        {
          provide: Store,
          useValue: storeMock,
        },
      ],
    });

    interceptor = TestBed.inject(AuthTokenInterceptor);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept()', () => {
    it('should add an Authorization header to the request when token exists', () => {
      authServiceStub.getAccessToken.mockReturnValueOnce('mockToken');
      authServiceStub.isTokenExpired.mockReturnValueOnce(false);
      httpClient.get('/api').subscribe();
      const httpRequest = httpMock.expectOne('/api');

      expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer mockToken');
    });

    it('should atleast add an Authorization header to the request when token IS NULL', () => {
      httpClient.get('/api').subscribe();
      const httpRequest = httpMock.expectOne('/api');

      expect(httpRequest.request.headers.get('Authorization')).toContain('Bearer');
    });

    it('should atleast add an Authorization header to the request when url contains tokens', () => {
      httpClient.get('/tokens').subscribe();
      const httpRequest = httpMock.expectOne('/tokens');

      expect(httpRequest.request.headers.get('Authorization')).toContain('Bearer');
    });

    it('should atleast add an Authorization header to the request when url contains callback', () => {
      httpClient.get('/callback').subscribe();
      const httpRequest = httpMock.expectOne('/callback');

      expect(httpRequest.request.headers.get('Authorization')).toContain('Bearer');
    });

    it('should call refreshToken when error is a 401', () => {
      jest.spyOn(interceptor as any, 'refreshToken').mockImplementation();
      authServiceStub.getAccessToken.mockReturnValueOnce('mockToken');
      httpClient.get('/api').subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          expect(interceptor['refreshToken']).toHaveBeenCalledTimes(1);
        },
      });
      const httpRequest = httpMock.expectOne('/api');

      httpRequest.flush('error test', { status: 401, statusText: 'Unauthorized' });
    });

    it('should not call refreshToken when error is a 401 and URL is VOID', () => {
      jest.spyOn(interceptor as any, 'refreshToken').mockImplementation();
      authServiceStub.getAccessToken.mockReturnValueOnce('mockToken');
      authServiceStub.isTokenExpired.mockReturnValueOnce(true);
      httpClient.get('/void').subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
        },
      });
      const httpRequest = httpMock.expectOne('/void');

      httpRequest.flush('error test', { status: 401, statusText: 'Unauthorized' });
    });

    it('should throw error when status is anything other than 401', () => {
      jest.spyOn(interceptor as any, 'refreshToken').mockImplementation();
      authServiceStub.getAccessToken.mockReturnValueOnce('mockToken');
      authServiceStub.isTokenExpired.mockReturnValueOnce(false);
      httpClient.get('/api').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        },
      });
      const httpRequest = httpMock.expectOne('/api');

      httpRequest.flush('error test', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('private refreshToken()', () => {
    describe('when isRefreshingToken is false', () => {
      it('should get a new token from state after action dispatch', () => {
        authServiceStub.getAccessToken.mockReturnValueOnce('mockToken');
        jest.spyOn(interceptor as any, 'addTokenHeader').mockImplementation();
        jest.spyOn(interceptor['refreshTokenSubject'], 'next');
        storeMock.dispatch.mockReturnValue(
          of({
            core: {
              token: 'mockToken',
            },
          })
        );
        interceptor['isRefreshingToken'] = false;
        interceptor['refreshToken']();

        expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, new RefreshToken());
        expect(interceptor['isRefreshingToken']).toBeFalsy();
        expect(interceptor['refreshTokenSubject'].next).toHaveBeenNthCalledWith(2, 'mockToken');
      });
    });

    describe('when isRefreshingToken is true', () => {
      it('should use the behavior subject to populate bearer token', () => {
        jest.spyOn(interceptor as any, 'addTokenHeader').mockImplementation();
        interceptor['isRefreshingToken'] = true;
        interceptor['refreshTokenSubject'] = of('mockToken') as any;
        interceptor['refreshToken']();

        expect(storeMock.dispatch).not.toHaveBeenNthCalledWith(1, new RefreshToken());
      });
    });
  });

  describe('isTokenExpired', () => {
    it('Should returns false when token is expired', () => {
      expect(interceptor['isTokenExpired'](expiredTokenStub)).toBeTruthy();
    });
  });
});
