import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ToastStatus } from '../core/enums';
import { ConnectorService } from '../core/services/connector.service';
import { ToastService } from '../core/services/toast.service';
import { AvidConnectDataSource, AvidException, Customer, Operation } from '../models';
import * as actions from './connector-detail.actions';

export interface ConnectorDetailStateModel {
  operations: Operation[];
  customers: Customer[];
  isLoadingOperations: boolean;
  isLoadingCustomers: boolean;
}

const defaults: ConnectorDetailStateModel = {
  operations: [],
  customers: [],
  isLoadingOperations: false,
  isLoadingCustomers: false,
};

@State<ConnectorDetailStateModel>({ name: 'connectors', defaults })
@Injectable()
export class ConnectorDetailState {
  constructor(private connectorService: ConnectorService, private toast: ToastService) {}

  @Selector()
  static operations(state: ConnectorDetailStateModel): Operation[] {
    return state.operations;
  }

  @Selector()
  static customers(state: ConnectorDetailStateModel): Customer[] {
    return state.customers;
  }

  @Selector()
  static isLoadingCustomers(state: ConnectorDetailStateModel): boolean {
    return state.isLoadingCustomers;
  }

  @Selector()
  static isLoadingOperations(state: ConnectorDetailStateModel): boolean {
    return state.isLoadingOperations;
  }

  @Action(actions.GetOperations)
  getOperations(
    { patchState }: StateContext<ConnectorDetailStateModel>,
    { connectorId }: actions.GetOperations
  ): Observable<AvidConnectDataSource<Operation>> {
    const toDate = DateTime.now().toString();
    const fromDate = DateTime.now().minus({ years: 1 }).toString();
    patchState({ isLoadingOperations: true });
    return this.connectorService
      .getOperations(connectorId, { pageSize: 999999, fromDate, toDate })
      .pipe(
        tap(data => patchState({ operations: data.items })),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          patchState({ operations: [] });
          throw err;
        }),
        finalize(() => patchState({ isLoadingOperations: false }))
      );
  }

  @Action(actions.GetCustomers)
  getCustomers(
    { patchState }: StateContext<ConnectorDetailStateModel>,
    { connectorId }: actions.GetCustomers
  ): Observable<AvidConnectDataSource<Customer>> {
    patchState({ isLoadingCustomers: true });
    return this.connectorService.getCustomers(connectorId, { pageSize: 999999 }).pipe(
      tap(data => patchState({ customers: data.items })),
      catchError((err: AvidException) => {
        this.toast.open(err.reason, ToastStatus.Error);
        patchState({ customers: [] });
        throw err;
      }),
      finalize(() => patchState({ isLoadingCustomers: false }))
    );
  }

  @Action(actions.ClearConnectorDetails)
  clearConnectorDetails({ patchState }: StateContext<ConnectorDetailStateModel>): void {
    patchState({ operations: [], customers: [] });
  }
}
