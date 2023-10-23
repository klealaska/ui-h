import { Injectable } from '@angular/core';
import { ConfigService } from '@ui-coe/shared/util/services';
import {
  IBankAccount,
  IBankAccountMapped,
  IEditBankAccountParams,
  IUnmaskedBankAccount,
  IUpdateStatusParams,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BankAccountDetailsService {
  private readonly _baseUrl: string = this._configService.get('bankAccountMgmtApiBaseUrl');

  constructor(private readonly _configService: ConfigService, private readonly _http: HttpClient) {}

  public getBankAccount(bankAccountId: string): Observable<IBankAccountMapped> {
    return this._http.get<IBankAccountMapped>(`${this._baseUrl}/bank-accounts/${bankAccountId}`);
  }

  public editBankAccount(editParams: IEditBankAccountParams): Observable<IBankAccount> {
    return this._http.put<IBankAccount>(
      `${this._baseUrl}/bank-accounts/${editParams.accountId}`,
      editParams
    );
  }

  public activateBankAccount(id: string): Observable<IBankAccountMapped> {
    return this._http.put<IBankAccountMapped>(`${this._baseUrl}/bank-accounts/${id}/activate`, id);
  }

  public deactivateBankAccount(id: string): Observable<IBankAccountMapped> {
    return this._http.put<IBankAccountMapped>(
      `${this._baseUrl}/bank-accounts/${id}/deactivate`,
      id
    );
  }

  public unmaskAccountNumber(id: string): Observable<IUnmaskedBankAccount> {
    return this._http.get<IUnmaskedBankAccount>(`${this._baseUrl}/bank-accounts/${id}/unmask`);
  }

  public updateStatus(updateStatusParams: IUpdateStatusParams): Observable<IBankAccountMapped> {
    return this._http.put<IBankAccountMapped>(
      `${this._baseUrl}/bank-accounts/${updateStatusParams.accountId}/update-status`,
      updateStatusParams
    );
  }
}
