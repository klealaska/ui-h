import { Component, OnInit } from '@angular/core';
import {
  BankAccountStatusEnum,
  IBankAccountDetailsContent,
  IBankAccountMapped,
  IDetailBtnEmitEvent,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { tap, take, Observable } from 'rxjs';
import {
  BankAccountSharedFacade,
  ContentFacade,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import { BankAccountDetailFacade } from '@ui-coe/bank-account-mgmt/details/data-access';
import { SideSheetV2Component } from '@ui-coe/shared/ui-v2';
import { BamDetailHeaderComponent, BankAccountDetailComponent } from '../../components';
import { CommonModule } from '@angular/common';
import { BamPanelHeaderSkeletonComponent } from '@ui-coe/bank-account-mgmt/shared/ui';
import { BamDetailFooterComponent } from '../../components/footers/bam-detail-footer/bam-detail-footer.component';

@Component({
  selector: 'ax-bank-account-detail-container',
  templateUrl: './bank-account-detail-container.component.html',
  styleUrls: ['./bank-account-detail-container.component.scss'],
  standalone: true,
  imports: [
    SideSheetV2Component,
    BamDetailHeaderComponent,
    BamDetailFooterComponent,
    BankAccountDetailComponent,
    CommonModule,
    BamPanelHeaderSkeletonComponent,
  ],
})
export class BankAccountDetailContainerComponent implements OnInit {
  public account$: Observable<IBankAccountMapped> = this._bankAccountFacade.bankAccount$;
  public content$: Observable<IBankAccountDetailsContent> =
    this._contentFacade.getBankAccountDetailsContent();
  // .pipe(tap((content: IBankAccountDetailsContent) => this.setDialogContent(content)));

  public unmaskedAccountNumber$: Observable<string> =
    this._bankAccountFacade.unmaskedAccountNumber$;

  public activationBtnContent: string;
  // public isEdit = false;
  // private _dialogData: DialogDataV2;
  // public dialogRef: MatDialogRef<DialogV2Component>;

  constructor(
    private readonly _bankAccountFacade: BankAccountDetailFacade,
    private readonly _sharedFacade: BankAccountSharedFacade,
    private readonly _contentFacade: ContentFacade // private readonly _dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this._sharedFacade.selectedAccountId$
      .pipe(
        take(1),
        tap((id: string) => this._bankAccountFacade.dispatchGetBankAccount(id))
      )
      .subscribe();
  }

  public handleSidePanelClose(): void {
    this._sharedFacade.dispatchResetSidePanel();
    this._bankAccountFacade.dispatchResetDetails();
  }

  public handleMaskClick(accountId: string): void {
    this._bankAccountFacade.dispatchGetUnmaskedAccountNumber(accountId);
  }

  // public handleEditClick(): void {
  //   this._sharedFacade.dispatchSetSidePanelComponentId('edit');
  // }

  public handleDetailButtonClick(e: IDetailBtnEmitEvent): void {
    switch (e.account.bankAccountStatus.toLocaleLowerCase()) {
      // case BankAccountStatusEnum.ACTIVE:
      //   this.handleDeactivateDialog(e.account.accountId);
      //   break;
      // case BankAccountStatusEnum.INACTIVE:
      // case BankAccountStatusEnum.LOCKED:
      //   this._bankAccountFacade.dispatchActivateAccount(e.account.accountId);
      //   break;
      case BankAccountStatusEnum.PENDING:
      case BankAccountStatusEnum.FAILED:
        this._bankAccountFacade.dispatchStatusUpdate({
          accountId: e.account.accountId,
          status: e.updatedStatus,
        });
        break;
    }
  }

  // private handleDeactivateDialog(accountId: string): void {
  //   this.dialogRef = this._dialog.open(DialogV2Component, { data: this._dialogData });
  //   this.dialogRef.afterClosed().subscribe(({ event }) => {
  //     if (event === 'Deactivate') {
  //       this._bankAccountFacade.dispatchDeactivateAccount(accountId);
  //     }
  //   });
  // }

  // private setDialogContent({ deactivateDialog }: IBankAccountDetailsContent) {
  //   this._dialogData = {
  //     draggable: false,
  //     type: 'alert',
  //     closeIcon: true,
  //     title: deactivateDialog.title,
  //     message: deactivateDialog.message,
  //     overline: {
  //       hasAlertIcon: true,
  //       text: 'Warning',
  //     },
  //     actionBtn: {
  //       type: 'primary',
  //       color: 'critical',
  //       text: deactivateDialog.actionBtnText,
  //     },
  //     cancelBtn: {
  //       type: 'secondary',
  //       color: 'critical',
  //       text: deactivateDialog.cancelBtnText,
  //     },
  //   };
  // }
}
