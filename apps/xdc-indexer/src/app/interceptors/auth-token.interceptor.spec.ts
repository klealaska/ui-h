import { HttpClient, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { RefreshToken } from '@ui-coe/avidcapture/core/data-access';
import { SetPendingPageSignalEvents } from '@ui-coe/avidcapture/pending/data-access';
import { SetRecycleBinPageSignalEvents } from '@ui-coe/avidcapture/recycle-bin/data-access';
import { SetResearchPageSignalEvents } from '@ui-coe/avidcapture/research/data-access';
import { AppPages } from '@ui-coe/avidcapture/shared/types';
import { AuthService } from '@ui-coe/shared/util/auth';
import { of } from 'rxjs';

import { AuthTokenInterceptor } from './auth-token.interceptor';

const storeMock = {
  selectSnapshot: jest.fn(),
  dispatch: jest.fn(),
} as any;

const authServiceStub = {
  getAvidAuthLoginUrl: jest.fn(),
  getAccessToken: jest.fn(),
};

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
          provide: Store,
          useValue: storeMock,
        },
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
      ],
    });

    interceptor = TestBed.inject(AuthTokenInterceptor);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept()', () => {
    it('should add an Authorization header to the request when token exists', () => {
      authServiceStub.getAccessToken.mockReturnValueOnce('mockToken');
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

    it('should throw error when status is anything other than 401', () => {
      jest.spyOn(interceptor as any, 'refreshToken').mockImplementation();
      authServiceStub.getAccessToken.mockReturnValueOnce('mockToken');
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
        jest.spyOn(interceptor as any, 'restoreSignalREvents').mockImplementation();
        jest.spyOn(interceptor['refreshTokenSubject'], 'next');
        storeMock.dispatch.mockReturnValue(
          of({
            core: {
              token: 'mockToken',
              currentPage: AppPages.Queue,
            },
          })
        );
        interceptor['isRefreshingToken'] = false;
        interceptor['refreshToken']();

        expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, new RefreshToken());
        expect(interceptor['isRefreshingToken']).toBeFalsy();
        expect(interceptor['refreshTokenSubject'].next).toHaveBeenNthCalledWith(2, 'mockToken');
        expect(interceptor['restoreSignalREvents']).toHaveBeenNthCalledWith(1, AppPages.Queue);
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

  describe('private restoreSignalREvents()', () => {
    describe('when current page is PENDING QUEUE page', () => {
      beforeEach(() => {
        interceptor['restoreSignalREvents'](AppPages.Queue);
      });

      it('should call SetPendingPageSignalEvents action', () =>
        expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, new SetPendingPageSignalEvents()));
    });

    describe('when current page is RESEARCH QUEUE page', () => {
      beforeEach(() => {
        interceptor['restoreSignalREvents'](AppPages.Research);
      });

      it('should call SetResearchPageSignalEvents action', () =>
        expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, new SetResearchPageSignalEvents()));
    });

    describe('when current page is RECYCLE QUEUE page', () => {
      beforeEach(() => {
        interceptor['restoreSignalREvents'](AppPages.RecycleBin);
      });

      it('should call SetRecycleBinPageSignalEvents action', () =>
        expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, new SetRecycleBinPageSignalEvents()));
    });
  });
});
