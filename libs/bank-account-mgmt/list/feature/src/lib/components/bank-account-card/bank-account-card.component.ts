import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  BankAccountStatusEnum,
  IBankAccountListContent,
  IBankAccountMapped,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { getAccountDisplayName } from '@ui-coe/bank-account-mgmt/shared/util';
import { tooltip } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-bank-account-card',
  templateUrl: './bank-account-card.component.html',
  styleUrls: ['./bank-account-card.component.scss'],
})
export class BankAccountCardComponent implements OnInit {
  @Input() public account: IBankAccountMapped;
  @Input() public content: IBankAccountListContent;
  @Output() public bankAccountSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('accountName') accountNameEl: ElementRef;

  public accountDisplayName: string;
  public isDefault: boolean; // TODO set value once the API can send this info
  public bankAccountStatusEnum = BankAccountStatusEnum;
  public bankAccountStatus: string;
  public tooltip: tooltip;

  public ngOnInit(): void {
    this.bankAccountStatus = this.account.bankAccountStatus.toLowerCase();
    this.accountDisplayName = getAccountDisplayName(this.account);
    this.tooltip = {
      tooltipText: this.accountDisplayName,
      tooltipStyle: 'primary',
      tooltipPosition: 'below',
      pointerPosition: 'center',
      dynamicOverflow: true,
    };
  }
}
