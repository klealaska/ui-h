import { Injectable } from '@angular/core';
import { ConfigService } from '@ui-coe/shared/util/services';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PopBamService {
  private readonly _baseUrl: string = this._configService.get('bankAccountMgmtApiBaseUrl');

  constructor(private readonly _configService: ConfigService, private readonly _http: HttpClient) {}

  public getBankAccounts(): Observable<IBankAccountMapped[]> {
    return this._http.get<IBankAccountMapped[]>(`${this._baseUrl}/bank-accounts`);
  }
}
