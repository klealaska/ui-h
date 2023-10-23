import { IBankAccountSharedState } from './bank-account-shared.reducer';
import {
  selectSelectedAccountId,
  selectSidePanelComponentId,
} from './bank-account-shared.selectors';

describe('bank account shared selectors', () => {
  const initialState: IBankAccountSharedState = {
    selectedAccountId: '1234',
    sidePanelComponentId: 'add',
  };

  it('should select the selected bank account id', () => {
    const result = selectSelectedAccountId.projector(initialState);
    expect(result).toBe('1234');
  });

  it('should select the side panel component id', () => {
    const result = selectSidePanelComponentId.projector(initialState);
    expect(result).toBe('add');
  });
});
