import { Connector } from '.';

export interface Registration {
  connectorHostModelId?: number;
  connectorId: number;
  connectorName?: string;
  createdBy?: string;
  createdDate?: string;
  customerId?: number;
  customerName?: string;
  description: string;
  externalKey: string;
  id?: number;
  isActive: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  subscription?: string;
  topic?: string;
  connector?: Connector;
}
