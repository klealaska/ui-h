export class GetOperations {
  static readonly type = '[ConnectorDetailState] GetOperations';
  constructor(public connectorId: number) {}
}

export class GetCustomers {
  static readonly type = '[ConnectorDetailState] GetCustomers';
  constructor(public connectorId: number) {}
}

export class ClearConnectorDetails {
  static readonly type = '[ConnectorDetailState] ClearConnectorDetail';
}
