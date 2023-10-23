import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IBankAccountEditContent,
  IBankAccountMapped,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { FormControl } from '@angular/forms';
import { InputComponent } from '@ui-coe/shared/ui-v2';

@Component({
  selector: 'ax-bank-account-edit',
  standalone: true,
  imports: [CommonModule, InputComponent],
  templateUrl: './bank-account-edit.component.html',
  styleUrls: ['./bank-account-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountEditComponent implements OnInit {
  @Input() content: IBankAccountEditContent;
  @Input() account: IBankAccountMapped;
  @Output() nicknameChange: EventEmitter<void> = new EventEmitter();

  public nicknameControl: FormControl = new FormControl('');

  public ngOnInit(): void {
    this.nicknameControl.setValue(this.account?.nickName);
    this.nicknameControl.valueChanges.subscribe(() => this.onNicknameChange());
  }

  public onNicknameChange(): void {
    this.nicknameChange.emit(this.nicknameControl.value?.trim());
  }
}
