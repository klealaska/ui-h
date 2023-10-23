import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  CoreStateMock,
  globalExceptionManagerTokenStub,
  hasAllTheClaimsTokenStub,
  hasNoClaimsTokenStub,
  pendingQueueAndDashboardClaimsTokenStub,
  uploadAndSubmitTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import { AppPages } from '@ui-coe/avidcapture/shared/types';
import { AuthService } from '@ui-coe/shared/util/auth';

import { ClaimsGuard } from './claims.guard';

const routeStub = {
  path: '',
} as any;

const routerStub = {
  navigate: jest.fn(),
};

const authServiceStub = {
  getAccessToken: jest.fn(),
};

describe('ClaimsGuard', () => {
  let guard: ClaimsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([CoreStateMock], { developmentMode: true })],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
      ],
    });
    guard = TestBed.inject(ClaimsGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canLoad()', () => {
    const segmentStub = {
      path: AppPages.Archive,
    } as any;
    const segment2Stub = {
      path: 'docIdMock',
    } as any;

    describe('when user has NO claims but is trying to access archived invoice', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Archive;
        authServiceStub.getAccessToken.mockReturnValue(hasNoClaimsTokenStub);
      });

      it('should allow for the archive module to load', done => {
        guard.canLoad(routeStub, [segmentStub, segment2Stub]).subscribe(val => {
          expect(val).toBeTruthy();
          done();
        });
      });
    });

    describe('when user has NO claims but is trying to access archive page', () => {
      const segmentStub = {
        path: AppPages.Archive,
      } as any;
      beforeEach(() => {
        routeStub.path = AppPages.Archive;
        authServiceStub.getAccessToken.mockReturnValue(hasNoClaimsTokenStub);
      });

      it('should NOT allow for the archive module to load', done => {
        guard.canLoad(routeStub, [segmentStub]).subscribe(val => {
          expect(val).toBeFalsy();
          done();
        });
      });
    });

    describe('when user has canUseRecycle claim', () => {
      beforeEach(() => {
        routeStub.path = AppPages.RecycleBin;
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
      });

      it('should allow for the recycle bin module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeTruthy();
          done();
        });
      });
    });

    describe('when user does NOT have the canUseRecycle claim and has Queue claim', () => {
      beforeEach(() => {
        routeStub.path = AppPages.RecycleBin;
        authServiceStub.getAccessToken.mockReturnValue(pendingQueueAndDashboardClaimsTokenStub);
      });

      it('should NOT allow for the recycle bin module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeFalsy();
          expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
          done();
        });
      });
    });

    describe('when user has Dashboard claim && route is for dashboard page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Dashboard;
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
      });

      it('should allow for the dashboard module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeTruthy();
          done();
        });
      });
    });

    describe('when user does have Pending claim && route is for pending page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Queue;
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
      });

      it('should allow for the pending module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeTruthy();
          done();
        });
      });
    });

    describe('when user does NOT have Pending claim && route is for pending page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Queue;
        authServiceStub.getAccessToken.mockReturnValue(hasNoClaimsTokenStub);
      });

      it('should NOT allow for the pending module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeFalsy();
          expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.ErrorPage]);
          done();
        });
      });
    });

    describe('when user does have Archive claim && route is for archive page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Archive;
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
      });

      it('should allow for the archive module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeTruthy();
          done();
        });
      });
    });

    describe('when user does NOT have Archive claim && route is for archive page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Archive;
        authServiceStub.getAccessToken.mockReturnValue(pendingQueueAndDashboardClaimsTokenStub);
      });

      it('should NOT allow for the archive module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeFalsy();
          expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
          done();
        });
      });
    });

    describe('when user does have UploadsQueue claim && route is for my uploads page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.UploadsQueue;
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
      });

      it('should allow for the uploads module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeTruthy();
          done();
        });
      });
    });

    describe('when user does NOT have UploadsQueue claim && route is for my uploads page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.UploadsQueue;
        authServiceStub.getAccessToken.mockReturnValue(pendingQueueAndDashboardClaimsTokenStub);
      });

      it('should NOT allow for the uploads module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeFalsy();
          expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
          done();
        });
      });
    });

    describe('when user does have Research claim && route is for research page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Research;
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
      });

      it('should allow for the research module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeTruthy();
          done();
        });
      });
    });

    describe('when user does NOT have Research claim && route is for research page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Research;
        authServiceStub.getAccessToken.mockReturnValue(pendingQueueAndDashboardClaimsTokenStub);
      });

      it('should NOT allow for the research module to load', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeFalsy();
          expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
          done();
        });
      });
    });

    describe('when a route path is not found and user has Pending queue claim', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Admin;
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
      });

      it('should return false and redirect to pending', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeFalsy();
          expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
          done();
        });
      });
    });

    describe('when an user does not have any claim', () => {
      beforeEach(() => {
        routeStub.path = AppPages.Queue;
        authServiceStub.getAccessToken.mockReturnValue(hasNoClaimsTokenStub);
      });

      it('should return false and redirect to Error page', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeFalsy();
          expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.ErrorPage]);
          done();
        });
      });
    });

    describe('When the user has claims and tries to access to Error page', () => {
      beforeEach(() => {
        routeStub.path = AppPages.ErrorPage;
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
      });
      it('should return false and redirect to Queue page', done => {
        guard.canLoad(routeStub, []).subscribe(val => {
          expect(val).toBeFalsy();
          expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
          done();
        });
      });
    });
  });

  describe('when user has Upload and Submit role and tries to go to research', () => {
    beforeEach(() => {
      routeStub.path = AppPages.Research;
      authServiceStub.getAccessToken.mockReturnValue(uploadAndSubmitTokenStub);
    });

    it('should NOT allow for the research module to load', done => {
      guard.canLoad(routeStub, []).subscribe(val => {
        expect(val).toBeFalsy();
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.UploadsQueue]);
        done();
      });
    });
  });

  describe('when user has Upload and tries to go to default page', () => {
    beforeEach(() => {
      routeStub.path = '/';
      authServiceStub.getAccessToken.mockReturnValue(uploadAndSubmitTokenStub);
    });

    it('should navigate directly to uploads queue', done => {
      guard.canLoad(routeStub, []).subscribe(val => {
        expect(val).toBeFalsy();
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.UploadsQueue]);
        done();
      });
    });
  });

  describe('when user has Upload and tries to go to archive queue page', () => {
    beforeEach(() => {
      routeStub.path = AppPages.Archive;
      authServiceStub.getAccessToken.mockReturnValue(uploadAndSubmitTokenStub);
    });

    it('should navigate directly to uploads queue', done => {
      guard.canLoad(routeStub, []).subscribe(val => {
        expect(val).toBeFalsy();
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.UploadsQueue]);
        done();
      });
    });
  });

  describe('when user has Upload and tries to go to archive document page', () => {
    const segmentStub = {
      path: AppPages.Archive,
    } as any;
    const segment2Stub = {
      path: 'docIdMock',
    } as any;

    beforeEach(() => {
      routeStub.path = AppPages.Archive;
      authServiceStub.getAccessToken.mockReturnValue(uploadAndSubmitTokenStub);
    });

    it('should navigate directly to archived document', done => {
      guard.canLoad(routeStub, [segmentStub, segment2Stub]).subscribe(val => {
        expect(val).toBeTruthy();
        done();
      });
    });
  });

  describe('when user has Global exception and tries to go to default page', () => {
    beforeEach(() => {
      routeStub.path = '/';
      authServiceStub.getAccessToken.mockReturnValue(globalExceptionManagerTokenStub);
    });

    it('should navigate to dashboard', done => {
      guard.canLoad(routeStub, []).subscribe(val => {
        expect(val).toBeFalsy();
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Dashboard]);
        done();
      });
    });
  });
});
