import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LoginCallbackComponent } from './login-callback.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, SubscriptionManagerService } from '@ui-coe/shared/util/services';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { AvcAuthService } from '../../../core/services/avc-auth.service';

describe('AdminUsersFilterComponent', () => {
  let component: LoginCallbackComponent;
  let fixture: ComponentFixture<LoginCallbackComponent>;
  let subManager: SubscriptionManagerService;

  const authServiceStub = {
    handleSsoCallback: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginCallbackComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxsModule.forRoot([], { developmentMode: true }),
      ],
      providers: [
        SubscriptionManagerService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: (): string => 'test',
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (str: string) => str,
          },
        },
        {
          provide: AvcAuthService,
          useValue: authServiceStub,
        },
      ],
    }).compileComponents();

    subManager = TestBed.inject(SubscriptionManagerService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and call handleSsoCallback', () => {
    expect(component).toBeTruthy();
    expect(authServiceStub.handleSsoCallback).toHaveBeenCalledWith(
      'avidAuthBaseUri',
      'test',
      'test',
      'redirectUrl'
    );
  });

  it('should run the subscription manager teardown method on destroy', () => {
    const spy = jest.spyOn(subManager, 'tearDown');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
