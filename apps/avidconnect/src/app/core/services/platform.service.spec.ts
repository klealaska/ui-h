import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub } from '../../../test/test-stubs';
import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  let service: PlatformService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(PlatformService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should  get platforms from service', () => {
    const params = {
      pageNumber: 1,
    };

    service.getAll(params).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}platforms?pageNumber=1`);
    expect(req.request.method).toEqual('GET');
  });

  it('should get platform by id from service', () => {
    const platformId = 1;

    service.getById(platformId).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}platforms/${platformId}`);
    expect(req.request.method).toEqual('GET');
  });

  it('should get operation types by platforid from service', () => {
    const platformId = 1;

    service.getOperationTypes(platformId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}platforms/${platformId}/operationtypes`
    );
    expect(req.request.method).toEqual('GET');
  });
});
