import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub, scheduleStub } from '../../../test/test-stubs';
import { ScheduleService } from './schedule.service';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(ScheduleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get schedules from service', () => {
    const customerId = 1;
    const registrationId = 1;
    service.getSchedules(customerId, registrationId).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/${registrationId}/schedules`
    );

    expect(req.request.method).toEqual('GET');
  });

  it('should post new schedule to service', () => {
    const customerId = 1;
    const registrationId = 1;
    const schedule = scheduleStub;
    service.addSchedule(customerId, registrationId, schedule).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/${registrationId}/schedules`
    );

    expect(req.request.method).toEqual('POST');
  });

  it('should post an existing schedule to service', () => {
    const customerId = 1;
    const registrationId = 1;
    const scheduleId = 1;
    const schedule = scheduleStub;
    service.updateSchedule(customerId, registrationId, scheduleId, schedule).subscribe();

    const req = httpMock.expectOne(
      `${appConfigStub.apiBaseUrl}customers/${customerId}/registrations/${registrationId}/schedules/${scheduleId}`
    );

    expect(req.request.method).toEqual('POST');
  });
});
