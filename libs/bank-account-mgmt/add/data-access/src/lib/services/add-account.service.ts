import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddBankAccountParams, IBankAccount } from '@ui-coe/bank-account-mgmt/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';
import { Observable } from 'rxjs';

@Injectable()
export class AddAccountService {
  private readonly _baseUrl: string = this._configService.get('bankAccountMgmtApiBaseUrl');

  constructor(private readonly _configService: ConfigService, private readonly _http: HttpClient) {}

  public addBankAccount(accountForm: IAddBankAccountParams): Observable<IBankAccount> {
    return this._http.post<IBankAccount>(`${this._baseUrl}/bank-accounts/add`, accountForm);
  }
}
