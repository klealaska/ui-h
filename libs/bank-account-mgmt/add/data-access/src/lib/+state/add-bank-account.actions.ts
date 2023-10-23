import { createActionGroup, props } from '@ngrx/store';
import { IAddBankAccountParams, IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';

export const AddBankAccountActions = createActionGroup({
  source: 'Add Bank Account',
  events: {
    'Add Bank Account': props<{ account: IAddBankAccountParams }>(),
    'Add Bank Account Success': props<{ response: IBankAccountMapped }>(),
    'Add Bank Account Failure': props<{ error: unknown }>(),
  },
});
