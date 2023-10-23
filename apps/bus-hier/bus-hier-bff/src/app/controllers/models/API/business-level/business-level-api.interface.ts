export interface IBusinessLevelAPI {
  business_level_id: string;
  erp_id: string;
  business_level_name_singular: string;
  business_level_name_plural: string;
  level: number;
  is_active: boolean;
  created_timestamp: string;
  created_by_user_id: string;
  last_modified_timestamp: string;
  last_modified_by_user_id: string;
}
