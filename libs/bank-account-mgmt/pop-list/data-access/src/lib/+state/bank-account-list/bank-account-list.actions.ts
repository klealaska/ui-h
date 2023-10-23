import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';

export const PopBamListActions = createActionGroup({
  source: 'Bank Account List',
  events: {
    'Get Bank Account List': emptyProps(),
    'Get Bank Account List Success': props<{ response: IBankAccountMapped[] }>(),
    'Get Bank Account List Failure': props<{ error: unknown }>(),
  },
});
