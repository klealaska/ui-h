export class GetOperation {
  static readonly type = '[OperationState] GetOperation';
  constructor(public customerId?: number, public operationId?: number) {}
}

export class GetConnector {
  static readonly type = '[OperationState] GetConnector';
  constructor(public connectorId: number) {}
}

export class GetArtifacts {
  static readonly type = '[OperationState] GetArtifacts';
  constructor(public customerId: number, public executionId: number) {}
}

export class GetEvents {
  static readonly type = '[OperationState] GetEvents';
  constructor(public customerId: number, public executionId: number, public isReport?: boolean) {}
}

export class GetDetails {
  static readonly type = '[OperationState] GetDetails';
  constructor(public customerId: number, public operationId: number, public isReport?: boolean) {}
}

export class ClearOperation {
  static readonly type = '[OperationState] ClearOperation';
}
