import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  IBankAccountMapped,
  IEditBankAccountParams,
  IUnmaskedBankAccount,
  IUpdateStatusParams,
} from '@ui-coe/bank-account-mgmt/shared/types';

export const BankAccountDetailActions = createActionGroup({
  source: 'Bank Account Detail',
  events: {
    'Reset Details': emptyProps(),

    'Get Bank Account': props<{ accountId: string }>(),
    'Get Bank Account Success': props<{ response: IBankAccountMapped }>(),
    'Get Bank Account Failure': props<{ error: unknown }>(),

    'Activate Bank Account': props<{ accountId: string }>(),
    'Activate Bank Account Success': props<{ response: IBankAccountMapped }>(),
    'Activate Bank Account Error': props<{ error: unknown }>(),

    'Deactivate Bank Account': props<{ accountId: string }>(),
    'Deactivate Bank Account Success': props<{ response: IBankAccountMapped }>(),
    'Deactivate Bank Account Error': props<{ error: unknown }>(),

    'Unmask Bank Account Number': props<{ accountId: string }>(),
    'Unmask Bank Account Number Success': props<{ response: IUnmaskedBankAccount }>(),
    'Unmask Bank Account Number Error': props<{ error: unknown }>(),

    'Update Status': props<{ updateStatusParams: IUpdateStatusParams }>(),
    'Update Status Success': props<{ response: IBankAccountMapped }>(),
    'Update Status Failure': props<{ error: unknown }>(),
  },
});

export const EditBankAccountDetailActions = createActionGroup({
  source: 'Bank Account Detail',
  events: {
    'Edit Bank Account': props<{ editBankAccountParams: IEditBankAccountParams }>(),
    'Edit Bank Account Success': props<{ response: IBankAccountMapped }>(),
    'Edit Bank Account Failure': props<{ error: unknown }>(),
  },
});
