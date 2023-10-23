import { Component, OnInit } from '@angular/core';
import { PopBamListFacade } from '@ui-coe/bank-account-mgmt/pop-list/data-access';
import { IBankAccountMapped, IPopBamListContent } from '@ui-coe/bank-account-mgmt/shared/types';
import { Observable, delay } from 'rxjs';
import {
  BankAccountSharedFacade,
  ContentFacade,
  HeaderService,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import { Router } from '@angular/router';

@Component({
  selector: 'ax-bank-account-list',
  templateUrl: './bank-account-pop-list-container.component.html',
  styleUrls: ['./bank-account-pop-list-container.component.scss'],
})
export class BankAccountPopListContainerComponent implements OnInit {
  public accounts$: Observable<IBankAccountMapped[]> = this._bankAccountListFacade.bankAccounts$;
  public content$: Observable<IPopBamListContent> = this._contentFacade.getPopBankAccountsContent();
  public loading$: Observable<boolean> = this._bankAccountListFacade.listLoading$;

  constructor(
    private readonly _bankAccountListFacade: PopBamListFacade,
    private readonly _contentFacade: ContentFacade,
    private readonly _router: Router,
    private readonly _headerService: HeaderService,
    private readonly _sharedFacade: BankAccountSharedFacade
  ) {}

  public ngOnInit(): void {
    this._headerService.setHeaderLabel(this._router.url);
    this._bankAccountListFacade.dispatchGetBankAccounts();
  }

  public handleAddAccount(): void {
    this._sharedFacade.dispatchSetSidePanelComponentId('add');
  }

  public handleAccountSelection(accountId: string): void {
    this._sharedFacade.dispatchSetSelectedAccountId(accountId);
  }
}
