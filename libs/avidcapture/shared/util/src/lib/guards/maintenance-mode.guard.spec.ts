import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { CoreStateMock } from '@ui-coe/avidcapture/shared/test';
import { AppPages, FeatureFlags } from '@ui-coe/avidcapture/shared/types';
import { MaintenanceModeGuard } from './maintenance-mode.guard';

const routerStub = {
  navigate: jest.fn(),
};

describe('MaintenanceModeGuard', () => {
  let guard: MaintenanceModeGuard;
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
    guard = TestBed.inject(MaintenanceModeGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canMatch()', () => {
    describe('when maintenance mode is inactive', () => {
      beforeEach(() => {
        store.reset({
          core: {
            featureFlags: [
              {
                id: FeatureFlags.maintenanceModeIsActive,
                description: '',
                enabled: false,
                conditions: { client_filters: [] },
              },
            ],
          },
        });
      });

      it('should return true', done => {
        guard.canMatch().subscribe(value => {
          expect(value).toBeTruthy();
          done();
        });
      });
    });

    describe('when maintenance mode is active', () => {
      beforeEach(() => {
        store.reset({
          core: {
            featureFlags: [
              {
                id: FeatureFlags.maintenanceModeIsActive,
                description: '',
                enabled: true,
                conditions: { client_filters: [] },
              },
            ],
          },
        });
      });

      it('should return false', done => {
        guard.canMatch().subscribe(value => {
          expect(value).toBeFalsy();
          done();
        });
      });

      it('should navigate to maintenance page', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.MaintenancePage]));
    });
  });
});
