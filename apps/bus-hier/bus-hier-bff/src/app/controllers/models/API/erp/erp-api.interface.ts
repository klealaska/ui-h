import { ApiProperty } from '@nestjs/swagger';

export interface IErpAPI {
  organization_id: string;
  erp_id: string;
  erp_name: string;
  erp_code: string;
  company_database_name: string;
  company_database_id: string;
  is_cross_company_coding_allowed: string;
  is_active: string;
  purchase_order_prefix: string;
  starting_purchase_order_number: string;
  created_timestamp: string;
  created_by_user_id: string;
  last_modified_timestamp: string;
  last_modified_by_user_id: string;
}

export class ErpDto implements IErpAPI {
  @ApiProperty()
  organization_id: string;
  @ApiProperty()
  erp_id: string;
  @ApiProperty()
  erp_name: string;
  @ApiProperty()
  erp_code: string;
  @ApiProperty()
  company_database_name: string;
  @ApiProperty()
  company_database_id: string;
  @ApiProperty()
  is_cross_company_coding_allowed: string;
  @ApiProperty()
  is_active: string;
  @ApiProperty()
  purchase_order_prefix: string;
  @ApiProperty()
  starting_purchase_order_number: string;
  @ApiProperty()
  created_timestamp: string;
  @ApiProperty()
  created_by_user_id: string;
  @ApiProperty()
  last_modified_timestamp: string;
  @ApiProperty()
  last_modified_by_user_id: string;
}
