import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IAddBankAccountParams, IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';

export const BankAccountListActions = createActionGroup({
  source: 'Bank Account List',
  events: {
    /* ToDo:
        update with new param name instead of id to more clearly indicate what type
        of id to use */
    'Get Bank Account List': emptyProps(),
    'Get Bank Account List Success': props<{ response: IBankAccountMapped[] }>(),
    'Get Bank Account List Failure': props<{ error: unknown }>(),
  },
});

export const AddBankAccountActions = createActionGroup({
  source: 'Add Bank Account',
  events: {
    'Add Bank Account': props<{ account: IAddBankAccountParams }>(),
    'Add Bank Account Success': props<{ response: IBankAccountMapped }>(),
    'Add Bank Account Failure': props<{ error: unknown }>(),
  },
});
