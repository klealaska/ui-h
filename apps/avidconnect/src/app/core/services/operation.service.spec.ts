import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OperationService } from './operation.service';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub } from '../../../test/test-stubs';
describe('OperationService', () => {
  let service: OperationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(OperationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getByCustomer from service', () => {
    const customerId = 1;
    const params = {
      pageNumber: 1,
    };

    service.getByCustomer(customerId, params).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/operations?pageNumber=1`
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should call getById from service', () => {
    const customerId = 1;
    const operationId = 1;

    service.getById(customerId, operationId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/operations/${operationId}`
    );
    expect(req.request.method).toEqual('GET');
  });

  describe('getDetails', () => {
    const customerId = 1;
    const operationId = 1;
    describe('when is report', () => {
      it('should call getDetails from service', () => {
        service.getDetails(1, 1, true).subscribe();

        const req = httpMock.expectOne(
          `${appConfigStub.apiBaseUrl}customers/${customerId}/operations/${operationId}/details?isReport=true`
        );

        expect(req.request.method).toEqual('GET');
      });
    });

    describe('when is not report', () => {
      it('should call getDetails from service', () => {
        service.getDetails(1, 1, false).subscribe();

        const req = httpMock.expectOne(
          `${appConfigStub.apiBaseUrl}customers/${customerId}/operations/${operationId}/details`
        );

        expect(req.request.method).toEqual('GET');
      });
    });
  });
});
