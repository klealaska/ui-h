import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ConnectorService } from '../core/services/connector.service';
import { CustomerService } from '../core/services/customer.service';
import { RegistrationService } from '../core/services/registration.service';
import { AvidConnectDataSource, AvidException, Connector, Customer } from '../models';
import * as actions from './portal-dashboard.actions';
import * as coreActions from '../core/actions/core.actions';
import { ToastService } from '../core/services/toast.service';
import { ToastStatus } from '../core/enums';

export interface PortalDashboardStateModel {
  customers: Customer[];
  connectors: Connector[];
  isLoadingCustomers: boolean;
  isLoadingConnectors: boolean;
  isLoadingCustomer: boolean;
}

const defaults: PortalDashboardStateModel = {
  customers: [],
  connectors: [],
  isLoadingConnectors: false,
  isLoadingCustomers: false,
  isLoadingCustomer: false,
};

@State<PortalDashboardStateModel>({
  name: 'portalDashboard',
  defaults,
})
@Injectable()
export class PortalDashboardState {
  constructor(
    private customerService: CustomerService,
    private connectorService: ConnectorService,
    private registrationService: RegistrationService,
    private toast: ToastService
  ) {}

  @Selector()
  static customers(state: PortalDashboardStateModel): Customer[] {
    return state.customers;
  }

  @Selector()
  static isLoadingCustomers(state: PortalDashboardStateModel): boolean {
    return state.isLoadingCustomers;
  }

  @Selector()
  static connectors(state: PortalDashboardStateModel): Connector[] {
    return state.connectors;
  }

  @Selector()
  static isLoadingConnectors(state: PortalDashboardStateModel): boolean {
    return state.isLoadingConnectors;
  }

  @Selector()
  static isLoadingCustomer(state: PortalDashboardStateModel): boolean {
    return state.isLoadingCustomer;
  }

  @Action(actions.QueryCustomers)
  queryCustomers({
    patchState,
    dispatch,
  }: StateContext<PortalDashboardStateModel>): Observable<AvidConnectDataSource<Customer>> {
    dispatch(new actions.LoadingCustomersState(true));
    return this.customerService
      .getAll({ pageNumber: 1, pageSize: 999999, includeInactive: true })
      .pipe(
        tap(data => patchState({ customers: data.items })),
        catchError((err: AvidException) => {
          patchState({ customers: [] });
          throw err?.reason;
        }),
        finalize(() => dispatch(new actions.LoadingCustomersState(false)))
      );
  }

  @Action(actions.QueryConnectors)
  queryConnectors({
    patchState,
    dispatch,
  }: StateContext<PortalDashboardStateModel>): Observable<AvidConnectDataSource<Connector>> {
    dispatch(new actions.LoadingConnectorsState(true));

    return this.connectorService
      .getAll({ pageNumber: 1, pageSize: 999999, includeInactive: true })
      .pipe(
        tap(data => patchState({ connectors: data.items })),
        catchError((err: HttpErrorResponse) => {
          patchState({ connectors: [] });
          throw err;
        }),
        finalize(() => dispatch(new actions.LoadingConnectorsState(false)))
      );
  }

  @Action(actions.PostCustomer)
  postCustomer(
    { dispatch }: StateContext<PortalDashboardStateModel>,
    { customer }: actions.PostCustomer
  ): Observable<number> {
    dispatch(new actions.LoadingCustomerState(true));
    return this.customerService.addCustomer(customer).pipe(
      tap(customerId => {
        this.toast.open(
          `Success! Customer: ${customer.name} has been enrolled.`,
          ToastStatus.Success
        );
        dispatch(new coreActions.SetCustomerId(customerId));
      }),
      catchError((err: AvidException) => {
        this.toast.open(err.reason, ToastStatus.Error);
        throw err.reason;
      }),
      finalize(() => dispatch(new actions.LoadingCustomerState(false)))
    );
  }

  @Action(actions.PostRegistration)
  postRegistration(
    _: StateContext<PortalDashboardStateModel>,
    { customerId, registration }: actions.PostRegistration
  ): Observable<number> {
    return this.registrationService.addRegistration(customerId, registration).pipe(
      tap(() =>
        this.toast.open(
          `Success! ${registration.description} Instance has been created.`,
          ToastStatus.Success
        )
      ),
      catchError((err: AvidException) => {
        this.toast.open(err.reason, ToastStatus.Error);
        throw err.reason;
      })
    );
  }

  @Action(actions.LoadingCustomersState)
  loadingCustomersState(
    { patchState }: StateContext<PortalDashboardStateModel>,
    { isLoadingCustomers }: actions.LoadingCustomersState
  ): void {
    patchState({ isLoadingCustomers });
  }

  @Action(actions.LoadingConnectorsState)
  loadingConnectorsState(
    { patchState }: StateContext<PortalDashboardStateModel>,
    { isLoadingConnectors }: actions.LoadingConnectorsState
  ): void {
    patchState({ isLoadingConnectors });
  }

  @Action(actions.LoadingCustomerState)
  loadingCustomerState(
    { patchState }: StateContext<PortalDashboardStateModel>,
    { isLoadingCustomer }: actions.LoadingCustomerState
  ): void {
    patchState({ isLoadingCustomer });
  }
}
