import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { singleOrgTokenStub, userAccountStub } from '@ui-coe/avidcapture/shared/test';
import { AuthService, UserAccount } from '@ui-coe/shared/util/auth';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { LoggingService } from './logging.service';

const environmentStub = {
  appInsights: {
    instrumentationKey: '',
  },
};

describe('LoggingService', () => {
  let service: LoggingService;

  const navend = new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login');
  const routerSpy = {
    events: new Observable(observer => {
      observer.next(navend);
      observer.complete();
    }),
  };

  const authServiceStub = {
    getUserInfo: (): UserAccount => userAccountStub,
    getAccessToken: (): string => singleOrgTokenStub,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    });
    service = TestBed.inject(LoggingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logPageView()', () => {
    const logPageView = {
      name: `mockRoute`,
      uri: 'sample',
      properties: {
        username: userAccountStub.preferred_username,
        bearerToken: jwt_decode(singleOrgTokenStub),
      },
    };
    beforeEach(() => {
      jest.spyOn(service.appInsights, 'trackPageView').mockImplementation();
      jest.spyOn(service as any, 'getUserProperties').mockImplementation(() => ({
        username: userAccountStub.preferred_username,
        bearerToken: jwt_decode(singleOrgTokenStub),
      }));
      service.logPageView('mockRoute', logPageView.uri);
    });

    it('should set the appInsights telemetryTrace name to route name + username', () =>
      expect(service.appInsights.context.telemetryTrace.name).toBe(
        `mockRoute - ${userAccountStub.preferred_username}`
      ));

    it('should log page view', () => {
      expect(service.appInsights.trackPageView).toHaveBeenNthCalledWith(1, logPageView);
    });
  });

  describe('logEvent()', () => {
    beforeEach(() => {
      jest.spyOn(service.appInsights, 'trackEvent').mockImplementation();
      service.logEvent('test', null);
    });

    it('should log Event', () => {
      expect(service.appInsights.trackEvent).toHaveBeenNthCalledWith(
        1,
        { name: 'test' },
        { bearerToken: jwt_decode(singleOrgTokenStub), username: 'Avid Xer' }
      );
    });
  });

  describe('logMetric()', () => {
    beforeEach(() => {
      jest.spyOn(service.appInsights, 'trackMetric').mockImplementation();
      service.logMetric('test', 10, null);
    });

    it('should log metric', () => {
      expect(service.appInsights.trackMetric).toHaveBeenNthCalledWith(
        1,
        { name: 'test', average: 10 },
        null
      );
    });
  });

  describe('logException()', () => {
    const error: Error = new Error('ERROR');
    beforeEach(() => {
      jest.spyOn(service.appInsights, 'trackException').mockImplementation();
      service.logException(error, 1);
    });

    it('should log exception', () => {
      expect(service.appInsights.trackException).toHaveBeenNthCalledWith(1, {
        exception: error,
        severityLevel: 1,
        properties: {
          username: userAccountStub.preferred_username,
          bearerToken: jwt_decode(singleOrgTokenStub),
        },
      });
    });
  });

  describe('logTrace()', () => {
    beforeEach(() => {
      jest.spyOn(service.appInsights, 'trackTrace').mockImplementation();
      service.logTrace('test', null);
    });

    it('should log Trace', () => {
      expect(service.appInsights.trackTrace).toHaveBeenNthCalledWith(1, { message: 'test' }, null);
    });
  });
});
