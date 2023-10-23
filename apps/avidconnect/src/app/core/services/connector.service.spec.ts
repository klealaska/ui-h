import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub } from '../../../test/test-stubs';

import { ConnectorService } from './connector.service';

describe('ConnectorService', () => {
  let service: ConnectorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(ConnectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get connector from service', () => {
    const params = {
      pageNumber: 1,
    };

    service.getAll(params).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}connectors?pageNumber=1`);
    expect(req.request.method).toEqual('GET');
  });

  it('should call get connector by id from service', () => {
    const connectorId = 1;

    service.getById(connectorId).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}connectors/${connectorId}`);
    expect(req.request.method).toEqual('GET');
  });

  it('should get connector lookup from service', () => {
    const payload = {
      field: 'displayName',
      value: 'test',
    };

    const params = {
      pageSize: 20,
    };

    service.search(payload, params).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}connectors/search?pageSize=${params.pageSize}`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(payload);
  });

  it('should call get connectorSummaryList from service', () => {
    const params = {
      pageNumber: 1,
    };

    service.getSummaryList(params).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}connectors/summarylist?pageNumber=1`
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should get connector logo from service', () => {
    const connectorId = 1;
    service.getLogo(connectorId).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}connectors/${connectorId}/logo`);
    expect(req.request.method).toEqual('GET');
  });

  it('should get connector settings from service', () => {
    const connectorId = 1;
    service.getConnectorSettings(connectorId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}connectors/${connectorId}/settings-schema`
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should get operation types from service', () => {
    const connectorId = 1;
    service.getOperationTypes(connectorId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}connectors/${connectorId}/operationtypes`
    );

    expect(req.request.method).toEqual('GET');
  });

  it('should get operations from service', () => {
    const connectorId = 1;
    service.getOperations(connectorId, {}).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}connectors/${connectorId}/operations`
    );

    expect(req.request.method).toEqual('GET');
  });

  it('should get connectors from service', () => {
    const connectorId = 1;
    service.getCustomers(connectorId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}connectors/${connectorId}/customers`
    );

    expect(req.request.method).toEqual('GET');
  });
});
