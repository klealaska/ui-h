import { Injectable } from '@angular/core';
import { ConfigService } from '@ui-coe/shared/util/services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MainService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}

  private readonly _tenantApiBaseUrl = this.configService.get('tenantApiBaseUrl');

  public getAppData(): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(this._tenantApiBaseUrl);
  }
}
