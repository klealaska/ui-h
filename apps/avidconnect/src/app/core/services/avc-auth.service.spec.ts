import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TokenResponse } from '@ui-coe/shared/util/auth';
import { ConfigService } from '@ui-coe/shared/util/services';
import { of, throwError } from 'rxjs';
import { AvcAuthService } from './avc-auth.service';

const httpStub = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const routerStub = {
  navigateByUrl: jest.fn(),
  navigate: jest.fn(),
};

describe('AuthService', () => {
  let service: AvcAuthService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AvcAuthService,
        ConfigService,
        {
          provide: HttpClient,
          useValue: httpStub,
        },
      ],
    });
    configService = TestBed.inject(ConfigService);
    service = new AvcAuthService(routerStub as any, httpStub as any, configService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleSsoCallback', () => {
    const tokens =
      // eslint-disable-next-line max-len
      '{"token_type":"Bearer","expires_in":300,"access_token":"eyJraWQiOiI1Y0FIcHlUb2VMckpEOFoza0hCekNWbHp2VDZzMGUzLUVZd2R0SFNTU1pZIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmhFQW96by1FaEEwa2V6V0tHS0V3Q1B6bldFeEdtSzZZc0FQS2d1YUdUNFUub2FyamIwZDF4OEhvb1czR0QxZDYiLCJpc3MiOiJodHRwczovL2F2aWR4Y2hhbmdlLm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzcjBpZHlkdUNsSlRoT0oxZDYiLCJhdWQiOiJBdmlkQXV0aDovL0RhdGFDYXB0dXJlIiwiaWF0IjoxNjUxMDg4MjYwLCJleHAiOjE2NTEwODg1NjAsImNpZCI6IjBvYW5tOWxzdjlqN2ROSllVMWQ2IiwidWlkIjoiMDB1MTNwamptanhMTlBvSDkxZDciLCJzY3AiOlsib2ZmbGluZV9hY2Nlc3MiLCJwcm9maWxlIiwib3BlbmlkIl0sImF1dGhfdGltZSI6MTY1MTA4ODI1MSwiSXNJbnRlcm5hbFVzZXIiOiJ0cnVlIiwic3ViIjoibGluZ2VzaDkwMy1RQUBnbWFpbC5jb20iLCJvcmdJZCI6WyJvcmcuMSJdLCJhcHBzIjpbIkF2aWRTdWl0ZSIsIkRhdGFDYXB0dXJlIl19.OctZjAVP2CQ56HeLb7V8Dj2WzFZO_uXDiN6WQrK0rf8QE0DGFiXzOkYqAdx6DKPC6mQ9DHyKZ707QxZLD-7TFxfprN-oKrCxQ8PQMzyA9LOZ1nWWpggTS3PO-jGkbChgCp9DCLqnUBov7BrI7_fdi40zLkzTtihz00-FJZscsQQxzUX5yzczbsqSLo9mejCiQpK_M9ITwHFd6NjyFD18NND-AAHWGzqVyZ-koMCCA17pBG-xFJzsOEIpuRnit0GqgzxiNIK7HyTLlFnZMy8aFtekNTEEDLcE8PQmuu1CMpD9l5KPNhD1CMj1RakWLCPKQQrvKklns0j6T0qeNpy_sg","scope":"offline_access profile openid","id_token":"eyJraWQiOiI1Y0FIcHlUb2VMckpEOFoza0hCekNWbHp2VDZzMGUzLUVZd2R0SFNTU1pZIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMHUxM3Bqam1qeExOUG9IOTFkNyIsIm5hbWUiOiJsaW5nZXNoOTAzIHBhbGFuaSIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9hdmlkeGNoYW5nZS5va3RhcHJldmlldy5jb20vb2F1dGgyL2F1c3IwaWR5ZHVDbEpUaE9KMWQ2IiwiYXVkIjoiMG9hbm05bHN2OWo3ZE5KWVUxZDYiLCJpYXQiOjE2NTEwODgyNjAsImV4cCI6MTY1MTA5MTg2MCwianRpIjoiSUQudTM5QjJFNzQyd2lHWi10LTl5NHBwYVYySTFnczFlWHpvbWt2ZXdGdk0zMCIsImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvMmoycHFxYjhXQXNKajExZDYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJsaW5nZXNoOTAzLVFBQGdtYWlsLmNvbSIsImF1dGhfdGltZSI6MTY1MTA4ODI1MSwiYXRfaGFzaCI6Im5nSkFJaFY3Yk1sVF9Ea1NMNDhuR2cifQ.KhjQTF7pJ9TVdw58A3491q7JRLWF0n_p25tH5hX3-PqIY-NztP9RZFyIcOlGBJUGoZw2X_NgBG-2QVlIiynoyXDj8nkS7Z6sLi-4mpwLinQA9TyP4NuaPmPJOJ1QyW0UdNSKVpkFcg_-MhQP2d49u5HNnIwg2PxmLRafqCy5Jm9yk7nUqLjOndZcwtbr8Rb7vqyBL2URyok0wzOfbNzPqBoM4jEt7Zu2PBGcLCQTnbgQgfVAo_wcWEyAjdkf4UxLPplMWPrdAmbnyiJo7P9GjqboFoWfDF6wWCYoWGfwKDBGmZw5OA8zzwwt3U3-TLDC8IzQpD6rJL2mo3fZkvLHuQ"}';
    beforeEach(() => {
      jest.spyOn(window.localStorage.__proto__, 'setItem');
      window.localStorage.__proto__.setItem = jest.fn().mockImplementation(() => tokens);
    });
    it('should return login url', () => {
      httpStub.post.mockReturnValue(
        of({
          return_data: {
            tokens: JSON.parse(tokens),
          },
        } as TokenResponse)
      );
      service
        .handleSsoCallback('https://login.qa.avidsuite.com', 'state', 'code', 'queue')
        .subscribe();

      expect(httpStub.post).toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith('tokens', tokens);
      expect(routerStub.navigate).toHaveBeenCalledWith(['queue']);
    });

    it('should catch error calling getAuthToken', () => {
      httpStub.post.mockReturnValue(throwError({ status: 500 }));
      service.handleSsoCallback('https://login.qa.avidsuite.com', 'state', 'code', 'queue');
      expect(httpStub.post).toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalledWith('tokens', tokens);
      expect(routerStub.navigate).not.toHaveBeenCalledWith(['queue']);
    });

    it('should not call actions when post response is empty', () => {
      httpStub.post.mockReturnValue(of(null));
      service.handleSsoCallback('https://login.qa.avidsuite.com', 'state', 'code', 'queue');
      expect(httpStub.post).toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalledWith('tokens', tokens);
      expect(routerStub.navigate).not.toHaveBeenCalledWith(['queue']);
    });

    it('should not call actions when post response return_data is empty', () => {
      httpStub.post.mockReturnValue(
        of({
          return_data: {},
        } as TokenResponse)
      );
      service.handleSsoCallback('https://login.qa.avidsuite.com', 'state', 'code', 'queue');
      expect(httpStub.post).toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalledWith('tokens', tokens);
      expect(routerStub.navigate).not.toHaveBeenCalledWith(['queue']);
    });

    it('should not call actions when post response tokens is empty', () => {
      httpStub.post.mockReturnValue(
        of({
          return_data: {
            tokens: null,
          },
        })
      );
      service.handleSsoCallback('https://login.qa.avidsuite.com', 'state', 'code', 'queue');
      expect(httpStub.post).toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalledWith('tokens', tokens);
      expect(routerStub.navigate).not.toHaveBeenCalledWith(['queue']);
    });
  });
});
