export interface Operation {
  connectorId: number;
  connectorName: string;
  deletes: number;
  detailUrl?: string;
  endDate: string;
  errors: number;
  executionId: number;
  fileUploadId?: number;
  artifactUrl?: string;
  id: number;
  inserts: number;
  isExecutionPreview: boolean;
  noUpdates: number;
  operationStatusTypeId: number;
  operationStatusTypeName: string;
  operationTypeId: number;
  operationTypeName: string;
  registrationDescription: string;
  registrationId: number;
  startDate: string;
  updates: number;
}

export interface OperationDetail<T> {
  data: T[];
}
