import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  IBankAccountAddContent,
  IBankAccountDetailsContent,
  IBankAccountEditContent,
  IBankAccountHeaderContent,
  IBankAccountListContent,
  IPopBamListContent,
} from '@ui-coe/bank-account-mgmt/shared/types';

@Injectable()
export class ContentFacade {
  // TODO change this to use content service and facade that wraps the TranslateService
  constructor(private readonly _translateService: TranslateService) {}

  public getHeaderContent(key: string): Observable<IBankAccountHeaderContent> {
    return this._translateService.get(key);
  }

  public getBankAccountsContent(): Observable<IBankAccountListContent> {
    return this._translateService.get('bankAccountList');
  }

  public getBankAccountAddContent(): Observable<IBankAccountAddContent> {
    return this._translateService.get('bankAccountAdd');
  }

  public getBankAccountEditContent(): Observable<IBankAccountEditContent> {
    return this._translateService.get('bankAccountEdit');
  }

  public getBankAccountDetailsContent(): Observable<IBankAccountDetailsContent> {
    return this._translateService.get('bankAccountDetails');
  }

  public getPopBankAccountsContent(): Observable<IPopBamListContent> {
    return this._translateService.get('popBamList');
  }
}
