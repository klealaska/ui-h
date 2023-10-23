import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { TokenGuard } from './token.guard';
import { AuthConfig } from '../models';
import { AppName } from '../enums';
import { Route } from '@angular/router';

const authServiceStub = {
  isLoggedIn: jest.fn(),
  getAvidAuthLoginUrl: jest.fn(),
  logout: jest.fn(),
};

const authConfig: AuthConfig = {
  avidAuthLoginUrl: 'http://localhost:4200/',
  appName: AppName.DataCapture,
  avidAuthBaseUrl: 'http://localhost:4200/',
  redirectUrl: 'queue',
};

const route: Route = {
  data: authConfig,
};

describe('TokenGuard', () => {
  let guard: TokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
      ],
    });

    guard = TestBed.inject(TokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canLoad()', () => {
    describe('when token is expired', () => {
      beforeEach(() => {
        Object.defineProperty(window, 'location', {
          value: new URL('http://localhost/'),
        });
        authServiceStub.getAvidAuthLoginUrl.mockReturnValue('http://localhost:4200');
        authServiceStub.isLoggedIn.mockReturnValue(false);
      });

      it('should return false', done => {
        guard.canLoad(route).subscribe(value => {
          expect(value).toBeFalsy();
          done();
        });
      });

      it('should dispatch Logout action', done => {
        guard.canLoad(route).subscribe(() => {
          expect(authServiceStub.logout).toHaveBeenCalled();
          done();
        });
      });

      it('should navigate back to the login page', done => {
        guard.canLoad(route).subscribe(() => {
          expect(window.location.href).toEqual('http://localhost:4200/');
          done();
        });
      });
    });

    describe('when token has a value', () => {
      beforeEach(() => {
        authServiceStub.isLoggedIn.mockReturnValue(true);
      });

      it('should return true', done => {
        guard.canLoad(route).subscribe(value => {
          expect(value).toBeTruthy();
          done();
        });
      });
    });

    describe('when token does not have a value', () => {
      beforeEach(() => {
        Object.defineProperty(window, 'location', {
          value: new URL('http://localhost/'),
        });
        authServiceStub.getAvidAuthLoginUrl.mockReturnValue('http://localhost:4200');
        authServiceStub.isLoggedIn.mockReturnValue(true);
      });

      it('should display API failed toast', done => {
        guard.canLoad(route).subscribe(() => {
          expect(window.location.href).toEqual('http://localhost:4200/');
          done();
        });
      });
    });

    describe('when route.data is undefined', () => {
      const routeStub = {
        data: null,
      } as any;
      beforeEach(() => {
        authServiceStub.getAvidAuthLoginUrl.mockReturnValue('http://localhost:4200');
        authServiceStub.isLoggedIn.mockReturnValue(false);
      });
      it('should throw an error when authconfig is empty', () => {
        expect(() => {
          guard.canLoad(routeStub);
        }).toThrow('Please pass a valid AuthConfig in your routes data property');
      });

      it('should throw an error when authconfig is missing url', () => {
        expect(() => {
          routeStub.appName = AppName.DataCapture;
          guard.canLoad(routeStub);
        }).toThrow('Please pass a valid AuthConfig in your routes data property');
      });

      it('should throw an error when authconfig is missing appName', () => {
        expect(() => {
          routeStub.avidAuthLoginUrl = 'test';
          guard.canLoad(routeStub);
        }).toThrow('Please pass a valid AuthConfig in your routes data property');
      });
    });
  });
});
