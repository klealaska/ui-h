import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as HistorySelector from './history.selectors';
import * as HistoryActions from './history.actions';
import { IHistoryEventList } from '@ui-coe/bus-hier/shared/types';
@Injectable({
  providedIn: 'root',
})
export class HistoryFacade {
  constructor(private store: Store) {}

  historyEvents$: Observable<IHistoryEventList> = this.store.pipe(
    select(HistorySelector.selectHistoryEvents)
  );

  updateHistoryEvents(events: IHistoryEventList): void {
    this.store.dispatch(HistoryActions.updateHistoryEvents({ events }));
  }
}
