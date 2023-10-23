import { RegistrationEnablement } from '../models';

export class GetOperationTypes {
  static readonly type = '[DataSelectionState] GetOperationTypes';
}

export class GetRegistrationEnablements {
  static readonly type = '[DataSelectionState] GetRegistrationEnablements';
}

export class ClearDataSelection {
  static readonly type = '[DataSelectionState] ClearDataSelection';
}

export class UpdateRegistrationEnablement {
  static readonly type = '[DataSelectionState] UpdateRegistrationEnablement';
  constructor(public registrationEnablement: RegistrationEnablement) {}
}

export class SaveRegistrationEnablements {
  static readonly type = '[DataSelectionState] SaveRegistrationEnablements';
}

export class PostMappingFile {
  static readonly type = '[DataSelectionState] PostMappingFile';
  constructor(public operationTypeId: number, public file: File) {}
}
