export interface IBankAccountHeaderContent {
  firstWord: string;
  secondWord: string;
}

export interface IBankAccountListContent {
  addAccountBtn: string;
  addAccountDesc: string;
  myBankAccountLabel: string;
  bankAccountHeaderLabel: string;
  accountNumberLabel: string;
}

export interface IPopBamListContent {
  addAccountBtn: string;
  addAccountDesc: string;
  accountNumberCol: string;
  routingNumberCol: string;
  bankCol: string;
  customerCol: string;
  statusCol: string;
}

export interface IBankAccountAddContent {
  bankAccountAddHeader: string;
  nicknameLabel: string;
  nicknamePlaceholder: string;
  routingNumberLabel: string;
  routingNumberPlaceholder: string;
  accountNumberLabel: string;
  accountNumberPlaceholder: string;
  accountOwnerLabel: string;
  accountTypePlaceholder: string;
  accountTypeLabel: string;
  tAndCTitle: string;
  tAndCLastUpdatedLabel: string;
  tAndCAcceptLabel: string;
  cancelBtnLabel: string;
  addBtnLabel: string;
  routingNumberTooltip: string;
  accountNumberTooltip: string;
}

export interface IBankAccountEditContent {
  header: string;
  inputLabel: string;
  cancelBtn: string;
  saveBtn: string;
}

export interface IBankAccountDetailsContent {
  approveBtn: string;
  rejectBtn: string;
  editAccountBtn: string;
  deactivateBtn: string;
  reactivateBtn: string;
  cancelBtn: string;
  saveBtn: string;
  routingNumberLabel: string;
  accountNumberLabel: string;
  accountHolderLabel: string;
  bankLabel: string;
  editAccountNicknameLabel: string;
  accountTypeLabel: string;
  deactivateDialog: IDeactivateDialogContent;
  detailHeader: IDetailHeaderContent;
}

export interface IDeactivateDialogContent {
  title: string;
  message: string;
  actionBtnText: string;
  cancelBtnText: string;
}

export interface IDetailHeaderContent {
  accountInfo: string;
  viewHistory: string;
}
