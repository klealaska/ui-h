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
  BusHierError,
  BusinessLevel,
  BusinessLevelMapped,
  BusinessLevelMappedList,
  CreateBusinessLevelDto,
  ICreateBusinessLevel,
  IUpdateBusinessLevel,
  UpdateBusinessLevelDto,
} from '../models';
import { BusinessLevelService } from './business-level.service';
import { IGenericStringObject } from '@ui-coe/shared/bff/types';

@ApiTags('Business Level Module')
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
@Controller('business-level')
export class BusinessLevelController {
  constructor(private readonly businessLevelService: BusinessLevelService) {}

  /**
   * @method getBusinessLevelByErpId
   * @param id string representing the erpId
   * @returns `Observable<BusinessLevelMappedList>`
   * @memberof BusinessLevelController
   */
  @Get('/erp/:erpId')
  @ApiResponse({
    status: 200,
    description: 'Get the business levels for an ERP',
    type: BusinessLevelMapped,
  })
  getBusinessLevelsByErpId(
    @Param('erpId') id: string,
    @Headers() headers,
    @Query() query
  ): Observable<BusinessLevelMappedList> {
    return this.businessLevelService.getBusinessLevelsByErpId(id, headers, query);
  }

  @Post('/erp/:erpId/business-level')
  @ApiResponse({
    status: 201,
    description: 'Create a new business level for an ERP',
    type: BusinessLevel,
  })
  @ApiBody({
    description: 'Create Business Level',
    type: CreateBusinessLevelDto,
  })
  @ApiCreatedResponse({
    description: 'The business level has been successfully created.',
    type: BusinessLevel,
  })
  createBusinessLevel(
    @Param('erpId') erpId: string,
    @Body() body: ICreateBusinessLevel,
    @Headers() headers
  ): Observable<BusinessLevel | BusHierError> {
    const dtoBody: CreateBusinessLevelDto = new CreateBusinessLevelDto(body);

    return this.businessLevelService.createBusinessLevel(erpId, dtoBody, headers);
  }

  /**
   * @method getBusinessLevel
   * @param id string representing the businessLevelId
   * @returns `Observable<BusinessLevel>`
   * @memberof BusinessLevelController
   */
  @Get(':businessLevelId')
  @ApiResponse({
    status: 200,
    description: 'Get an existing business level for an ERP',
    type: BusinessLevel,
  })
  getBusinessLevel(
    @Param('businessLevelId') id: string,
    @Headers() headers
  ): Observable<BusinessLevel | BusHierError> {
    return this.businessLevelService.getBusinessLevel(id, headers);
  }

  /**
   * @method updateBusinessLevel
   * @param id string
   * @param body UpdateBusinessLevelDto
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<BusinessLevel | BusHierError>`
   */
  @Put(':businessLevelId')
  @ApiResponse({
    status: 200,
    description: 'Update an existing business level for an ERP',
    type: BusinessLevel,
  })
  @ApiBody({
    description: 'Update Business Level',
    type: UpdateBusinessLevelDto,
  })
  @ApiCreatedResponse({
    description: 'The business level has been successfully updated.',
    type: BusinessLevel,
  })
  updateBusinessLevel(
    @Param('businessLevelId') id: string,
    @Headers() headers: IGenericStringObject,
    @Body() body: IUpdateBusinessLevel
  ): Observable<BusinessLevel | BusHierError> {
    const dtoBody = new UpdateBusinessLevelDto(body);

    return this.businessLevelService.updateBusinessLevel(id, dtoBody, headers);
  }
}
