import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { cold } from 'jasmine-marbles';
import { AdminGuard } from '../guards/admin.guard';
import { CoreState } from '../state/core.state';
import { appConfigStub, toastServiceStub } from '../../../test/test-stubs';
import { UserRoles } from '../enums/user-roles';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from '../../../assets/config/app.config.model';
import { ToastService } from '../services/toast.service';
import { ConfigService } from '@ui-coe/shared/util/services';

const routerStub = {
  navigate: jest.fn(),
};

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([CoreState], { developmentMode: true }),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
        {
          provide: AppConfig,
          useValue: appConfigStub,
        },
        {
          provide: ToastService,
          useValue: toastServiceStub,
        },
        ConfigService,
      ],
    });
    guard = TestBed.inject(AdminGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate()', () => {
    describe('when user has admin privileges', () => {
      beforeEach(() => {
        store.reset({
          core: {
            userRoles: [UserRoles.PortalAdmin, UserRoles.CustomerAdmin],
          },
        });
      });

      it('should allow for admin module to load', () => {
        const response = cold('a', { a: true });
        expect(guard.canActivate()).toBeObservable(response);
      });
    });

    describe('when user does NOT have admin privileges', () => {
      beforeEach(() => {
        store.reset({
          core: {
            userRoles: [UserRoles.CustomerAdmin],
          },
        });
      });

      it('should navigate user back to queue page', () => {
        const response = cold('a', { a: false });
        expect(guard.canActivate()).toBeObservable(response);
      });
    });
  });
});
