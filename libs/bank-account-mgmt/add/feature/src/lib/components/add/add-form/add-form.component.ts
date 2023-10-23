import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BankAccountMgmtAddDataAccessModule } from '@ui-coe/bank-account-mgmt/add/data-access';
import {
  BankAccountTypeEnum,
  IBankAccountAddContent,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { DropdownOptions, tooltip } from '@ui-coe/shared/types';
import {
  ButtonComponent,
  DropdownComponent,
  InputComponent,
  SharedUiV2Module,
} from '@ui-coe/shared/ui-v2';
import { AddFormSkeletonComponent } from './skeleton/add-form.skeleton.component';

@Component({
  selector: 'ax-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiV2Module,
    DropdownComponent,
    BankAccountMgmtAddDataAccessModule,
    InputComponent,
    ButtonComponent,
    AddFormSkeletonComponent,
  ],
})
export class AddFormComponent implements OnInit {
  @Input() public content: IBankAccountAddContent;
  @Input() public addAccountFormGroup: FormGroup;
  @Input() public loading: boolean;
  @Input() public tooltipConfig: { [key: string]: tooltip };

  public accountTypeOptions: DropdownOptions[];

  public ngOnInit(): void {
    this.accountTypeOptions = Object.values(BankAccountTypeEnum).map((value: string) => ({
      text: value,
      value,
    }));
  }
}
