import {
  BankAccountStatusEnum,
  IBamDetailButtonConfig,
  IBankAccountDetailsContent,
} from '@ui-coe/bank-account-mgmt/shared/types';

export function getBankAccountDetailButtonConfig(
  accountStatus: string,
  content: IBankAccountDetailsContent
): IBamDetailButtonConfig[] {
  switch (accountStatus.toLocaleLowerCase()) {
    // ** ADD BACK WHEN CONTEXT SHIFTING COMES BACK
    // case BankAccountStatusEnum.ACTIVE:
    //   return [
    //     {
    //       displayEdit: true,
    //       label: content?.deactivateBtn,
    //       buttonType: 'secondary',
    //       buttonColor: 'critical',
    //     },
    //   ];
    // case BankAccountStatusEnum.INACTIVE:
    // case BankAccountStatusEnum.LOCKED:
    //   return [
    //     {
    //       displayEdit: true,
    //       label: content?.reactivateBtn,
    //       buttonColor: 'default',
    //       buttonType: 'secondary',
    //     },
    //   ];
    case BankAccountStatusEnum.PENDING:
      return [
        {
          // displayEdit: false,
          label: content?.rejectBtn,
          buttonType: 'secondary',
          buttonColor: 'critical',
          updatedStatus: 'failed',
        },
        {
          // displayEdit: false,
          label: content?.approveBtn,
          buttonType: 'primary',
          buttonColor: 'default',
          updatedStatus: 'active',
        },
      ];
    case BankAccountStatusEnum.FAILED:
      return [
        {
          // displayEdit: false,
          label: content?.approveBtn,
          buttonType: 'primary',
          buttonColor: 'default',
          updatedStatus: 'active',
        },
      ];
    default:
      return [];
  }
}
