import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MockComponent } from 'ng-mocks';
import { CoreState } from '../core/state/core.state';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './layout.component';
import { AppConfig } from '../../assets/config/app.config.model';
import {
  appConfigStub,
  configServiceStub,
  connectorServiceStub,
  customerServiceStub,
  navigationChevronServiceStub,
  platformServiceStub,
  registrationServiceStub,
  storeStub,
  toastServiceStub,
  userServiceStub,
} from '../../test/test-stubs';
import { of } from 'rxjs';
import { ToastService } from '../core/services/toast.service';
import { UserRoles } from '../core/enums/user-roles';
import { ConfigService } from '@ui-coe/shared/util/services';

export const stateContextStub = {
  getState: jest.fn(),
  setState: jest.fn(),
  patchState: jest.fn(),
  dispatch: jest.fn(),
};

// API Services Stubs
export const authServiceStub = {
  getUserInfo: jest.fn(),
  acquireTokenPopup: jest.fn(),
  getScopesForEndpoint: jest.fn(),
  getAccessToken: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  isLoggedIn: jest.fn(),
};

describe('LayoutComponent', () => {
  const CoreStateStub = new CoreState(
    authServiceStub as any,
    toastServiceStub as any,
    userServiceStub as any,
    customerServiceStub as any,
    connectorServiceStub as any,
    registrationServiceStub as any,
    platformServiceStub as any,
    navigationChevronServiceStub as any,
    configServiceStub as any
  );
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let store: Store;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, NgxsModule.forRoot([CoreState])],
      declarations: [
        LayoutComponent,
        MockComponent(FooterComponent),
        MockComponent(HeaderComponent),
      ],
      providers: [
        ConfigService,
        {
          provide: AppConfig,
          useValue: appConfigStub,
        },
        {
          provide: Store,
          useValue: storeStub,
        },
        {
          provide: ToastService,
          useValue: toastServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch').mockReturnValue(of('foo'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch the logout action when onLogout is called', () => {
    component.onLogout();
    expect(store.dispatch).toHaveBeenCalled();
  });
  describe('ngOnInit()', () => {
    describe('if there are roles', () => {
      beforeEach(() => {
        jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce([UserRoles.CustomerAdmin]);
        CoreStateStub.initApplication(stateContextStub);
        component.ngOnInit();
      });
      it('should pass if there is one role', () => {
        expect(component.roles.length).toBe(1);
      });
    });
    describe('if there are roles', () => {
      beforeEach(() => {
        CoreStateStub.initApplication(stateContextStub);
        jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce([UserRoles.PortalAdmin]);
        component.ngOnInit();
      });
      it('should pass if there is one role', () => {
        expect(component.roles.length).toBe(1);
      });
    });
    describe('if there are roles', () => {
      beforeEach(() => {
        CoreStateStub.initApplication(stateContextStub);
        jest
          .spyOn(storeStub, 'selectSnapshot')
          .mockReturnValueOnce([UserRoles.CustomerAdmin, UserRoles.PortalAdmin]);
        component.ngOnInit();
      });
      it('should pass if there are roles both roles', () => {
        expect(component.roles.length).toBe(2);
      });
    });
    describe('if there are no roles undefined', () => {
      beforeEach(() => {
        CoreStateStub.initApplication(stateContextStub);
        jest.spyOn(component, 'onLogout');
        component.ngOnInit();
        component.roles = undefined;
        component.onLogout();
      });
      it('should pass if there are roles', () => {
        expect(component.roles).toBe(undefined);
        expect(component.onLogout).toHaveBeenCalled();
      });
    });
    describe('if there are no roles', () => {
      beforeEach(() => {
        CoreStateStub.initApplication(stateContextStub);
        jest.spyOn(component, 'onLogout');
        jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce([]);
        component.ngOnInit();
        component.onLogout();
      });
      it('should pass if there are no roles', () => {
        expect(component.roles.length).toBe(0);
        expect(component.onLogout).toHaveBeenCalled();
      });
    });
  });
});
