import { Injectable, HttpException } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import {
  IBankAccount,
  IBankAccountMapped,
  IUnmaskedBankAccount,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { AxiosResponse } from 'axios';
import { HttpConfigService } from '../../services/http-config.service';
import { MockHttpService } from '@ui-coe/shared/bff/data-access';
import { HttpService } from '@nestjs/axios';
import {
  ICreateBankAccountParams,
  IUpdateBankAccountParams,
  IUpdateStatusParams,
} from '../models/bank-account.model';
import { environment } from '../../environments/environment';
import { bankAccountDetailMapper } from '../shared';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly _httpConfigService: HttpConfigService,
    private readonly _mockHttpService: MockHttpService,
    private readonly _httpService: HttpService
  ) {}

  public getBankAccounts(headers: { [key: string]: string }): Observable<IBankAccount[]> {
    return this._httpService
      .get<IBankAccount[]>(`${this._httpConfigService.getBankAccounts()}`, { headers })
      .pipe(
        map((bankAccountList: AxiosResponse<IBankAccount[]>) => {
          // ** UNCOMMENT FOR ISNEW FLAG UPDATE **
          // const clonedList: IBankAccount[] = [...bankAccountList.data];
          // return bankAccountListMapper(clonedList);

          // ** DELETE NEXT LINE WHEN ISNEW IS READY **
          return bankAccountList.data;
        }),
        catchError(error => {
          throw new HttpException(error, error.response?.status);
        })
      );
  }

  public getBankAccountDetail(
    headers: { [key: string]: string },
    id: string
  ): Observable<IBankAccountMapped> {
    if (!environment.mock) {
      return this._httpService
        .get<IBankAccount>(`${this._httpConfigService.getBankAccountById()}/${id}`, { headers })
        .pipe(
          map((bankAccountDetail: AxiosResponse<IBankAccount>) =>
            bankAccountDetailMapper(bankAccountDetail.data)
          ),
          catchError(error => {
            throw new HttpException(error, error.response?.status);
          })
        );
    } else {
      return this._httpService
        .get<IBankAccount[]>(`${this._httpConfigService.getBankAccounts()}`)
        .pipe(
          map(
            (response: AxiosResponse<IBankAccountMapped[]>) =>
              response.data.filter(account => {
                return account.accountId === id;
              })[0]
          )
        );
    }
  }

  public addBankAccount(
    headers: { [key: string]: string },
    body: ICreateBankAccountParams
  ): Observable<IBankAccount> {
    return this._httpService
      .post<IBankAccount>(`${this._httpConfigService.postBankAccount()}`, body, { headers })
      .pipe(
        map((bankAccountDetail: AxiosResponse<IBankAccount>) => bankAccountDetail.data),
        catchError(error => {
          throw new HttpException(error, error.response?.status);
        })
      );
  }

  public updateBankAccount(
    headers: { [key: string]: string },
    body: IUpdateBankAccountParams
  ): Observable<IBankAccount> {
    return this._httpService
      .put<IBankAccount>(`${this._httpConfigService.updateBankAccount()}`, body, { headers })
      .pipe(
        map((updatedAccount: AxiosResponse<IBankAccount>) => updatedAccount.data),
        catchError(error => {
          throw new HttpException(error, error.response?.status);
        })
      );
  }

  public activateBankAccount(
    headers: { [key: string]: string },
    id: string
  ): Observable<IBankAccount> {
    return this._httpService
      .put<IBankAccount>(
        `${this._httpConfigService.updateBankAccount()}/${id}/activate`,
        {},
        { headers }
      )
      .pipe(
        map((updatedAccount: AxiosResponse<IBankAccount>) => updatedAccount.data),
        catchError(error => {
          throw new HttpException(error, error.response?.status);
        })
      );
  }

  public deactivateBankAccount(
    headers: { [key: string]: string },
    id: string
  ): Observable<IBankAccount> {
    return this._httpService
      .put<IBankAccount>(
        `${this._httpConfigService.updateBankAccount()}/${id}/deactivate`,
        {},
        { headers }
      )
      .pipe(
        map((updatedAccount: AxiosResponse<IBankAccount>) => updatedAccount.data),
        catchError(error => {
          throw new HttpException(error, error.response?.status);
        })
      );
  }

  public getUnmaskedAccountNumber(
    headers: { [key: string]: string },
    id: string
  ): Observable<IUnmaskedBankAccount> {
    if (!environment.mock) {
      return this._httpService
        .get<IUnmaskedBankAccount>(
          `${this._httpConfigService.getUnmaskedAccountNumber()}/${id}/unmask`,
          { headers }
        )
        .pipe(
          map((bankAccount: AxiosResponse<IUnmaskedBankAccount>) => bankAccount?.data),
          catchError(error => {
            throw new HttpException(error, error.response?.status);
          })
        );
    } else {
      return this._httpService
        .get<IUnmaskedBankAccount>(`${this._httpConfigService.getBankAccountById()}`)
        .pipe(map(() => ({ accountNumber: '123456789', accountId: id })));
    }
  }

  public updateStatus(
    headers: { [key: string]: string },
    body: IUpdateStatusParams
  ): Observable<IBankAccount> {
    return this._httpService
      .put<IBankAccount>(`${this._httpConfigService.updateStatus()}/status`, body, { headers })
      .pipe(
        map((updatedAccount: AxiosResponse<IBankAccount>) => updatedAccount.data),
        catchError(error => {
          throw new HttpException(error, error.response?.status);
        })
      );
  }
}
