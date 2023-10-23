import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IBankAccountDetailsContent } from '@ui-coe/bank-account-mgmt/shared/types';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  InputComponent,
  SpinnerComponent,
  TagComponent,
} from '@ui-coe/shared/ui-v2';
import { BankAccountMgmtSharedUiModule } from '@ui-coe/bank-account-mgmt/shared/ui';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ax-bam-edit-header',
  templateUrl: './bam-edit-header.component.html',
  styleUrls: ['./bam-edit-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SpinnerComponent,
    TagComponent,
    BankAccountMgmtSharedUiModule,
    MatIconModule,
  ],
})
export class BamEditHeaderComponent {
  @Input() public content: IBankAccountDetailsContent;
  @Output() public backClick: EventEmitter<void> = new EventEmitter();
}
