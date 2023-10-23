import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { RolesActions } from './roles.actions';

@Injectable()
export class RolesEffects {
  loadRoless$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      concatMap(() => EMPTY as Observable<{ type: string }>)
    );
  });

  constructor(private actions$: Actions) {}
}
