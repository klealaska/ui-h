import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { RefreshTokenResponse, UserAccount } from '@ui-coe/shared/util/auth';
import { ConfigService } from '@ui-coe/shared/util/services';
import {
  Connector,
  Customer,
  Registration,
  UserProfile,
  Platform,
  ChevronItem,
  AvidException,
} from '../../models';
import * as actions from './../actions/core.actions';
import { UserService } from '../services/user.service';
import { CustomerService } from '../services/customer.service';
import { ConnectorService } from '../services/connector.service';
import { RegistrationService } from '../services/registration.service';
import { PlatformService } from '../services/platform.service';
import { NavigationChevronService } from '../services/navigation-chevron.service';
import { AvcAuthService } from '../services/avc-auth.service';
import { ToastStatus } from '../enums';
import { ConnectorSettingsStateModel } from '../../connector-settings/connector-settings.state';
import { ToastService } from '../services/toast.service';

export interface CoreStateModel {
  token: string;
  userRoles: string[];
  userAccount: UserAccount;
  userProfile: UserProfile;
  isLoading: boolean;
  connectorId: number;
  customer: Customer;
  customerId: number;
  connector: Connector;
  registration: Registration;
  platform: Platform;
  operationId: number;
  navigation: ChevronItem[];
}

export const defaults: CoreStateModel = {
  token: null,
  userRoles: [],
  customer: null,
  customerId: 0,
  userAccount: null,
  userProfile: null,
  isLoading: false,
  connectorId: 0,
  connector: null,
  registration: null,
  platform: null,
  operationId: 0,
  navigation: [],
};

@State<CoreStateModel>({
  name: 'core',
  defaults,
})
@Injectable()
export class CoreState {
  constructor(
    private authService: AvcAuthService,
    private toast: ToastService,
    private userService: UserService,
    private customerService: CustomerService,
    private connectorService: ConnectorService,
    private registrationService: RegistrationService,
    private platformService: PlatformService,
    private navigationChevronService: NavigationChevronService,
    private configService: ConfigService
  ) {}

  @Selector()
  static userDisplayName(state: CoreStateModel): string {
    return state.userProfile.displayName;
  }

  @Selector()
  static userAccountName(state: CoreStateModel): string {
    return state.userAccount.name;
  }

