import { IAddressAPI } from '../shared';

export interface IEntityApi {
  entity_id: string;
  entity_name: string;
  erp_id: string;
  entity_code: string;
  parent_entity_id: string;
  business_level: number;
  entity_addresses: IEntityAddressApi[];
  is_active: boolean;
  created_timestamp: string;
  created_by_user_id: string;
  last_modified_timestamp: string;
  last_modified_by_user_id: string;
}

export interface IEntityAddressApi extends IAddressAPI {
  entity_id: string;
}
