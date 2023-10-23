import { ApiProperty } from '@nestjs/swagger';

export interface ICreateErpAPI {
  erp_name: string;
  erp_code: string;
  company_database_name: string;
  company_database_id: string;
  is_cross_company_coding_allowed: string;
  purchase_order_prefix: string;
  starting_purchase_order_number: string;
  source_system: string;
}

export class CreateErpDto implements ICreateErpAPI {
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
  purchase_order_prefix: string;
  @ApiProperty()
  starting_purchase_order_number: string;
  @ApiProperty()
  source_system: string;
}
