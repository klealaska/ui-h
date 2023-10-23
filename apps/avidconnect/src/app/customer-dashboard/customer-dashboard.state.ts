import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { OperationService } from '../core/services/operation.service';
import { RegistrationService } from '../core/services/registration.service';
import { AvidConnectDataSource, Operation, Registration } from '../models';
import * as actions from './customer-dashboard.actions';

export interface CustomerDashboardStateModel {
  operations: Operation[];
  registrations: Registration[];

  isLoadingOperations: boolean;
  isLoadingRegistrations: boolean;
}

const defaults: CustomerDashboardStateModel = {
  operations: [],
  registrations: [],
  isLoadingOperations: false,
  isLoadingRegistrations: false,
};

@State<CustomerDashboardStateModel>({ name: 'customerDashboard', defaults })
@Injectable()
export class CustomerDashboardState {
  constructor(
    private operationService: OperationService,
    private registrationService: RegistrationService
  ) {}

  @Selector()
  static operations(state: CustomerDashboardStateModel): Operation[] {
    return state.operations;
  }

  @Selector()
  static registrations(state: CustomerDashboardStateModel): Registration[] {
    return state.registrations;
  }

  @Selector()
  static isLoadingOperations(state: CustomerDashboardStateModel): boolean {
    return state.isLoadingOperations;
  }

  @Selector()
  static isLoadingRegistrations(state: CustomerDashboardStateModel): boolean {
    return state.isLoadingRegistrations;
  }

  @Action(actions.QueryOperations)
  queryOperations(
    { patchState, dispatch }: StateContext<CustomerDashboardStateModel>,
    { customerId }: actions.QueryOperations
  ): Observable<AvidConnectDataSource<Operation>> {
    patchState({ operations: [] });
    dispatch(new actions.LoadingOperations(true));
    const toDate = DateTime.now().toString();
    const fromDate = DateTime.now().minus({ years: 1 }).toString();
    return this.operationService
      .getByCustomer(customerId, { pageSize: 999999, fromDate, toDate })
      .pipe(
        tap(data => patchState({ operations: data.items })),
        catchError((err: HttpErrorResponse) => {
          patchState({ operations: [] });
          throw err;
        }),
        finalize(() => dispatch(new actions.LoadingOperations(false)))
      );
  }

  @Action(actions.QueryRegistrations)
  queryRegistrations(
    { patchState, dispatch }: StateContext<CustomerDashboardStateModel>,
    { customerId }: actions.QueryOperations
  ): Observable<AvidConnectDataSource<Registration>> {
    patchState({ operations: [] });
    dispatch(new actions.LoadingRegistrations(true));
    return this.registrationService.getRegistrationsDetail(customerId).pipe(
      tap(data => patchState({ registrations: data.items })),
      catchError((err: HttpErrorResponse) => {
        patchState({ registrations: [] });
        throw err;
      }),
      finalize(() => dispatch(new actions.LoadingRegistrations(false)))
    );
  }

  @Action(actions.LoadingOperations)
  loadingOperations(
    { patchState }: StateContext<CustomerDashboardStateModel>,
    { isLoadingOperations }: actions.LoadingOperations
  ): void {
    patchState({ isLoadingOperations });
  }

  @Action(actions.LoadingRegistrations)
  loadingRegistrations(
    { patchState }: StateContext<CustomerDashboardStateModel>,
    { isLoadingRegistrations }: actions.LoadingRegistrations
  ): void {
    patchState({ isLoadingRegistrations });
  }

  @Action(actions.ClearRegistrations)
  clearRegistrations({ patchState }: StateContext<CustomerDashboardStateModel>): void {
    patchState({ registrations: [] });
  }
}
