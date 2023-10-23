import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { ContentKeys } from '@ui-coe/bus-hier/shared/types';
import { IGetToastOptions, ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';
import { getToasterConfig } from '@ui-coe/shared/util/interfaces';
import { switchMap, map, catchError, of, combineLatestWith } from 'rxjs';
import { BusinessLevelService } from '../../services/business-level.service';
import * as BusinessLevelActions from './business-level.actions';
import * as TreeActions from '../tree/tree.actions';

@Injectable()
export class BusinessLevelEffects {
  constructor(
    private actions$: Actions,
    private businessLevelService: BusinessLevelService,
    private translateService: TranslateService
  ) {}

  updateBusinessLevelName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessLevelActions.updateBusinessLevelName),
      switchMap(action =>
        this.businessLevelService.updateBusinessLevelName(action.params).pipe(
          switchMap(response => [
            BusinessLevelActions.updateBusinessLevelNameSuccess({ response }),
            TreeActions.loadTree({
              payload: {
                erpId: action.params.erpId,
                orgId: action.params.orgId,
                entityId: action.params.entityId,
                selectedNode: action.params.selectedNode,
              },
            }),
          ]),
          catchError(error => of(BusinessLevelActions.updateBusinessLevelNameFailure({ error })))
        )
      )
    )
  );

  displayToast$ = createEffect(() => {
    let toastConfigOptions: IGetToastOptions;

    return this.actions$.pipe(
      ofType(
        BusinessLevelActions.updateBusinessLevelNameSuccess,
        BusinessLevelActions.updateBusinessLevelNameFailure
      ),
      combineLatestWith(
        this.translateService.get([
          ContentKeys.BUS_LEVEL_RENAME_SUCCESS_TOASTER,
          ContentKeys.BUS_LEVEL_RENAME_SUCCESS_TOASTER,
        ])
      ),
      switchMap(([action, translations]) => {
        switch (action.type) {
          case BusinessLevelActions.updateBusinessLevelNameSuccess.type:
            toastConfigOptions = {
              title: translations[ContentKeys.BUS_LEVEL_RENAME_SUCCESS_TOASTER],
            };
            break;

          case BusinessLevelActions.updateBusinessLevelNameFailure.type:
            toastConfigOptions = {
              title: translations[ContentKeys.BUS_LEVEL_RENAME_SUCCESS_TOASTER],
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
        }
        return of(
          BusinessLevelActions.displayToast({ config: getToasterConfig(toastConfigOptions) })
        );
      })
    );
  });
}
