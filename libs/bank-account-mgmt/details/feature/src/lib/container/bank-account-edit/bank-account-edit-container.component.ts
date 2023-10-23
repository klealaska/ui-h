import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideSheetV2Component } from '@ui-coe/shared/ui-v2';
import { BamEditHeaderComponent } from '../../components';
import { BankAccountEditComponent } from '../../components/bank-account-edit/bank-account-edit.component';
import { BamEditFooterComponent } from '../../components/footers/bam-edit-footer/bam-edit-footer.component';
import { BankAccountDetailFacade } from '@ui-coe/bank-account-mgmt/details/data-access';
import {
  BankAccountSharedFacade,
  ContentFacade,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import {
  IBankAccountEditContent,
  IBankAccountMapped,
  IEditBankAccountParams,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { Observable } from 'rxjs';

@Component({
  selector: 'ax-bank-account-edit-container',
  templateUrl: './bank-account-edit-container.component.html',
  styleUrls: ['./bank-account-edit-container.component.scss'],
  standalone: true,
  imports: [
    SideSheetV2Component,
    BamEditHeaderComponent,
    BamEditFooterComponent,
    BankAccountEditComponent,
    CommonModule,
  ],
})
export class BankAccountEditContainerComponent {
  public account$: Observable<IBankAccountMapped> = this._bankAccountFacade.bankAccount$;
  public content$: Observable<IBankAccountEditContent> =
    this._contentFacade.getBankAccountEditContent();
  public saveDisabled = true;

  private _editParams: IEditBankAccountParams;

  constructor(
    private readonly _bankAccountFacade: BankAccountDetailFacade,
    private readonly _sharedFacade: BankAccountSharedFacade,
    private readonly _contentFacade: ContentFacade
  ) {}

  public closeSidePanel(): void {
    this._sharedFacade.dispatchResetSidePanel();
    this._bankAccountFacade.dispatchResetDetails();
  }

  public backToDetails() {
    this._sharedFacade.dispatchSetSidePanelComponentId('detail');
  }

  public save() {
    if (this._editParams.nickName) {
      this._bankAccountFacade.dispatchEditBankAccount(this._editParams);
      this.backToDetails();
    }
  }

  public onNicknameChange(account: IBankAccountMapped, nickName: string): void {
    this._editParams = {
      nickName,
      accountId: account.accountId,
      externalBankReference: account.externalBankReference,
    };
    this.saveDisabled = !nickName || nickName === account.nickName;
  }
}
