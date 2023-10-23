import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import {
  IBamDetailButtonConfig,
  IBankAccountDetailsContent,
  IBankAccountMapped,
  IDetailBtnEmitEvent,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { BamPanelFooterSkeletonComponent } from '@ui-coe/bank-account-mgmt/shared/ui';
import { CommonModule } from '@angular/common';
import { getBankAccountDetailButtonConfig } from '@ui-coe/bank-account-mgmt/shared/util';

@Component({
  selector: 'ax-bam-detail-footer',
  templateUrl: './bam-detail-footer.component.html',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BamPanelFooterSkeletonComponent],
})
export class BamDetailFooterComponent implements OnChanges {
  @Input() content: IBankAccountDetailsContent;
  @Input() account: IBankAccountMapped;
  // @Output() editClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() detailButtonClick: EventEmitter<IDetailBtnEmitEvent> =
    new EventEmitter<IDetailBtnEmitEvent>();

  public buttonConfig: IBamDetailButtonConfig[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['account']?.currentValue) {
      this.getDetailButtonConfig(changes['account']?.currentValue.bankAccountStatus);
    }
  }

  public handleButtonClick(updatedStatus: string): void {
    this.detailButtonClick.emit({ account: this.account, updatedStatus });
  }

  private getDetailButtonConfig(accountStatus: string): void {
    this.buttonConfig = getBankAccountDetailButtonConfig(accountStatus, this.content);
  }
}
