import { Body, Controller, Get, Headers, Param, Patch, Put, Query } from '@nestjs/common';
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
import { Erp, BusHierError, ErpMapped, IListWrapper, UpdateErpDto } from '../models';
import { ErpService } from './erp.service';

@ApiTags('Erp Module')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'x-tenant-id',
})
@ApiBearerAuth()
@ApiInternalServerErrorResponse({
  description: 'Something has gone wrong.',
  type: BusHierError,
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('erp')
export class ErpController {
  constructor(private readonly erpService: ErpService) {}

  /**
   * Api erps endpoint
   * @param {string} id string representing the organizationId
   * @returns {*}
   * @memberof ErpController
   */
  @Get('/organization/:orgId')
  @ApiResponse({ status: 200, description: 'Get All Erps By Organization ID', type: ErpMapped })
  getErps(
    @Param('orgId') id: string,
    @Headers() headers,
    @Query() query
  ): Observable<IListWrapper<ErpMapped>> {
    return this.erpService.getErps(id, headers, query);
  }

  /**
   * @method getErpById
   * @param {string} id string representing the erpId
   * @returns {Observable<IErp>}
   * @memberof ErpController
   */
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get Erp By Id', type: Erp })
  getErpById(@Param('id') id: string, @Headers() headers): Observable<Erp | BusHierError> {
    return this.erpService.getErpById(id, headers);
  }

  /**
   * @method updateErp
   * @param {Object} headers
   * @param {UpdateErpDto} body UpdateErpDto
   * @returns {Observable<IErp>}
   * @memberof ErpController
   */
  @Put(':id')
  @ApiResponse({ status: 200, description: 'Updated Erp' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    description: 'Erp',
    type: UpdateErpDto,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Erp,
  })
  updateErp(
    @Param('id') id: string,
    @Headers() headers: { [key: string]: string },
    @Body() body: UpdateErpDto
  ): Observable<Erp | BusHierError> {
    return this.erpService.updateErp(id, headers, body);
  }

  /**
   * @method activateErp
   * @param {string} id string representing ERP
   * @param {Object} headers
   * @memberof ErpController
   */
  @Patch(':id/activate')
  @ApiResponse({ status: 204, description: 'Activated Erp' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  activateErp(
    @Param('id') id: string,
    @Headers() headers: { [key: string]: string }
  ): Observable<null | BusHierError> {
    return this.erpService.activateErp(id, headers);
  }

  /**
   * @method deactivateErp
   * @param {string} id string representing ERP
   * @param {Object} headers
   * @memberof ErpController
   */
  @Patch(':id/deactivate')
  @ApiResponse({ status: 204, description: 'Deactivated Erp' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deactivateErp(
    @Param('id') id: string,
    @Headers() headers: { [key: string]: string }
  ): Observable<null | BusHierError> {
    return this.erpService.deactivateErp(id, headers);
  }
}
