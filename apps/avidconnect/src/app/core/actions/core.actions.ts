import { ChevronItem, Customer, OnPremAgentItem, Registration } from '../../models';
import { AvidPage } from '../enums';

export class InitApplication {
  static readonly type = '[CoreState] InitApplication';
}
export class SetToken {
  static readonly type = '[CoreState] SetToken';
}

export class RefreshToken {
  static readonly type = '[CoreState] RefreshToken';
}

export class QueryUserAccount {
  static readonly type = '[CoreState] QueryUserAccount';
}

export class QueryUserRoles {
  static readonly type = '[CoreState] QueryUserRoles';
}

export class QueryUserProfile {
  static readonly type = '[CoreState] QueryUserProfile';
}

export class SetCustomer {
  static readonly type = '[CoreState] SetCustomer';
  constructor(public customer: Customer) {}
}

export class SetCustomerId {
  static readonly type = '[CoreState] SetCustomerId';
  constructor(public customerId: number) {}
}

export class GetCustomer {
  static readonly type = '[CoreState] GetCustomer';
  constructor(public customerId: number) {}
}

export class GetCustomersByToken {
  static readonly type = '[CoreState] GetCustomersByToken';
}

export class GetConnector {
  static readonly type = '[CoreState] GetConnector';
}

export class GetRegistration {
  static readonly type = '[CoreState] GetRegistration';
  constructor(public registrationId: number) {}
}

export class GetPlatform {
  static readonly type = '[CoreState] GetPlatform';
  constructor(public platformId: number) {}
}

export class AcquireTokenPopup {
  static readonly type = '[CoreState] AcquireTokenPopup';
  constructor(public apiEndpoint: string) {}
}

export class Logout {
  static readonly type = '[CoreState] Logout';
}

export class SetConnectorId {
  static readonly type = '[CoreState] SetConnectorId';
  constructor(public connectorId: number) {}
}

export class SetRegistration {
  static readonly type = '[CoreState] SetRegistration';
  constructor(public registration: Registration) {}
}

export class SetOperationId {
  static readonly type = '[CoreState] SetOperationId';
  constructor(public operationId: number) {}
}
export class ClearCustomer {
  static readonly type = '[CoreState] ClearCustomer';
}

export class ClearConnector {
  static readonly type = '[CoreState] ClearConnector';
}

export class ClearRegistration {
  static readonly type = '[CoreState] ClearRegistration';
}

export class SetNavigationChevron {
  static readonly type = '[CoreState] SetNavigationChevron';
  constructor(public navigation: ChevronItem[]) {}
}

export class GetNavigationChevron {
  static readonly type = '[CoreState] SetNavigationChevron';
  constructor(public page: AvidPage) {}
}

export class AgentRegistration {
  static readonly type = '[ConnectorSettings] Agent Registration';
  constructor(
    public customerId: number,
    public registrationId: number,
    public agent: OnPremAgentItem,
    public registration: Registration
  ) {}
}
