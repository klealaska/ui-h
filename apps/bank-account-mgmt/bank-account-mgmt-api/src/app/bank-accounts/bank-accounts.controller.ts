import { Body, Controller, Get, Param, Post, Headers, Put } from '@nestjs/common';
import {
  IBankAccount,
  IBankAccountMapped,
  IUnmaskedBankAccount,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { Observable } from 'rxjs';
import { BankAccountsService } from './bank-accounts.service';
import {
  ICreateBankAccountParams,
  IUpdateBankAccountParams,
  IUpdateStatusParams,
} from '../models/bank-account.model';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly _bankAccountsService: BankAccountsService) {}

  @Get()
  public getBankAccounts(
    @Headers() headers: { [key: string]: string }
    // ** UPDATE TYPE TO IBANKACCOUNTMAPPED WHEN ISNEW IS READY **
  ): Observable<IBankAccount[]> {
    return this._bankAccountsService.getBankAccounts(headers);
  }

  @Get(':id')
  public getBankAccountDetail(
    @Headers() headers: { [key: string]: string },
    @Param('id') id: string
  ): Observable<IBankAccountMapped> {
    return this._bankAccountsService.getBankAccountDetail(headers, id);
  }

  @Post('add')
  public addBankAccount(
    @Headers() headers: { [key: string]: string },
    @Body() body: ICreateBankAccountParams
  ): Observable<IBankAccount> {
    return this._bankAccountsService.addBankAccount(headers, body);
  }

  @Put(':id')
  public updateBankAccount(
    @Headers() headers: { [key: string]: string },
    @Body() body: IUpdateBankAccountParams
  ): Observable<IBankAccount> {
    return this._bankAccountsService.updateBankAccount(headers, body);
  }

  @Put(':id/activate')
  public activateBankAccount(
    @Headers() headers: { [key: string]: string },
    @Param('id') id: string
  ): Observable<IBankAccount> {
    return this._bankAccountsService.activateBankAccount(headers, id);
  }

  @Put(':id/deactivate')
  public deactivateBankAccount(
    @Headers() headers: { [key: string]: string },
    @Param('id') id: string
  ): Observable<IBankAccount> {
    return this._bankAccountsService.deactivateBankAccount(headers, id);
  }

  @Get(':id/unmask')
  public getUnmaskedAccountNumber(
    @Headers() headers: { [key: string]: string },
    @Param('id') id: string
  ): Observable<IUnmaskedBankAccount> {
    return this._bankAccountsService.getUnmaskedAccountNumber(headers, id);
  }

  @Put(':id/update-status')
  public updateStatus(
    @Headers() headers: { [key: string]: string },
    @Body() body: IUpdateStatusParams
  ): Observable<IBankAccount> {
    return this._bankAccountsService.updateStatus(headers, body);
  }
}
