import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@ui-coe/shared/util/auth';
import { UserProfile } from '../../models';

import { UserService } from './user.service';

const userAccountStub = {
  auth_time: 123456,
  email: 'XDCUserTest@avidxchange.com',
  email_verified: true,
  family_name: 'Xer',
  given_name: 'Avid',
  locale: 'Eastern',
  name: 'Avid Xer',
  preferred_username: 'Avid Xer',
  sub: '',
  zoneinfo: '',
  updated_at: 0,
};

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProfile()', () => {
    it('should return an empty profile if the user account is null', done => {
      jest.spyOn(authService, 'getUserInfo').mockReturnValue(null);
      service.getProfile().subscribe(response => {
        expect(response).toEqual({});
        done();
      });
    });

    it('should return the user profile', done => {
      jest.spyOn(authService, 'getUserInfo').mockReturnValue(userAccountStub);
      service.getProfile().subscribe(response => {
        const userProfile: UserProfile = {
          businessPhones: [],
          displayName: userAccountStub.preferred_username,
          givenName: userAccountStub.preferred_username,
          id: userAccountStub.sub,
          jobTitle: '',
          mail: userAccountStub.email,
          mobilePhone: '',
          officeLocation: '',
          preferredLanguage: '',
          surname: userAccountStub.family_name,
          userPrincipalName: userAccountStub.email,
        };
        expect(response).toEqual(userProfile);
        done();
      });
    });
  });
});
