import { ApiPropertyOptional } from '@nestjs/swagger';

export interface IUpdateErpAPI {
  erp_name?: string;
  erp_code?: string;
  company_database_name?: string;
  company_database_id?: string;
  is_cross_company_coding_allowed?: string;
  purchase_order_prefix?: string;
  starting_purchase_order_number?: string;
}

export class UpdateErpDto implements IUpdateErpAPI {
  @ApiPropertyOptional()
  erp_name?: string;
  @ApiPropertyOptional()
  erp_code?: string;
  @ApiPropertyOptional()
  company_database_name?: string;
  @ApiPropertyOptional()
  company_database_id?: string;
  @ApiPropertyOptional()
  is_cross_company_coding_allowed?: string;
  @ApiPropertyOptional()
  purchase_order_prefix?: string;
  @ApiPropertyOptional()
  starting_purchase_order_number?: string;
}
