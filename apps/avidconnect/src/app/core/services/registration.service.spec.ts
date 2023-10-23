import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { registrationEnablementStub, registrationStub } from '../../../test/test-stubs';
import { RegistrationService } from './registration.service';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub } from '../../../test/test-stubs';
describe('RegistrationService', () => {
  let service: RegistrationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(RegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const customerId = 1;
  const registrationId = 1;
  const operationTypeId = 1;

  it('should call getRegistrationsDetail from service', () => {
    service.getRegistrationsDetail(customerId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/details`
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should call getById from service', () => {
    service.getById(customerId, registrationId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/${registrationId}`
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should call getEnablements from service', () => {
    service.getEnablements(customerId, registrationId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/${registrationId}/registrationenablements`
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should post registration to registration service', () => {
    const registration = registrationStub;

    service.addRegistration(customerId, registration).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations`
    );
    expect(req.request.method).toEqual('POST');
  });

  it('should post saveEnablements to registration service', () => {
    service.saveEnablements(customerId, registrationId, [registrationEnablementStub]).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/${registrationId}/registrationenablements`
    );
    expect(req.request.method).toEqual('POST');
  });

  it('should post postMappingFile to registration service', () => {
    service.postMappingFile(customerId, registrationId, operationTypeId, null).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}` +
        `/registrations/${registrationId}/registrationenablements/mapping-file?operationTypeId=1`
    );
    expect(req.request.method).toEqual('POST');
  });
});
