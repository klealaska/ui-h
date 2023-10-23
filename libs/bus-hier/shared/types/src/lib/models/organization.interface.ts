import { IAddress } from './address.interface';

export interface IOrganization {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  isActive: boolean;
  createdTimestamp?: string;
  createdByUserId?: string;
  lastModifiedTimestamp?: string;
  lastModifiedByUserId?: string;
  erps: string[];
  organizationAddresses: IAddress[];
}
