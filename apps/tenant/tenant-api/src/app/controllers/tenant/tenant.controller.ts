import { Body, Controller, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';

import {
  CreateTenantDto,
  IListWrapper,
  Tenant,
  TenantError,
  TenantMapped,
  UpdateTenantDto,
} from '../models';
import { TenantService } from './tenant.service';

@ApiTags('Tenant Module')
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
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Api tenant endpoint
   * @return {*}
   * @memberof TenantController
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Get All Tenants', type: TenantMapped })
  getTenants(@Headers() headers, @Query() query): Observable<IListWrapper<TenantMapped>> {
    return this.tenantService.getTenants(headers, query);
  }

  /**
   * @method getTenantById
   * @param {string} id string representing the tenantId
   * @returns {Observable<ITenant>}
   * @memberof TenantController
   */
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get Tenant By Id', type: Tenant })
  getTenantById(@Param('id') id: string, @Headers() headers): Observable<Tenant | TenantError> {
    return this.tenantService.getTenantById(id, headers);
  }

  /**
   * @method createTenant
   * @param {Object} headers
   * @param {CreateTenantDto} body CreateTenantDto
   * @returns {Observable<ITenant>}
   * @memberof TenantController
   */
  @Post()
  @ApiResponse({ status: 201, description: 'Created Tenant' })
  @ApiBody({
    description: 'Tenant',
    type: CreateTenantDto,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Tenant,
  })
  createTenant(
    @Headers() headers: { [key: string]: string },
    @Body() body: CreateTenantDto
  ): Observable<Tenant | TenantError> {
    // we need to delete the content-length header we get from the frontend
    // since we are changing the content-type
    delete headers['content-length'];
    return this.tenantService.createTenant(headers, body);
  }

  /**
   * @method updateTenant
   * @param {Object} headers
   * @param {UpdateTenantDto} body UpdateTenantDto
   * @returns {Observable<ITenant>}
   * @memberof TenantController
   */
  @Put(':id')
  @ApiResponse({ status: 200, description: 'Updated Tenant' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    description: 'Tenant',
    type: UpdateTenantDto,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Tenant,
  })
  updateTenant(
    @Param('id') id: string,
    @Headers() headers: { [key: string]: string },
    @Body() body: UpdateTenantDto
  ): Observable<Tenant | TenantError> {
    // we need to delete the content-length header we get from the frontend
    // since we are changing the content-type
    delete headers['content-length'];
    return this.tenantService.updateTenant(id, headers, body);
  }
}
