import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@ui-coe/shared/util/services';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}
}
