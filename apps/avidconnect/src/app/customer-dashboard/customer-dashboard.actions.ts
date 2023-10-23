export class QueryOperations {
  static readonly type = '[CustomerDashboardState] QueryOperations';
  constructor(public customerId: number) {}
}

export class QueryRegistrations {
  static readonly type = '[CustomerDashboardState] QueryRegistrations';
  constructor(public customerId: number) {}
}

export class ClearRegistrations {
  static readonly type = '[CustomerDashboardState] ClearRegistrations';
}

export class QueryConnectors {
  static readonly type = '[CustomerDashboardState] QueryConnectors';
}

export class LoadingOperations {
  static readonly type = '[PortalDashboardState] LoadingOperations';
  constructor(public isLoadingOperations: boolean) {}
}

export class LoadingRegistrations {
  static readonly type = '[PortalDashboardState] LoadingRegistrations';
  constructor(public isLoadingRegistrations: boolean) {}
}
