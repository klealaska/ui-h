import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthService } from '@ui-coe/shared/util/auth';
import { MockComponent } from 'ng-mocks';

import { Logout } from '../../../core/state/core.actions';
import { HeaderComponent } from '../header/header.component';
import { LayoutComponent } from './layout.component';

const authServiceMock = {
  getAccessToken: jest.fn(),
};

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutComponent, MockComponent(HeaderComponent)],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([], { developmentMode: true }),
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch').mockImplementation();
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(authServiceMock.getAccessToken).toHaveBeenCalledTimes(1);
  });

  describe('logout()', () => {
    beforeEach(() => {
      component.logout();
    });

    it('should dispatch Logout action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new Logout()));
  });
});
