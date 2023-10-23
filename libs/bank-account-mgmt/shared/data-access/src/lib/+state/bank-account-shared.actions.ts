import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SidePanelComponentId } from './bank-account-shared-state.const';

export const BankAccountSharedActions = createActionGroup({
  source: 'Shared',
  events: {
    'Set Selected Bank Account': props<{ id: string }>(),
    'Set Side Panel Component Id': props<{ component: SidePanelComponentId } | null>(),
    'Reset Side Panel': emptyProps(),
  },
});
