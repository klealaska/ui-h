export interface Address {
  id: string;
  parent_id?: string;
  display_address_id?: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  address_line4?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  address_type: string;
  is_active: boolean;
  is_primary: boolean;
  organization_id?: string;
  created_timestamp?: string;
  created_by_user_id?: string;
  last_modified_timestamp?: string;
  last_modified_by_user_id?: string;
}
