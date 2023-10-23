import { createReducer, on } from '@ngrx/store';
import { BankAccountSharedActions } from './bank-account-shared.actions';
import { SidePanelComponentId } from './bank-account-shared-state.const';

export const sharedStateFeatureKey = 'bankAccountShared';

export interface IBankAccountSharedState {
  selectedAccountId: string;
  sidePanelComponentId: SidePanelComponentId;
}

export const initialState: IBankAccountSharedState = {
  selectedAccountId: null,
  sidePanelComponentId: null,
};

export const reducer = createReducer(
  initialState,
  on(BankAccountSharedActions.setSelectedBankAccount, (state, { id }) => ({
    ...state,
    selectedAccountId: id,
  })),
  on(BankAccountSharedActions.setSidePanelComponentId, (state, { component }) => ({
    ...state,
    sidePanelComponentId: component,
  })),
  on(BankAccountSharedActions.resetSidePanel, () => initialState)
);
