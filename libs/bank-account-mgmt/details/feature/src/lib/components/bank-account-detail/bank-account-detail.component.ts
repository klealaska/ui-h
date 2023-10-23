import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  IBankAccountDetailsContent,
  IBankAccountMapped,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { ButtonComponent, TagComponent } from '@ui-coe/shared/ui-v2';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BamPanelSkeletonComponent } from '@ui-coe/bank-account-mgmt/shared/ui';
import { BankAccountMgmtSharedUiModule } from '@ui-coe/bank-account-mgmt/shared/ui';
import { getStatusTagType } from '@ui-coe/bank-account-mgmt/shared/util';

@Component({
  selector: 'ax-bank-account-detail',
  templateUrl: './bank-account-detail.component.html',
  styleUrls: ['./bank-account-detail.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    MatIconModule,
    CommonModule,
    BamPanelSkeletonComponent,
    BankAccountMgmtSharedUiModule,
    TagComponent,
  ],
})
export class BankAccountDetailComponent implements OnChanges {
  @Input() public account: IBankAccountMapped;
  @Input() public content: IBankAccountDetailsContent;
  @Input() public unmaskedAccountNumber: string;
  @Output() public maskClick: EventEmitter<string> = new EventEmitter<string>();
  public statusTagType: string;
  public showUnmasked = false;

  ngOnChanges({ account }: SimpleChanges) {
    if (account && account.currentValue) {
      this.statusTagType = getStatusTagType(account.currentValue.bankAccountStatus);
    }
  }

  public handleUnmaskClick(): void {
    this.showUnmasked = !this.showUnmasked;

    if (!this.unmaskedAccountNumber) {
      this.maskClick.emit(this.account?.accountId);
    }
  }
}
