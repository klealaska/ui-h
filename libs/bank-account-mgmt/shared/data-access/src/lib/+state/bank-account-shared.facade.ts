import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BankAccountSharedActions } from './bank-account-shared.actions';
import { SidePanelComponentId } from './bank-account-shared-state.const';
import {
  selectSelectedAccountId,
  selectSidePanelComponentId,
} from './bank-account-shared.selectors';
import { Observable } from 'rxjs';

@Injectable()
export class BankAccountSharedFacade {
  constructor(private readonly _store: Store) {}

  public selectedAccountId$: Observable<string> = this._store.select(selectSelectedAccountId);
  public sidePanelContentId$: Observable<string> = this._store.select(selectSidePanelComponentId);

  public dispatchSetSelectedAccountId(id: string) {
    this._store.dispatch(BankAccountSharedActions.setSelectedBankAccount({ id }));
  }

  public dispatchSetSidePanelComponentId(component: SidePanelComponentId | null) {
    this._store.dispatch(BankAccountSharedActions.setSidePanelComponentId({ component }));
  }

  public dispatchResetSidePanel() {
    this._store.dispatch(BankAccountSharedActions.resetSidePanel());
  }
}
