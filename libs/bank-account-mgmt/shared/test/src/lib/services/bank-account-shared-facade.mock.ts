import { of } from 'rxjs';

export const bankAccountSharedFacadeMock = {
  selectedAccountId$: of('anribpnwycogcqblepdu'),
  sidePanelContentId$: of(''),
  dispatchSetSelectedAccountId: jest.fn(() => of({})),
  dispatchSetSidePanelComponentId: jest.fn(() => of({})),
  dispatchResetSidePanel: jest.fn(() => of({})),
};
