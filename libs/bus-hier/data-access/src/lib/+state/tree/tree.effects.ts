import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as TreeActions from './tree.actions';
import { BusHierService } from '../../services/bus-hier.service';
import { IOrgsErpsTreeMapped, ITreeMapped } from '@ui-coe/bus-hier/shared/types';
import { toNavigationTreeMapper } from '../../utils/tree-mapper';

@Injectable()
export class TreeEffects {
  loadTree$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TreeActions.loadTree),
      switchMap(params => {
        return this.service.getTree(params).pipe(
          switchMap((response: ITreeMapped) => {
            const navTree = toNavigationTreeMapper(response);

            return [
              TreeActions.loadTreeSuccess({ response: navTree }),
              TreeActions.activateTreeNode({
                payload: { id: params.payload.selectedNode as string | number },
                correlationId: params.correlationId,
              }),
            ];
          }),
          catchError(error => of(TreeActions.loadTreeFailure({ error })))
        );
      })
    );
  });

  loadOrgsAndErps$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TreeActions.loadOrgsAndErps),
      switchMap(() => {
        return this.service.getOrgsAndErps().pipe(
          map((response: IOrgsErpsTreeMapped) => {
            return TreeActions.loadOrgsAndErpsSuccess({
              response: {
                erps: response.erps.map(erp => {
                  return {
                    id: erp.erpId,
                    name: erp.erpName,
                    isActive: erp.isActive,
                    orgId: erp.organizationId,
                    erpCode: erp.erpCode,
                    isDisabled: false,
                    isSelected: false,
                  };
                }),
                organizations: response.organizations.map(org => {
                  return {
                    id: org.organizationId,
                    name: org.organizationName,
                    isActive: org.isActive,
                    erps: org.erps,
                    orgCode: org.organizationCode,
                    isDisabled: false,
                    isSelected: false,
                  };
                }),
              },
            });
          }),
          catchError(error => of(TreeActions.loadOrgsAndErpsFailure({ error })))
        );
      })
    );
  });
  constructor(private actions$: Actions, private service: BusHierService) {}
}
