import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ExecutionService } from './execution.service';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub } from '../../../test/test-stubs';
describe('ExecutionService', () => {
  let service: ExecutionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(ExecutionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents', () => {
    const customerId = 1;
    const executionId = 1;
    describe('when is report', () => {
      it('should call getEvents from service', () => {
        service.getEvents(1, 1, true).subscribe();

        const req = httpMock.expectOne(
          `${appConfigStub.apiBaseUrl}customers/${customerId}/executions/${executionId}/events?isReport=true`
        );

        expect(req.request.method).toEqual('GET');
      });
    });

    describe('when is not report', () => {
      it('should call getEvents from service', () => {
        service.getEvents(1, 1, false).subscribe();

        const req = httpMock.expectOne(
          `${appConfigStub.apiBaseUrl}customers/${customerId}/executions/${executionId}/events`
        );

        expect(req.request.method).toEqual('GET');
      });
    });
  });

  describe('getArtifacts', () => {
    const customerId = 1;
    const executionId = 1;
    it('should call getArtifacts from service', () => {
      service.getArtifacts(1, 1).subscribe();

      const req = httpMock.expectOne(
        `${appConfigStub.apiBaseUrl}customers/${customerId}/executions/${executionId}/artifacts`
      );

      expect(req.request.method).toEqual('GET');
    });
  });
});
