import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpRequestActive, HttpRequestComplete } from '@ui-coe/avidcapture/core/data-access';
import { LookupApiUrls } from '@ui-coe/avidcapture/shared/types';
import { throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
  let interceptor: LoadingInterceptor;
  let store: Store;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([], { developmentMode: true })],
      providers: [
        LoadingInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true,
        },
      ],
    });

    interceptor = TestBed.inject(LoadingInterceptor);
    store = TestBed.inject(Store);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept()', () => {
    describe('if request url is not in excludedRequestUrls list', () => {
      it('should call action HttpRequestActive() followed by HttpRequestComplete with successful api call', fakeAsync(() => {
        httpClient
          .get('/api')
          .subscribe(() =>
            expect(store.dispatch).toHaveBeenNthCalledWith(1, new HttpRequestActive())
          );
        tick();
        httpMock.expectOne('/api').flush({});
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new HttpRequestComplete());
      }));
    });

    describe('if request url is not in excludedRequestUrls list, & is the only api call in transit, & fails', () => {
      it('should call action HttpRequestComplete when an error is caught', done => {
        const httpRequestMock = { url: 'api' } as any;
        const httpHandlerSpy = {
          handle: jest.fn(() => throwError(() => ({ error: { message: 'test-error' } }))),
        } as any;

        interceptor.intercept(httpRequestMock, httpHandlerSpy).subscribe({
          next: () => ({}),
          error: (err: HttpErrorResponse) => {
            expect(err.error.message).toEqual('test-error');
            done();
          },
        });

        expect(store.dispatch).toHaveBeenNthCalledWith(1, new HttpRequestComplete());
      });
    });

    describe('if request url is in excludedRequestUrls list', () => {
      it('should not call HttpRequestActive() action', fakeAsync(done => {
        const apiRequest = `${environment.lookupApiBaseUri}${
          LookupApiUrls.GET_PROPERTIES.split('?')[0]
        }`;

        httpClient.get(apiRequest).subscribe(() => {
          expect(store.dispatch).not.toHaveBeenCalled();
          done();
        });
        tick();
      }));
    });
  });
});
