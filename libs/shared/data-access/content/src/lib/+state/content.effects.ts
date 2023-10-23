import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ConfigService } from '@ui-coe/shared/util/services';
import { map, switchMap } from 'rxjs';
import { ContentService } from '../services/content.service';

import * as ContentActions from './content.actions';
import { AllContentResponse, ContentEntity } from './content.models';

@Injectable()
export class ContentEffects {
  initShell$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.initShellContent),
      switchMap(action =>
        this.contentService.loadShellContent(action.locale).pipe(
          map((contentResponse: AllContentResponse) => {
            return ContentActions.loadContentSuccess({
              content: [contentResponse.homeData, ...contentResponse.productsData],
            });
          })
        )
      )
    )
  );

  // init$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ContentActions.initContent),
  //     switchMap(action =>
  //       this.contentService.loadContent(action.locale).pipe(
  //         map((contentResponse: AllContentResponse) => {
  //           return ContentActions.loadContentSuccess({
  //             content: [contentResponse.homeData, ...contentResponse.productsData],
  //           });
  //         })
  //       )
  //     )
  //   )
  // );

  initProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.initContentForProduct),
      switchMap(action =>
        this.contentService.loadContentById(action.productId).pipe(
          map((contentResponse: { data: ContentEntity[] }) => {
            return ContentActions.loadContentSuccess({ content: contentResponse.data });
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private contentService: ContentService,
    private configService: ConfigService
  ) {}
}
