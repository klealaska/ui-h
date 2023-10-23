import { createAction, props } from '@ngrx/store';
import { MfeEventInterface } from './event-hub.models';

export const MfeEvent = createAction(
  '[UI Event Hub] MFE Event',
  props<{ event: MfeEventInterface }>()
);
