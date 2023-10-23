import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ax-bank-account-empty-state',
  templateUrl: 'bank-accounts-empty-state.component.html',
  styleUrls: ['bank-accounts-empty-state.component.scss'],
})
export class BankAccountsEmptyStateComponent {
  @Input() public message: string;
  @Input() public btnLabel: string;
  @Output() public btnClick: EventEmitter<void> = new EventEmitter<void>();
}
