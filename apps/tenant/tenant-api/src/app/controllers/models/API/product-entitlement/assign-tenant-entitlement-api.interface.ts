import { ApiProperty } from '@nestjs/swagger';

export interface IAssignTenantEntitlementAPI {
  assignment_date: string;
  amount: number;
  assignment_source: string;
  source_system: string;
}

export class AssignTenantEntitlementDto implements IAssignTenantEntitlementAPI {
  @ApiProperty()
  assignment_date: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  assignment_source: string;
  @ApiProperty()
  source_system: string;
}
