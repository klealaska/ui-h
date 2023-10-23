import { Controller, Get, Param, Headers, Query, Put, Body, Patch, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiHeader,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { IGenericStringObject } from '@ui-coe/shared/bff/types';

import { EntityService } from './entity.service';
import {
  BusHierError,
  EntityMapped,
  EntityList,
  EntityFull,
  EntityFullList,
  UpdateEntityDTO,
  UpdateAddressRequestBody,
  EntityAddress,
  UpdateAddressDto,
} from '../models';

@ApiTags('Entity Module')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({
  description: 'Something has gone wrong.',
  type: BusHierError,
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('entity')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  /**
   * @method getEntitiesByErpId
   * @param erpId string
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<EntityList | BusHierError>`
   */
  @Get('erp/:erpId')
  @ApiResponse({
    status: 200,
    description: 'Get all entities for the given ERP Id',
    type: EntityList,
  })
  getEntitiesByErpId(
    @Param('erpId') erpId: string,
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<EntityList | BusHierError> {
    return this.entityService.getEntitiesByErpId(erpId, headers, query);
  }

  /**
   * @method getEntityByEntityId
   * @param entityId string
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<Entity | BusHierError>`
   */
  @Get(':entityId')
  @ApiResponse({
    status: 200,
    description: 'Get an entity for the given entity Id',
    type: EntityMapped,
  })
  getEntityByEntityId(
    @Param('entityId') entityId: string,
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<EntityMapped | BusHierError> {
    return this.entityService.getEntityByEntityId(entityId, headers, query);
  }

  /**
   * @method getEntitiesByBusinessLevel
   * @param erpId string
   * @param businessLevel string
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<EntityList | BusHierError>`
   */
  @Get('erp/:erpId/business-level/:businessLevel')
  @ApiResponse({
    status: 200,
    description: 'Get all entities for the given ERP Id and business level',
    type: EntityList,
  })
  getEntitiesByBusinessLevel(
    @Param('erpId') erpId: string,
    @Param('businessLevel') businessLevel: string,
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<EntityList | BusHierError> {
    return this.entityService.getEntitiesByBusinessLevel(erpId, businessLevel, headers, query);
  }

  /**
   * @method getEntitiesByChildLevel
   * @description Get all entities for a child level for the given ERP Id and child level
   * @param entityId string
   * @param erpId string
   * @param childLevel string
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<EntityFullList | BusHierError>`
   */
  @Get(':entityId/erp/:erpId/child-level/:childLevel')
  @ApiResponse({
    status: 200,
    description:
      'Get all child entities for a child level for the given entity Id, ERP Id and child level',
    type: EntityFullList,
  })
  getChildEntitiesByChildLevel(
    @Param('entityId') entityId: string,
    @Param('erpId') erpId: string,
    @Param('childLevel') childLevel: string,
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<EntityFullList | BusHierError> {
    return this.entityService.getChildEntitiesByChildLevel(
      entityId,
      erpId,
      childLevel,
      headers,
      query
    );
  }

  /**
   * @method getAllChildEntities
   * @param entityId string
   * @param erpId string
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<EntityList | BusHierError>`
   */
  @Get(':entityId/erp/:erpId/all-children')
  @ApiResponse({
    status: 200,
    description: 'Get all child entities for the given entity Id and ERP Id',
    type: EntityList,
  })
  getAllChildEntities(
    @Param('entityId') entityId: string,
    @Param('erpId') erpId: string,
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<EntityList | BusHierError> {
    return this.entityService.getAllChildEntities(entityId, erpId, headers, query);
  }

  /**
   * @method updateEntity
   * @param entityId string
   * @param headers IGenericStringObject
   * @param body UpdateEntityDTO
   * @returns `Observable<EntityFull | BusHierError>`
   * @memberof entityController
   */
  @Put(':entityId')
  @ApiResponse({ status: 200, description: 'Updated an entity' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    description: 'Entity',
    type: UpdateEntityDTO,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: EntityFull,
  })
  updateEntity(
    @Param('entityId') id: string,
    @Headers() headers: IGenericStringObject,
    @Body() body: UpdateEntityDTO
  ): Observable<EntityFull | BusHierError> {
    return this.entityService.updateEntity(id, headers, body);
  }

  /**
   * @method activateEntity
   * @param entityId string
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   * @memberof EntityController
   */
  @Patch(':id/activate')
  @ApiResponse({ status: 204, description: 'Activates an Entity' })
  @HttpCode(204)
  activateEntity(
    @Param('id') id: string,
    @Headers() headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.entityService.activateEntity(id, headers);
  }

  /**
   * @method deactivateEntity
   * @param entityId string
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   * @memberof EntityController
   */
  @Patch(':id/deactivate')
  @ApiResponse({ status: 204, description: 'Deactivates an Entity' })
  @HttpCode(204)
  deactivateEntity(
    @Param('id') id: string,
    @Headers() headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.entityService.deactivateEntity(id, headers);
  }

  // Entity Address Endpoints

  /**
   * @method updateEntityAddress
   * @description Update an entity address
   * @param entityId string
   * @param addressId string
   * @param headers IGenericStringObject
   * @param body UpdateAddressRequestBody
   * @returns `Observable<EntityAddress | BusHierError>`
   */
  @Put(':entityId/address/:addressId')
  @ApiResponse({ status: 200, description: 'Updated an entity address' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    description: 'Entity Address',
    type: UpdateAddressRequestBody,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: EntityAddress,
  })
  updateEntityAddress(
    @Param('entityId') entityId: string,
    @Param('addressId') addressId: string,
    @Body() body: UpdateAddressRequestBody,
    @Headers() headers: IGenericStringObject
  ): Observable<EntityAddress | BusHierError> {
    const dtoBody = new UpdateAddressDto(body);

    return this.entityService.updateEntityAddress(entityId, addressId, dtoBody, headers);
  }

  /**
   * @method activateEntityAddress
   * @description Activate an entity address
   * @param entityId string
   * @param addressId string
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  @Patch(':entityId/address/:addressId/activate')
  @ApiResponse({ status: 204, description: 'Activates an Entity Address' })
  @HttpCode(204)
  activateEntityAddress(
    @Param('entityId') entityId: string,
    @Param('addressId') addressId: string,
    @Headers() headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.entityService.activateEntityAddress(entityId, addressId, headers);
  }

  /**
   * @method deactivateEntityAddress
   * @description Deactivate an entity address
   * @param entityId string
   * @param addressId string
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  @Patch(':entityId/address/:addressId/deactivate')
  @ApiResponse({ status: 204, description: 'Deactivates an Entity Address' })
  @HttpCode(204)
  deactivateEntityAddress(
    @Param('entityId') entityId: string,
    @Param('addressId') addressId: string,
    @Headers() headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.entityService.deactivateEntityAddress(entityId, addressId, headers);
  }
}
