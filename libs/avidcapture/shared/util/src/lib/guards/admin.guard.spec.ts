import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { CoreStateMock } from '@ui-coe/avidcapture/shared/test';
import { AppPages, SecurityAttributes } from '@ui-coe/avidcapture/shared/types';

import { AdminGuard } from './admin.guard';

const routerStub = {
  navigate: jest.fn(),
};

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([CoreStateMock], { developmentMode: true })],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
      ],
    });
    guard = TestBed.inject(AdminGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canLoad()', () => {
    describe('when user has admin privileges', () => {
      beforeEach(() => {
        store.reset({
          core: {
            userRoles: [SecurityAttributes.Admin, SecurityAttributes.User],
          },
        });
      });

      it('should allow for admin module to load', done => {
        guard.canLoad().subscribe(val => expect(val).toBeTruthy());
        done();
      });
    });

    describe('when user does NOT have admin privileges', () => {
      beforeEach(() => {
        store.reset({
          core: {
            userRoles: [SecurityAttributes.User],
          },
        });
      });

      it('should navigate user back to queue page', () => {
        guard.canLoad().subscribe();
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
      });

      it('should NOT allow for admin module to load', done => {
        guard.canLoad().subscribe(val => {
          expect(val).toBeFalsy();
          done();
        });
      });
    });
  });
});
