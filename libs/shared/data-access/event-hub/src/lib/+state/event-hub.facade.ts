import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MfeEventInterface } from './event-hub.models';
import { MfeEvent } from './event-hub.actions';

@Injectable({
  providedIn: 'root',
})
export class EventHubFacade {
  constructor(private store: Store) {}

  dispatchEvent(event: MfeEventInterface) {
    this.store.dispatch(MfeEvent({ event }));
  }
}
