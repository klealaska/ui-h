import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService, AppName, AuthConfig } from '@ui-coe/shared/util/auth';
import { LoginCallbackComponent } from './login-callback.component';

describe('AdminUsersFilterComponent', () => {
  let component: LoginCallbackComponent;
  let fixture: ComponentFixture<LoginCallbackComponent>;

  const authServiceStub = {
    handleSsoCallback: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginCallbackComponent],
      providers: [
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
              redirectUrl: 'queue',
            } as AuthConfig),
          },
        },
        {
          provide: AuthService,
          useValue: authServiceStub,
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
    expect(authServiceStub.handleSsoCallback).toHaveBeenCalledWith(
      'http://localhost:4200/',
      'test',
      'test',
      'queue'
    );
  });
});
