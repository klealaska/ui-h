import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ToastService } from '@ui-coe/avidcapture/core/util';
import { RetryStrategy } from '@ui-coe/avidcapture/shared/types';
import { of } from 'rxjs';

import { HttpRequestComplete } from '../+state/core.actions';
import { RetryStrategyService } from './retry-strategy.service';

const toastServiceSpy = {
  error: jest.fn(),
};

describe('RetryStrategyService', () => {
  let service: RetryStrategyService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([], { developmentMode: true })],
      providers: [
        {
          provide: ToastService,
          useValue: toastServiceSpy,
        },
      ],
    });
    service = TestBed.inject(RetryStrategyService);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('retryApiCall()', () => {
    describe('when using default retry strategy', () => {
      const errorStub = of({ status: 500, statusText: 'unauthorized' }) as any;

      it('should display API failed toast', done => {
        service.retryApiCall(errorStub).subscribe(() => {
          expect(toastServiceSpy.error).toHaveBeenNthCalledWith(
            1,
            'Failure to Load API: Error Status 500'
          );
          done();
        });
      });
    });

    describe('when using a retry strategy being sent in', () => {
      const errorStub = of({ status: 503, statusText: 'unauthorized' }) as any;
      const retryStrategyStub: RetryStrategy = {
        excludedStatusCodes: [500],
        duration: 500,
      };

      it('should display API failed toast 1st & retry failed toast 2nd', done => {
        service.retryApiCall(errorStub, retryStrategyStub).subscribe(() => {
          done();

          expect(toastServiceSpy.error).toHaveBeenNthCalledWith(
            1,
            'Failure to Load API: Error Status 503'
          );

          expect(toastServiceSpy.error).toHaveBeenNthCalledWith(2, 'Attempt to Reload API Failed');

          expect(store.dispatch).toHaveBeenNthCalledWith(1, new HttpRequestComplete());
        });
      }, 1000);
    });

    describe('when status being sent in matches excluded codes', () => {
      const errorStub = of({ status: 500, statusText: 'unauthorized' }) as any;

      const retryStrategyStub: RetryStrategy = {
        excludedStatusCodes: [500],
        duration: 500,
      };

      it('should throwError & NOT display API failed error toast', () => {
        service.retryApiCall(errorStub, retryStrategyStub).subscribe(err => {
          expect(err).toEqual(errorStub);
          expect(toastServiceSpy.error).not.toHaveBeenNthCalledWith(
            1,
            'Failure to Load API: Error Status 500'
          );
        });
      });
    });

    describe('when excludedStatusCodesToastMessage has status code', () => {
      const errorStub = of({ status: 400, statusText: 'Missing Fields' }) as any;

      const retryStrategyStub: RetryStrategy = {
        excludedStatusCodes: [400],
        duration: 500,
      };

      it('should throwError & NOT display API failed error toast', () => {
        service.retryApiCall(errorStub, retryStrategyStub).subscribe(err => {
          expect(err).toEqual(errorStub);
          expect(toastServiceSpy.error).not.toHaveBeenNthCalledWith(
            1,
            'Failure to Load API: Error Status 400'
          );
        });
      });
    });
  });
});
