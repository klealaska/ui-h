import { Component, Input } from '@angular/core';

@Component({
  selector: 'ax-bank-account-empty-state',
  templateUrl: 'bank-accounts-empty-state.component.html',
  styleUrls: ['bank-accounts-empty-state.component.scss'],
})
export class BankAccountsEmptyStateComponent {
  @Input() public message: string;
}
