import { OperationType } from '.';

export interface Schedule {
  createdBy?: string;
  createdDate?: string;
  cronText: string;
  customerId?: number;
  description?: string;
  id?: number;
  isActive: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  operationTypes: OperationType[];
  registrationId?: number;
  startDate: string;
  timeZone: string;
}
