import { Execution } from '../models';

export class GetOperationTypes {
  static readonly type = '[SyncState] GetOperationTypes';
}

export class GetRegistrationEnablements {
  static readonly type = '[SyncState] GetRegistrationEnablements';
}

export class PostExecution {
  static readonly type = '[SyncState] PostExecution';
  constructor(public execution: Execution) {}
}

export class PostFileUpload {
  static readonly type = '[SyncState] PostFileUpload';
  constructor(public operationTypeName: string, public file: File) {}
}

export class RemoveFileId {
  static readonly type = '[SyncState] RemoveFileId';
  constructor(public operationTypeName: string) {}
}

export class AddOperation {
  static readonly type = '[SyncState] AddOperation';
  constructor(public operationTypeName: string) {}
}

export class RemoveOperation {
  static readonly type = '[SyncState] RemoveOperation';
  constructor(public operationTypeName: string) {}
}

export class ResetState {
  static readonly type = '[SyncState] ResetState';
}
