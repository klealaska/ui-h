import { Customer, Registration } from '../models';

export class QueryCustomers {
  static readonly type = '[PortalDashboardState] QueryCustomers';
}

export class QueryConnectors {
  static readonly type = '[PortalDashboardState] QueryConnectors';
}

export class QueryPlatforms {
  static readonly type = '[PortalDashboardState] QueryPlatforms';
}

export class PostCustomer {
  static readonly type = '[PortalDashboardState] PostCustomer';
  constructor(public customer: Customer) {}
}

export class PostRegistration {
  static readonly type = '[PortalDashboardState] PostRegistration';
  constructor(public customerId: number, public registration: Registration) {}
}

export class LoadingCustomersState {
  static readonly type = '[PortalDashboardState] LoadingCustomersState';
  constructor(public isLoadingCustomers: boolean) {}
}

export class LoadingConnectorsState {
  static readonly type = '[PortalDashboardState] LoadingConnectorsState';
  constructor(public isLoadingConnectors: boolean) {}
}

export class LoadingCustomerState {
  static readonly type = '[PortalDashboardState] LoadingCustomerState';
  constructor(public isLoadingCustomer: boolean) {}
}
