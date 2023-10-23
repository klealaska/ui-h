import * as fromShared from './bank-account-shared.reducer';
import { BankAccountSharedActions } from './bank-account-shared.actions';

describe('bank account shared reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const { initialState } = fromShared;
      const action = {
        type: 'Unknown',
      };
      const state = fromShared.reducer(initialState, action);
      expect(state).toBe(initialState);
    });
  });

  describe('setSelectedBankAccountId action', () => {
    it('should retrieve the selected bank account id from state', () => {
      const { initialState } = fromShared;
      const newState = '1234';
      const action = BankAccountSharedActions.setSelectedBankAccount({ id: newState });
      const state = fromShared.reducer(initialState, action);

      expect(state.selectedAccountId).toEqual(newState);
      expect(state.selectedAccountId).not.toBe(initialState);
    });
  });

  describe('setSidePanelComponentId action', () => {
    it('should retrieve the side panel component id from state', () => {
      const { initialState } = fromShared;
      const newState = 'add';
      const action = BankAccountSharedActions.setSidePanelComponentId({ component: newState });
      const state = fromShared.reducer(initialState, action);

      expect(state.sidePanelComponentId).toEqual(newState);
      expect(state.sidePanelComponentId).not.toBe(initialState);
    });
  });
});
