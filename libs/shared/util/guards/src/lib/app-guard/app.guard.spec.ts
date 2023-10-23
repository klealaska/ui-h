import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppGuard } from './app.guard';
import { ConfigService, LoggingService } from '@ui-coe/shared/util/services';

describe('App Guard', () => {
  let guard: AppGuard;
  const configServiceStub: Partial<ConfigService> = {
    appConfig: { key: 'value' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        Store,
        AppGuard,
        LoggingService,
        {
          provide: ConfigService,
          useValue: configServiceStub,
        },
      ],
    });
    guard = TestBed.inject(AppGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canMatch()', () => {
    it('canActivate should be truthy', () => {
      expect(guard.canMatch).toBeTruthy();
    });
  });
});
