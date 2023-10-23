import {
  Controller,
  Headers,
  Get,
  Query,
  Param,
  Post,
  Body,
  Patch,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { IGenericStringObject } from '@ui-coe/shared/bff/types';
import {
  AssignTenantEntitlementDto,
  ProductEntitlementMapped,
  ProductEntitlementsList,
  TenantEntitlementMapped,
  TenantError,
} from '../models';
import { ProductEntitlementService } from './product-entitlement.service';

@ApiTags('Product Entitlement Module')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'x-tenant-id',
})
@ApiBearerAuth()
@ApiInternalServerErrorResponse({
  description: 'Something has gone wrong.',
  type: TenantError,
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('product-entitlement')
export class ProductEntitlementController {
  constructor(private entitlementService: ProductEntitlementService) {}

  /**
   * @method getProductEntitlements
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<ProductEntitlementsList>`
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get All Product Entitlements',
    type: ProductEntitlementsList,
  })
  getProductEntitlements(
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<ProductEntitlementMapped[]> {
    return this.entitlementService.getProductEntitlements(headers, query);
  }

  /**
   * @method getProductEntitlementsByTenantId
   * @param id string
   * @param headers IGenericStringObject
   * @returns `Observable<TenantEntitlementMapped>[]`
   */
  @Get('/tenants/:tenantId')
  @ApiResponse({
    status: 200,
    description: 'Get Product Entitlements By Id',
    type: [TenantEntitlementMapped],
  })
  getProductEntitlementsByTenantId(
    @Param('tenantId') id: string,
    @Headers() headers: IGenericStringObject
  ): Observable<TenantEntitlementMapped[]> {
    return this.entitlementService.getProductEntitlementsByTenantId(id, headers);
  }

  /**
   * @method assignProductEntitlement
   * @param productEntitlementId string
   * @param tenantId string
   * @param body AssignTenantEntitlementDto
   * @param headers IGenericStringObject
   * @returns `Observable<TenantEntitlementMapped>`
   */
  @Post('/:productEntitlementId/tenants/:tenantId')
  @ApiResponse({
    status: 201,
    description: 'Assign An Entitlement To A Tenant',
    type: TenantEntitlementMapped,
  })
  @ApiBody({
    description: 'Assign Product Entitlement to a Tenant',
    type: AssignTenantEntitlementDto,
  })
  assignProductEntitlement(
    @Param('productEntitlementId') productEntitlementId: string,
    @Param('tenantId') tenantId: string,
    @Body() body: AssignTenantEntitlementDto,
    @Headers() headers: IGenericStringObject
  ): Observable<TenantEntitlementMapped> {
    return this.entitlementService.assignEntitlement(productEntitlementId, tenantId, body, headers);
  }

  /**
   * @method activateTenantEntitlement
   * @param productEntitlementId string
   * @param tenantId string
   * @param headers IGenericStringObject
   * @returns `Observable<void>`
   */
  @Patch('/:productEntitlementId/tenants/:tenantId/activate')
  @ApiResponse({ status: 204, description: 'Activates An Entitlement For A Tenant' })
  @HttpCode(204)
  activateTenantEntitlement(
    @Param('productEntitlementId') productEntitlementId: string,
    @Param('tenantId') tenantId: string,
    @Headers() headers: IGenericStringObject
  ): Observable<void> {
    return this.entitlementService.activateTenantEntitlement(
      productEntitlementId,
      tenantId,
      headers
    );
  }

  /**
   * @method deactivateTenantEntitlement
   * @param productEntitlementId string
   * @param tenantId string
   * @param headers IGenericStringObject
   * @returns `Observable<void>`
   */
  @Patch('/:productEntitlementId/tenants/:tenantId/deactivate')
  @ApiResponse({ status: 204, description: 'Deactivates An Entitlement For A Tenant' })
  @HttpCode(204)
  deactivateTenantEntitlement(
    @Param('productEntitlementId') productEntitlementId: string,
    @Param('tenantId') tenantId: string,
    @Headers() headers: IGenericStringObject
  ): Observable<void> {
    return this.entitlementService.deactivateTenantEntitlement(
      productEntitlementId,
      tenantId,
      headers
    );
  }
}
