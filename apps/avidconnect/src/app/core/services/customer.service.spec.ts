import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { customerStub, groupSettingsStub } from '../../../test/test-stubs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub } from '../../../test/test-stubs';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get customers from service', () => {
    const params = {
      pageNumber: 1,
    };

    service.getAll(params).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}customers?pageNumber=1`);
    expect(req.request.method).toEqual('GET');
  });

  it('should call get customer by Id from service', () => {
    const customerId = 0;

    service.getById(customerId).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}customers/${customerId}`);
    expect(req.request.method).toEqual('GET');
  });

  it('should post customer to customer service', () => {
    const customer = customerStub;

    service.addCustomer(customer).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}customers`);
    expect(req.request.method).toEqual('POST');
  });

  it('should get customer settings from service', () => {
    const customerId = 1;
    service.getSettings(customerId).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}customers/${customerId}/settings`);

    expect(req.request.method).toEqual('GET');
  });

  it('should get customer registration settings from service', () => {
    const customerId = 1;
    const registrationId = 1;

    service.getRegistrationSettings(customerId, registrationId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/${registrationId}/settings`
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should save customer registration settings from service', () => {
    const customerId = 1;
    const registrationId = 1;
    const settings = [groupSettingsStub];

    service.saveRegistrationSettings(customerId, registrationId, settings).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/${registrationId}/settings`
    );
    expect(req.request.method).toEqual('POST');
  });

  it('should post registration settings to service', () => {
    const customerId = 1;
    const settings = [groupSettingsStub];

    service.saveSettings(customerId, settings).subscribe();

    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}customers/${customerId}/settings`);

    expect(req.request.method).toEqual('POST');
  });

  it('should get the agents list', () => {
    const customerId = 1;
    service.getAgentList(customerId).subscribe();
    const req = httpMock.expectOne(`${appConfigStub.apiBaseUrl}customers/${customerId}/agents`);
    expect(req.request.method).toEqual('GET');
  });

  it('should activate an agent', () => {
    const customerId = 1;
    const userCode = '1111 1111 1111 1111';
    service.activateAgent(customerId, userCode).subscribe();
    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/agents/activate`
    );
    expect(req.request.method).toEqual('POST');
  });

  it('should deactivate an agent', () => {
    const agentId = 1234;
    const customerId = 1;
    service.deactivateAgent(agentId, customerId).subscribe();
    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/agents/${agentId}`
    );
    expect(req.request.method).toEqual('DELETE');
  });
});
