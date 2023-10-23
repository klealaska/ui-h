import { Inject, Injectable } from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(CACHE_MANAGER) private _cacheManager: Cache,
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService
  ) {}

  public getToken(): Observable<string> {
    const body = {
      application_id: this._configService.get('AUTH_ID'),
      application_secret: this._configService.get('AUTH_SECRET'),
      application: 'BankAccountManagement',
    };
    return this._httpService.post(`${this._configService.get('JWT_AUTH_URL')}`, body).pipe(
      map(({ data }: AxiosResponse<any>) => `Bearer ${data.return_data.access_token}`),
      tap(bearerToken => {
        this._cacheManager.set('token', bearerToken);
        setTimeout(() => {
          this._cacheManager.del('token');
        }, 180000);
      }),
      catchError(error => of(error))
    );
  }
}
