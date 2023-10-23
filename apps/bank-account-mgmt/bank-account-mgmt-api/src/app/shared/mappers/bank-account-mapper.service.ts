import { IBankAccount, IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import * as moment from 'moment';
import { NEW_FLAG_DURATION } from '../constants';

export function bankAccountListMapper(bankAccountCollection: IBankAccount[]): IBankAccountMapped[] {
  const updatedBankAccounts: IBankAccountMapped[] = [];
  for (const account of bankAccountCollection) {
    updatedBankAccounts.push({ ...account, isNew: calcIsNew(account) });
  }
  return updatedBankAccounts;
}

export function bankAccountDetailMapper(bankAccount: IBankAccount): IBankAccountMapped {
  return { ...bankAccount, isNew: calcIsNew(bankAccount) };
}

function calcIsNew(account: IBankAccount): boolean {
  const createdDate = moment(account.createdTimestamp);
  const currentDate = moment();
  const duration = moment.duration(currentDate.diff(createdDate));
  return duration.asHours() < NEW_FLAG_DURATION;
}
