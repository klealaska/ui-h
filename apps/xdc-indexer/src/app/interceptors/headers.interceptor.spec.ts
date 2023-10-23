import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Headers } from '@ui-coe/avidcapture/shared/types';

import { HeadersInterceptor } from './headers.interceptor';

describe('HeadersInterceptor', () => {
  let interceptor: HeadersInterceptor;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeadersInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HeadersInterceptor,
          multi: true,
        },
      ],
    });

    interceptor = TestBed.inject(HeadersInterceptor);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept()', () => {
    it('should add CacheControl, ContentSecurityPolicy, StrictTransportSecurity headers', () => {
      httpClient.get('/api').subscribe();
      const httpRequest = httpMock.expectOne('/api');

      expect(httpRequest.request.headers.get(Headers.CacheControl)).toBe(
        `${Headers.NoCache}, ${Headers.NoStore}`
      );

      expect(httpRequest.request.headers.get(Headers.ContentSecurityPolicy)).toBe(
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* wss://* data:;connect-src * ws: wss:; frame-ancestors 'self';"
      );

      expect(httpRequest.request.headers.get(Headers.StrictTransportSecurity)).toBe(
        'max-age=31536000; includeSubDomains'
      );
    });
  });
});
