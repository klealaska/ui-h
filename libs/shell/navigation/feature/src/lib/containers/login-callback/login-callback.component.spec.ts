import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService, AppName, AuthConfig } from '@ui-coe/shared/util/auth';
import { LoginCallbackComponent } from './login-callback.component';
import { AuthFacade } from '@ui-coe/shell/navigation/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShellConfigService } from '@ui-coe/shared/util/services';

describe('LoginCallbackComponent', () => {
  let component: LoginCallbackComponent;
  let fixture: ComponentFixture<LoginCallbackComponent>;

  const authFacadeStub = {
    handleSsoCallback: jest.fn(),
  };

  const configServiceStub = {
    authConfig: {
      avidAuthLoginUrl: 'http://localhost:4200/',
      avidAuthBaseUrl: 'http://localhost:4200/',
      appName: AppName.Shell,
      redirectUrl: 'dashboard',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LoginCallbackComponent],
      providers: [
        AuthFacade,
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: (): string => 'test',
            }),
            data: of({
              appName: AppName.DataCapture,
              avidAuthBaseUrl: 'http://localhost:4200/',
              avidAuthLoginUrl: 'http://localhost:4200/',
              redirectUrl: 'dashboard',
            } as AuthConfig),
          },
        },
        {
          provide: AuthFacade,
          useValue: authFacadeStub,
        },
        {
          provide: ShellConfigService,
          useValue: configServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and call handleSsoCallback', () => {
    expect(component).toBeTruthy();
    expect(authFacadeStub.handleSsoCallback).toHaveBeenCalledWith({
      avidAuthBaseUrl: 'http://localhost:4200/',
      state: 'test',
      code: 'test',
      redirectUrl: 'dashboard',
    });
  });
});
