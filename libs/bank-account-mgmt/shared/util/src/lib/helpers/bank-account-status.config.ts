import { BankAccountStatusEnum } from '@ui-coe/bank-account-mgmt/shared/types';
import { TagType } from '@ui-coe/shared/types';

export function getStatusTagType(status: string): TagType {
  switch (status?.toLowerCase()) {
    case BankAccountStatusEnum.ACTIVE:
      return 'success';
    case BankAccountStatusEnum.FAILED:
      return 'critical';
    case BankAccountStatusEnum.LOCKED:
      return 'informational';
    case BankAccountStatusEnum.PENDING:
      return 'warning';
    default:
      return 'default';
  }
}
