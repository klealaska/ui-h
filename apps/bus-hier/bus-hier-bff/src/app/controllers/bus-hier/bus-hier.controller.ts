import { Controller, Get, Headers, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ApiTags,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiResponse,
} from '@nestjs/swagger';

import { IGenericStringObject } from '@ui-coe/shared/bff/types';

import { BusHierService } from './bus-hier.service';
import { BusHierError, BusinessHierarchyList, BusinessHierarchyNav } from '../models';

@ApiTags('Business Hierarchy Nav Module')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({
  description: 'Something has gone wrong.',
  type: BusHierError,
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('business-hierarchy')
export class BusHierController {
  constructor(private readonly busHierService: BusHierService) {}

  @Get('navigation')
  @ApiResponse({
    status: 200,
    description: 'Get the Business Hierarchy Navigation object',
    type: BusinessHierarchyNav,
  })
  getBusHierNav(
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<BusinessHierarchyNav> {
    return this.busHierService.getBusHierNav(headers, query);
  }

  @Get('list')
  @ApiResponse({
    status: 200,
    description: 'Get the Business Hierarchy List object',
    type: BusinessHierarchyList,
  })
  getBusHierList(
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<BusinessHierarchyList> {
    return this.busHierService.getBusHierList(headers, query);
  }
}