  @Selector()
  static isLoading(state: CoreStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static customer(state: CoreStateModel): Customer {
    return state.customer;
  }

  @Selector()
  static connector(state: CoreStateModel): Connector {
    return state.connector;
  }

  @Selector()
  static registration(state: CoreStateModel): Registration {
    return state.registration;
  }

  @Selector()
  static platform(state: CoreStateModel): Platform {
    return state.platform;
  }

  @Selector()
  static customerId(state: CoreStateModel): number {
    return state.customerId;
  }

  @Selector()
  static connectorId(state: CoreStateModel): number {
    return state.connectorId;
  }

  @Selector()
  static registrationId(state: CoreStateModel): number {
    return state.registration.id;
  }

  @Selector()
  static operationId(state: CoreStateModel): number {
    return state.operationId;
  }

  @Selector()
  static navigation(state: CoreStateModel): ChevronItem[] {
    return state.navigation;
  }

  @Selector()
  static getToken(state: CoreStateModel): string {
    return state.token;
  }

  @Selector()
  static userRoles(state: CoreStateModel): string[] {
    return state.userRoles;
  }

  @Action(actions.SetCustomer)
  setCustomer(
    { patchState }: StateContext<CoreStateModel>,
    { customer }: actions.SetCustomer
  ): void {
    patchState({ customer });
  }

  @Action(actions.SetCustomerId)
  setCustomerId(
    { patchState }: StateContext<CoreStateModel>,
    { customerId }: actions.SetCustomerId
  ): void {
    patchState({ customerId });
  }

  @Action(actions.InitApplication)
  initApplication({ dispatch }: StateContext<CoreStateModel>): void {
    dispatch([
      new actions.QueryUserAccount(),
      new actions.QueryUserRoles(),
      new actions.SetToken(),
    ]);
  }

  @Action(actions.SetToken)
  setToken({ patchState }: StateContext<CoreStateModel>): void {
    const token = this.authService.getAccessToken();
    if (token) {
      patchState({ token });
    }
  }

  @Action(actions.QueryUserRoles)
  querySetUserRoles({ patchState }: StateContext<CoreStateModel>): void {
    const token = this.authService.getAccessToken();
    if (token && token !== '') {
      const decodedToken: { roles: string[]; orgId: string[] } = jwt_decode(token);
      patchState({
        userRoles: decodedToken.roles,
      });
    }
  }

  @Action(actions.QueryUserAccount)
  queryUserAccount({ dispatch, patchState }: StateContext<CoreStateModel>): void {
    const userAccount = this.authService.getUserInfo();
    patchState({ userAccount });
    dispatch([new actions.QueryUserProfile()]);
  }

  @Action(actions.QueryUserProfile)
  queryUserProfile({ patchState }: StateContext<CoreStateModel>): Observable<UserProfile> {
    return this.userService
      .getProfile()
      .pipe(tap((userProfile: UserProfile) => patchState({ userProfile })));
  }

  @Action(actions.RefreshToken)
  refreshToken({ patchState }: StateContext<CoreStateModel>): Observable<RefreshTokenResponse> {
    return this.authService
      .refreshToken(this.configService.get('avidAuthBaseUri'))
      .pipe(
        tap((response: RefreshTokenResponse) =>
          patchState({ token: response.return_data.access_token })
        )
      );
  }

  @Action(actions.Logout)
  logout({ getState, setState }: StateContext<CoreStateModel>): void {
    this.authService.logout();

    setState({
      ...getState(),
      ...defaults,
    });
  }

  @Action(actions.GetCustomersByToken)
  getCustomersByToken({
    patchState,
    dispatch,
  }: StateContext<CoreStateModel>): Observable<Customer> {
    return this.customerService.getCustomerWithToken().pipe(
      tap(customer => {
        dispatch(new actions.SetCustomer(customer));
        dispatch(new actions.SetCustomerId(customer.id));
      }),
      catchError((err: HttpErrorResponse) => {
        patchState({ customer: null });
        throw err;
      })
    );
  }

  @Action(actions.GetCustomer)
  getCustomer(
    { patchState }: StateContext<CoreStateModel>,
    { customerId }: actions.GetCustomer
  ): Observable<Customer> {
    return this.customerService.getById(customerId).pipe(
      tap(customer => patchState({ customer })),
      catchError((err: HttpErrorResponse) => {
        patchState({ customer: null });
        throw err;
      })
    );
  }

  @Action(actions.GetConnector)
  getConnector({ patchState, getState }: StateContext<CoreStateModel>): Observable<Connector> {
    const connectorId = getState().connectorId;
    return this.connectorService.getById(connectorId).pipe(
      tap(connector => patchState({ connector })),
      catchError((err: HttpErrorResponse) => {
        patchState({ connector: null });
        throw err;
      })
    );
  }

  @Action(actions.GetRegistration)
  getRegistration(
    { patchState, getState }: StateContext<CoreStateModel>,
    { registrationId }: actions.GetRegistration
  ): Observable<Registration> {
    const customerId = getState().customerId;
    return this.registrationService.getById(customerId, registrationId).pipe(
      tap(registration => patchState({ registration })),
      catchError((err: HttpErrorResponse) => {
        patchState({ registration: null });
        throw err;
      })
    );
  }

  @Action(actions.GetPlatform)
  getPlatform(
    { patchState }: StateContext<CoreStateModel>,
    { platformId }: actions.GetPlatform
  ): Observable<Platform> {
    return this.platformService.getById(platformId).pipe(
      tap(platform => patchState({ platform })),
      catchError((err: HttpErrorResponse) => {
        patchState({ platform: null });
        throw err;
      })
    );
  }

  @Action(actions.ClearConnector)
  clearConnector({ patchState }: StateContext<CoreStateModel>): void {
    patchState({ connector: null, connectorId: 0 });
  }

  @Action(actions.ClearRegistration)
  clearRegistration({ patchState }: StateContext<CoreStateModel>): void {
    patchState({ registration: null });
  }

  @Action(actions.ClearCustomer)
  clearCustomer({ patchState }: StateContext<CoreStateModel>): void {
    patchState({ customer: null, customerId: 0 });
  }

  @Action(actions.SetConnectorId)
  setConnectorId(
    { patchState }: StateContext<CoreStateModel>,
    { connectorId }: actions.SetConnectorId
  ): void {
    patchState({ connectorId });
  }

  @Action(actions.SetRegistration)
  setRegistration(
    { patchState }: StateContext<CoreStateModel>,
    { registration }: actions.SetRegistration
  ): void {
    patchState({ registration });
  }

  @Action(actions.SetOperationId)
  setOperationId(
    { patchState }: StateContext<CoreStateModel>,
    { operationId }: actions.SetOperationId
  ): void {
    patchState({ operationId });
  }

  @Action(actions.SetNavigationChevron)
  setNavigationChevron(
    { patchState }: StateContext<CoreStateModel>,
    { navigation }: actions.SetNavigationChevron
  ): void {
    patchState({ navigation });
  }

  @Action(actions.GetNavigationChevron)
  getNavigationChevron(
    { patchState }: StateContext<CoreStateModel>,
    { page }: actions.GetNavigationChevron
  ): void {
    const navigation = this.navigationChevronService.getNavigationChevron(page);
    patchState({ navigation });
  }

  @Action(actions.AgentRegistration)
  agentRegistration(
    { patchState }: StateContext<CoreStateModel>,
    { customerId, registrationId, agent, registration }: actions.AgentRegistration
  ): Observable<any> {
    return this.customerService
      .agentRegistration(customerId, registrationId, agent, registration)
      .pipe(
        tap(() => {
          console.log('hi');
          const updatedRegistration: Registration = {
            ...registration,
            topic: agent.topic,
            subscription: agent.subscription,
          };
          patchState({ registration: updatedRegistration });
          this.toast.open('Agent association successful', ToastStatus.Success);
        }),
        catchError((err: AvidException) => {
          this.toast.open('Agent association failed', ToastStatus.Error);
          throw err.reason;
        })
      );
  }
}
