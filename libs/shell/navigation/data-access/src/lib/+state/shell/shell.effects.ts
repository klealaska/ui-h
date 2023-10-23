import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
// import {ROOT_EFFECTS_INIT} from "@ngrx/effects/init"

import * as ShellActions from './shell.actions';
import * as ShellFeature from './shell.reducer';

import { switchMap, catchError, of, map } from 'rxjs';
import { ConfigService, LoggingService, ShellConfigService } from '@ui-coe/shared/util/services';
import { ContentFacade } from '@ui-coe/shared/data-access/content';

@Injectable()
export class ShellEffects {
  private actions$ = inject(Actions);
  constructor(
    private configService: ShellConfigService,
    private contentFacade: ContentFacade,
    private loggingService: LoggingService
  ) {}

  rootInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() => {
        return this.configService
          .loadShellConfig()
          .pipe(map(res => ShellActions.loadShellSuccess({ shell: [] })));
      }),
      catchError(error => {
        console.error('Error', error);
        return of(ShellActions.loadShellFailure({ error }));
      })
    )
  );

  loadContent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShellActions.loadShellSuccess),
        map(() => this.contentFacade.initShell())
      ),
    { dispatch: false }
  );

  initLogging$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShellActions.loadShellSuccess),
        map(() =>
          this.loggingService.init(
            'shell-spa',
            this.configService.get('appInsightsInstrumentationKey')
          )
        )
      ),
    { dispatch: false }
  );

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShellActions.initShell),
      switchMap(() => of(ShellActions.loadShellSuccess({ shell: [] }))),
      catchError(error => {
        console.error('Error', error);
        return of(ShellActions.loadShellFailure({ error }));
      })
    )
  );
}
