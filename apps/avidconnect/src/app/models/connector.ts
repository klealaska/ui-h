import { Registration } from '.';

export interface Connector {
  authorName: string;
  connectorTypeId: number;
  connectorTypeName: string;
  createdBy: string;
  createdDate: string;
  description: string;
  displayName: string;
  id: number;
  isActive: boolean;
  logoUrl: string;
  modifiedBy: string;
  modifiedDate: string;
  name: string;
  schemaUrl: string;
  settingsDefaultUrl: string;
  version: string;
  website: string;
}

export interface ConnectorSummary {
  id: number;
  displayName: string;
  isActive: boolean;
}

export interface ConnectorItem extends Connector {
  registrations: Registration[];
}
