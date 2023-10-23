import { Component, OnInit } from '@angular/core';
import { BankAccountListFacade } from '@ui-coe/bank-account-mgmt/list/data-access';
import {
  IBankAccountListContent,
  IBankAccountMapped,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { Observable } from 'rxjs';
import { ContentFacade, HeaderService } from '@ui-coe/bank-account-mgmt/shared/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonToggleContent } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-bank-account-list',
  templateUrl: './bank-account-list-container.component.html',
  styleUrls: ['./bank-account-list-container.component.scss'],
})
export class BankAccountListContainerComponent implements OnInit {
  public accounts$: Observable<IBankAccountMapped[]> = this._bankAccountListFacade.bankAccounts$;
  public content$: Observable<IBankAccountListContent> =
    this._contentFacade.getBankAccountsContent();
  public loading$: Observable<boolean> = this._bankAccountListFacade.listLoading$;
  public buttonToggleContent: ButtonToggleContent[] = [{ text: 'Active' }, { text: 'Inactive' }];

  constructor(
    private readonly _bankAccountListFacade: BankAccountListFacade,
    private readonly _contentFacade: ContentFacade,
    private readonly _router: Router,
    private readonly _headerService: HeaderService,
    private readonly _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this._headerService.setHeaderLabel(this._router.url);
    this._bankAccountListFacade.dispatchGetBankAccounts();
  }

  public handleAddAccount(): void {
    this._router.navigate(['../add'], { relativeTo: this._route });
  }

  public handleAccountSelection(accountId: string): void {
    this._router.navigate([`../${accountId}`], { relativeTo: this._route });
  }
}
