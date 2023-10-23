import {
  IBankAccountAddContent,
  IBankAccountDetailsContent,
  IBankAccountEditContent,
  IBankAccountHeaderContent,
  IBankAccountListContent,
  IPopBamListContent,
} from '@ui-coe/bank-account-mgmt/shared/types';

export const bankAccountAddContentMock: IBankAccountAddContent = {
  bankAccountAddHeader: 'Add Account',
  nicknameLabel: 'Bank account nickname',
  nicknamePlaceholder: 'Enter a display name',
  routingNumberLabel: 'Routing number',
  routingNumberPlaceholder: 'Enter 9 digits',
  accountNumberLabel: 'Account number',
  accountNumberPlaceholder: 'Enter up to 17 digits',
  accountTypeLabel: 'Account type',
  accountOwnerLabel: 'Account owner',
  accountTypePlaceholder: 'Select account type',
  tAndCTitle: 'AvidXchange Bank Account Terms and Conditions',
  tAndCLastUpdatedLabel: 'Last updated',
  tAndCAcceptLabel: 'I have read and agree to the AvidXchange Bank Account Terms and Conditions',
  cancelBtnLabel: 'Cancel',
  addBtnLabel: 'Add account',
  routingNumberTooltip:
    'Your routing number is the first set of digits at the bottom of your check.',
  accountNumberTooltip:
    'Your account number is found between the routing number and the check number at the bottom of your check.',
};

export const bankAccountsEditContentMock: IBankAccountEditContent = {
  header: 'Edit account',
  inputLabel: 'Bank account nickname',
  cancelBtn: 'Cancel',
  saveBtn: 'Save',
};

export const bankAccountsListContentMock: IBankAccountListContent = {
  addAccountBtn: 'Add account',
  addAccountDesc: 'Add a bank account for processing payments',
  myBankAccountLabel: 'My bank account',
  bankAccountHeaderLabel: 'Bank Accounts',
  accountNumberLabel: 'Account number',
};

export const popBamListContent: IPopBamListContent = {
  addAccountBtn: 'Add account',
  addAccountDesc: 'Add a bank account for processing payments',
  accountNumberCol: 'Account number',
  routingNumberCol: 'Routing number',
  bankCol: 'Banking Institution',
  customerCol: 'Customer',
  statusCol: 'Status',
};

export const bankAccountAddHeaderContentMock: IBankAccountHeaderContent = {
  firstWord: 'Add ',
  secondWord: 'Account',
};

export const bankAccountsHeaderContentMock: IBankAccountHeaderContent = {
  firstWord: 'Bank ',
  secondWord: 'Accounts',
};

export const bankAccountDetailsContentMock: IBankAccountDetailsContent = {
  approveBtn: 'Approve',
  rejectBtn: 'Reject',
  editAccountBtn: 'Edit',
  deactivateBtn: 'Deactivate',
  reactivateBtn: 'Reactivate',
  cancelBtn: 'Cancel',
  saveBtn: 'Save',
  routingNumberLabel: 'Routing number',
  accountNumberLabel: 'Account number',
  accountHolderLabel: 'Account holder',
  bankLabel: 'Banking institution',
  editAccountNicknameLabel: 'Account nickname',
  accountTypeLabel: 'Account type',
  deactivateDialog: {
    title: 'Deactivate account',
    message:
      'This account will be inactive and can no longer be used for processing payments, refunds, or other transactions.',
    actionBtnText: 'Deactivate',
    cancelBtnText: 'Cancel',
  },
  detailHeader: {
    accountInfo: 'Account information',
    viewHistory: 'History',
  },
};
