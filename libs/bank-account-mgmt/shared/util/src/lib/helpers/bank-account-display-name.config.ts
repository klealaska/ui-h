import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';

export function getAccountDisplayName(account: IBankAccountMapped): string {
  return account.nickName?.trim()
    ? account.nickName
    : account.accountType + ' x' + account.accountNumber.slice(account.accountNumber.length - 4);
}
