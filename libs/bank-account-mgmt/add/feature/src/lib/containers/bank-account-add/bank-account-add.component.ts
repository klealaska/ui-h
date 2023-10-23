import { Component, OnInit } from '@angular/core';
import {
  BankAccountMgmtSharedDataAccessModule,
  BankAccountSharedFacade,
  ContentFacade,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import { IBankAccountAddContent } from '@ui-coe/bank-account-mgmt/shared/types';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AddBankAccountFacade,
  BankAccountMgmtAddDataAccessModule,
} from '@ui-coe/bank-account-mgmt/add/data-access';
import { tooltip } from '@ui-coe/shared/types';
import { ShellConfigService } from '@ui-coe/shared/util/services';
import { CommonModule } from '@angular/common';
import { ButtonComponent, SharedUiV2Module, SideSheetV2Component } from '@ui-coe/shared/ui-v2';
import { BankAccountMgmtSharedUiModule } from '@ui-coe/bank-account-mgmt/shared/ui';
import { AddFormComponent } from '../../components/add/add-form/add-form.component';

@Component({
  selector: 'ax-bank-account-add',
  templateUrl: 'bank-account-add.component.html',
  styleUrls: ['bank-account-add.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedUiV2Module,
    BankAccountMgmtAddDataAccessModule,
    ButtonComponent,
    SideSheetV2Component,
    BankAccountMgmtSharedUiModule,
    BankAccountMgmtSharedDataAccessModule,
    AddFormComponent,
  ],
})
export class BankAccountAddComponent implements OnInit {
  public content$: Observable<IBankAccountAddContent> =
    this._contentFacade.getBankAccountAddContent();
  public loading$: Observable<boolean> = this._addBankAccountFacade.addLoading$;
  public addAccountForm: FormGroup = new FormGroup({
    nickName: new FormControl(''),
    routingNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
      Validators.pattern('[0-9]+'),
    ]),
    accountNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(17),
      Validators.pattern('[0-9]+'),
    ]),
    accountType: new FormControl('', [Validators.required]),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    businessName: new FormControl(''),
  });

  public tooltipConfig$: BehaviorSubject<{ [key: string]: tooltip }> = new BehaviorSubject(null);

  // NOTE: this may be needed when deployed and running from shell
  private assetsPath: string = this._shellConfigService.getMfeManifest('bank-account-mgmt-spa');

  constructor(
    private readonly _contentFacade: ContentFacade,
    private readonly _addBankAccountFacade: AddBankAccountFacade,
    private readonly _shellConfigService: ShellConfigService,
    private readonly _sharedFacade: BankAccountSharedFacade
  ) {}

  public ngOnInit(): void {
    this.content$
      .pipe(
        take(1),
        map(({ accountNumberTooltip, routingNumberTooltip }) => {
          this.tooltipConfig$.next({
            accountNumberTooltip: {
              tooltipText: accountNumberTooltip,
              tooltipImage: `${this.assetsPath}/assets/svg/check_image_account_number.svg`,
              tooltipPosition: 'below',
            },
            routingNumberTooltip: {
              tooltipText: routingNumberTooltip,
              tooltipImage: `${this.assetsPath}/assets/svg/check_image_routing_number.svg`,
              tooltipPosition: 'below',
            },
          });
        })
      )
      .subscribe();
  }

  public onSubmit(formValues): void {
    this._addBankAccountFacade.dispatchAddBankAccount(formValues).subscribe();
  }

  public handleSidePanelClose(): void {
    this._sharedFacade.dispatchSetSidePanelComponentId(null);
  }
}
