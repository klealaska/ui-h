import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { Schedule, Timezone } from '../../models';
import { BaseAPIService } from './base.service';

const RESOURCE_NAME = 'customers';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService extends BaseAPIService {
  constructor(public http: HttpClient, public config: AppConfig) {
    super(http, config.apiBaseUrl);
  }

  getSchedules(customerId: number, registrationId: number, params?): Observable<Schedule[]> {
    return this.get<Schedule[]>(
      `${RESOURCE_NAME}/${customerId}/registrations/${registrationId}/schedules`,
      { ...params }
    );
  }

  addSchedule(customerId: number, registrationId: number, schedule: Schedule): Observable<void> {
    return this.post<void>(
      `${RESOURCE_NAME}/${customerId}/registrations/${registrationId}/schedules`,
      schedule
    );
  }

  updateSchedule(
    customerId: number,
    registrationId: number,
    scheduleId: number,
    schedule: Schedule
  ): Observable<void> {
    return this.post<void>(
      `${RESOURCE_NAME}/${customerId}/registrations/${registrationId}/schedules/${scheduleId}`,
      schedule
    );
  }

  getTimeZones(): Observable<Timezone[]> {
    return this.get<Timezone[]>(`timezones`);
  }
}
