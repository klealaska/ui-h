import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IBankAccountDetailsContent,
  IEditBankAccountParams,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';

@Component({
  selector: 'ax-bam-edit-footer',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './bam-edit-footer.component.html',
  styleUrls: ['./bam-edit-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BamEditFooterComponent {
  @Input() content: IBankAccountDetailsContent;
  @Input() saveDisabled = true;
  @Output() cancelClick: EventEmitter<void> = new EventEmitter();
  @Output() saveClick: EventEmitter<void> = new EventEmitter();
}
