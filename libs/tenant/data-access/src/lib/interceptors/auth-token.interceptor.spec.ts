import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { AuthTokenInterceptor } from './auth-token.interceptor';
import { AuthFacade } from '@ui-coe/shell/navigation/data-access';
import { of } from 'rxjs';

const token =
  'eyJraWQiOiJEY1prUmxHcHF2TmR0YVN0V0syTzE1VEFYZ0JRVzlwV0o5anp3R3FYODRvIiwiYWxnIjoiUlMyNTYifQ.eyJ1aWQiOiJyZ2E2NWJiNmMwMGYzYjF3bWlkbiIsImVudGVycHJpc2VJZCI6WyI3cXZtbnc1bmZ1cG1iNmo5Z3A2bSJdfQ==.kHCf3fPM4UfhVoAaOQToZQ6eRB9DA55FVszLEvvfidLGbbUbxVJSOGVqMXvrcfodzNsmtGwKdJqUMPX6RZYh1wF9f57E2ZqGg18D4nzFAhADKYNbipsHF2ioXtcSyY7Le0hob_0COJh5_QXSiEID8lqYgTyThrtF8ltL99xdr2JgclR63nTGkMwF-zsbF8Mb4Bykr7MbuDHtN63AlxVuHjdaWmHola7vgqqHYS0M1IIb2I0S_8DwZHGncFVh_o5JV7Qq4G8qDTn_YiR7FC45QHRB0qitI480Sr_9IganidPmGIY5ZVJJNQRV7ghF5uLXcbkP-0GzYITg57cKOJpYKA';

describe('AuthTokenInterceptor', () => {
  let interceptor: AuthTokenInterceptor;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authFacade: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthTokenInterceptor,
        AuthFacade,
        provideMockStore(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthTokenInterceptor,
          multi: true,
        },
      ],
    });
    interceptor = TestBed.inject(AuthTokenInterceptor);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authFacade = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add the Authorization header', () => {
    authFacade.authToken$ = of(token);
    httpClient.get('/tenant').subscribe();
    const req = httpMock.expectOne('/tenant');

    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should not add the Authorization header ', () => {
    httpClient.get('/assets/i18').subscribe();
    const req = httpMock.expectOne('/assets/i18');

    expect(req.request.headers.get('Authorization')).toBeFalsy();
  });
});
