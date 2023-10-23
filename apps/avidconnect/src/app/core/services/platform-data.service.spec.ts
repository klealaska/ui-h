import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub } from '../../../test/test-stubs';
import { PlatformDataService } from './platform-data.service';

describe('PlatformDataService', () => {
  let service: PlatformDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(PlatformDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call searchOrganizations from service', () => {
    const params = {
      name: 'test',
    };

    service.searchOrganizations(params).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}platformdata/organizations/search?name=test`
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should call getOrganizationAccountingSystems from service', () => {
    const params = {
      organizationId: 1,
      platformId: 1,
    };

    service.getOrganizationAccountingSystems(params).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}platformdata/accountingsystems?organizationId=${params.organizationId}&platformId=${params.platformId}`
    );
    expect(req.request.method).toEqual('GET');
  });
});
