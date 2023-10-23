import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { forkJoin, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { patch, updateItem } from '@ngxs/store/operators';
import { ConnectorService } from '../core/services/connector.service';
import { PlatformService } from '../core/services/platform.service';
import { RegistrationService } from '../core/services/registration.service';
import { CoreState } from '../core/state/core.state';
import { AvidException, OperationType, Platform, RegistrationEnablement } from '../models';
import * as actions from './data-selection.actions';
import { ToastService } from '../core/services/toast.service';
import { ToastStatus } from '../core/enums';

export interface DataSelectionModel {
  operationTypes: OperationType[];
  registrationEnablements: RegistrationEnablement[];
  isLoading: boolean;
}

const defaults: DataSelectionModel = {
  operationTypes: [],
  registrationEnablements: [],
  isLoading: false,
};

@State({ name: 'dataSelection', defaults })
@Injectable()
export class DataSelectionState {
  constructor(
    private platformService: PlatformService,
    private connectorService: ConnectorService,
    private registrationService: RegistrationService,
    private store: Store,
    private toast: ToastService
  ) {}

  @Selector()
  static operationTypes(state: DataSelectionModel): OperationType[] {
    return state.operationTypes;
  }

  @Selector()
  static registrationEnablements(state: DataSelectionModel): RegistrationEnablement[] {
    return state.registrationEnablements;
  }

  @Selector()
  static isLoading(state: DataSelectionModel): boolean {
    return state.isLoading;
  }

  @Action(actions.GetOperationTypes)
  getOperationTypes({ patchState, dispatch }: StateContext<DataSelectionModel>): Observable<{
    platformOperationTypes: OperationType[];
    connectorOperationTypes: OperationType[];
  }> {
    const platform = this.store.selectSnapshot<Platform>(CoreState.platform);
    const connectorId = this.store.selectSnapshot<number>(CoreState.connectorId);

    patchState({ isLoading: true });

    return forkJoin({
      platformOperationTypes: this.platformService.getOperationTypes(platform.id),
      connectorOperationTypes: this.connectorService.getOperationTypes(connectorId),
    }).pipe(
      tap(({ platformOperationTypes, connectorOperationTypes }) => {
        const connectorOperationTypeIds = connectorOperationTypes.map(
          operationType => operationType.id
        );

        const operationTypes = platformOperationTypes.filter(operationType =>
          connectorOperationTypeIds.includes(operationType.id)
        );

        patchState({ operationTypes, isLoading: false });

        dispatch(new actions.GetRegistrationEnablements());
      }),
      catchError(err => {
        patchState({ operationTypes: [], isLoading: false });
        throw err;
      })
    );
  }

  @Action(actions.GetRegistrationEnablements)
  getRegistrationEnablements({
    patchState,
    getState,
  }: StateContext<DataSelectionModel>): Observable<RegistrationEnablement[]> {
    const customerId = this.store.selectSnapshot(CoreState.customerId);
    const registrationId = this.store.selectSnapshot(CoreState.registrationId);

    patchState({ isLoading: true });

    return this.registrationService.getEnablements(customerId, registrationId).pipe(
      tap(registrationEnablements => {
        const operationTypes = getState().operationTypes;
        patchState({ isLoading: false });

        if (operationTypes.length === 0) {
          // if there is no operationTypes from connector, no enablements available
          patchState({ registrationEnablements: [] });
        } else {
          const enablements: RegistrationEnablement[] = [];

          operationTypes.forEach(operationType => {
            const enablement = registrationEnablements.find(
              item => item.operationTypeId === operationType.id
            );

            if (enablement !== undefined) {
              enablements.push({
                ...enablement,
                operationTypeName: operationType.name,
              });
            } else {
              enablements.push({
                operationTypeId: operationType.id,
                operationTypeName: operationType.name,
                isActive: false,
                isApibased: true,
                registrationEnablementUrl: '',
                registrationId,
              });
            }
          });

          patchState({ registrationEnablements: enablements });
        }
      }),
      catchError(err => {
        patchState({ registrationEnablements: [], isLoading: false });
        throw err;
      })
    );
  }

  @Action(actions.UpdateRegistrationEnablement)
  updateRegistrationEnablement(
    { setState }: StateContext<DataSelectionModel>,
    { registrationEnablement }: actions.UpdateRegistrationEnablement
  ): void {
    setState(
      patch({
        registrationEnablements: updateItem<RegistrationEnablement>(
          enablement => enablement.operationTypeId === registrationEnablement.operationTypeId,
          registrationEnablement
        ),
      })
    );
  }

  @Action(actions.SaveRegistrationEnablements)
  saveRegistrationEnablements({
    dispatch,
    getState,
  }: StateContext<DataSelectionModel>): Observable<null> {
    const customerId = this.store.selectSnapshot<number>(CoreState.customerId);
    const registrationId = this.store.selectSnapshot<number>(CoreState.registrationId);

    return this.registrationService
      .saveEnablements(customerId, registrationId, getState().registrationEnablements)
      .pipe(tap(() => dispatch(new actions.GetRegistrationEnablements())));
  }

  @Action(actions.PostMappingFile)
  postMappingFile(
    { dispatch }: StateContext<DataSelectionModel>,
    { operationTypeId, file }: actions.PostMappingFile
  ): Observable<null> {
    const customerId = this.store.selectSnapshot<number>(CoreState.customerId);
    const registrationId = this.store.selectSnapshot<number>(CoreState.registrationId);

    return this.registrationService
      .postMappingFile(customerId, registrationId, operationTypeId, file)
      .pipe(
        tap(() => {
          this.toast.open(`Success!  ${file.name} has been uploaded.`, ToastStatus.Success);
          dispatch(new actions.GetRegistrationEnablements());
        }),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          throw err.reason;
        })
      );
  }

  @Action(actions.ClearDataSelection)
  clearDataSelection({ patchState }: StateContext<DataSelectionModel>): void {
    patchState({
      operationTypes: [],
      registrationEnablements: [],
    });
  }
}
