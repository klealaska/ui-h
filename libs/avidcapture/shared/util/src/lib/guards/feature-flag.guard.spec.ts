import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { CoreStateMock } from '@ui-coe/avidcapture/shared/test';
import { AppPages, FeatureFlags } from '@ui-coe/avidcapture/shared/types';

import { FeatureFlagGuard } from './feature-flag.guard';

const routeStub = {
  path: '',
} as any;

const routerStub = {
  navigate: jest.fn(),
};

describe('FeatureFlagGuard', () => {
  let guard: FeatureFlagGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([CoreStateMock], { developmentMode: true }),
      ],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
      ],
    });
    guard = TestBed.inject(FeatureFlagGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canLoad()', () => {
    describe('when router path is admin/users & usersPage is active', () => {
      beforeEach(() => {
        routeStub.path = 'admin/users';
        store.reset({
          core: {
            featureFlags: [
              {
                id: FeatureFlags.adminIsActive,
                description: '',
                enabled: true,
                conditions: { client_filters: [] },
              },
            ],
          },
        });
      });

      it('should return true', done => {
        guard.canLoad(routeStub).subscribe(value => {
          expect(value).toBeTruthy();
          done();
        });
      });
    });

    describe('when router path is admin/users & usersPage is NOT active', () => {
      beforeEach(() => {
        routeStub.path = 'admin/users';
        store.reset({
          core: {
            featureFlags: [
              {
                id: FeatureFlags.adminIsActive,
                description: '',
                enabled: false,
                conditions: { client_filters: [] },
              },
            ],
          },
        });
      });

      it('should return false', done => {
        guard.canLoad(routeStub).subscribe(value => {
          expect(value).toBeFalsy();
          done();
        });
      });

      it('should navigate back to queue page', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]));
    });

    describe('when router path does NOT equal a path specified in guard', () => {
      beforeEach(() => {
        routeStub.path = 'mock';
        store.reset({
          core: {
            featureFlags: [
              {
                id: FeatureFlags.adminIsActive,
                description: '',
                enabled: false,
                conditions: { client_filters: [] },
              },
            ],
          },
        });
      });

      it('should return false', done => {
        guard.canLoad(routeStub).subscribe(value => {
          expect(value).toBeFalsy();
          done();
        });
      });
    });
  });
});
