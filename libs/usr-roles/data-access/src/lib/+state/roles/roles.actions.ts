import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const RolesActions = createActionGroup({
  source: 'Roles',
  events: {
    'Load Roles': emptyProps(),
  },
});
