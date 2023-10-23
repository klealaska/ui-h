import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import {
  BusHierError,
  CreateOrganizationDto,
  IListWrapper,
  Organization,
  OrganizationAddress,
  OrganizationMapped,
  UpdateAddressDto,
  UpdateOrganizationDto,
} from '../models';
import { OrganizationService } from './organization.service';
import { UpdateAddressRequestBody } from '../models/UI/shared/address.interface';
import { IGenericStringObject } from '@ui-coe/shared/bff/types';

@ApiTags('Organization Module')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({
  description: 'Something has gone wrong.',
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * @method createOrganization
   * @param headers IGenericStringObject
   * @param body CreateOrganizationDto
   * @returns `Observable<IOrganization>`
   * @memberof OrganizationController
   */
  @Post()
  @ApiBody({ description: 'Organization', type: CreateOrganizationDto })
  createOrganization(
    @Headers() headers: IGenericStringObject,
    @Body() body: CreateOrganizationDto
  ): Observable<Organization | BusHierError> {
    return this.organizationService.createOrganization(headers, body);
  }

  /**
   * @method getOrganizations
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @memberof OrganizationController
   * @returns `Observable<IListWrapper<OrganizationMapped>>`
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Get All Organizations', type: OrganizationMapped })
  getOrganizations(
    @Headers() headers: IGenericStringObject,
    @Query() query: IGenericStringObject
  ): Observable<IListWrapper<OrganizationMapped>> {
    return this.organizationService.getOrganizations(headers, query);
  }

  /**
   * @method getOrganizationById
   * @param id string representing the organizationId
   * @param headers IGenericStringObject
   * @returns `Observable<IOrganization>`
   * @memberof OrganizationController
   */
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get Organization By Id', type: Organization })
  getOrganizationById(
    @Param('id') id: string,
    @Headers() headers: IGenericStringObject
  ): Observable<Organization> {
    return this.organizationService.getOrganizationById(id, headers);
  }

  /**
   * @method updateOrganization
   * @param id string representing the organizationId
   * @param body UpdateOrganizationDto
   * @param headers IGenericStringObject
   * @returns `Observable<IOrganization>`
   * @memberof OrganizationController
   */
  @Put(':id')
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({ status: 200, description: 'Update Organization', type: Organization })
  @ApiBody({
    description: 'Organization',
    type: UpdateOrganizationDto,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: Organization,
  })
  updateOrganization(
    @Param('id') id: string,
    @Body() body: UpdateOrganizationDto,
    @Headers() headers: IGenericStringObject
  ): Observable<Organization | BusHierError> {
    return this.organizationService.updateOrganization(id, headers, body);
  }

  /**
   * @method activateOrganization
   * @param id string representing the organizationId
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   * @memberof OrganizationController
   */
  @Patch(':id/activate')
  @ApiResponse({ status: 204, description: 'Activates An Organization' })
  @HttpCode(204)
  activateOrganization(
    @Param('id') id: string,
    @Headers() headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.organizationService.activateOrganization(id, headers);
  }

  /**
   * @method deactivateOrganization
   * @param id string representing the organizationId
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   * @memberof OrganizationController
   */
  @Patch(':id/deactivate')
  @ApiResponse({ status: 204, description: 'Deactivates An Organization' })
  @HttpCode(204)
  deactivateOrganization(
    @Param('id') id: string,
    @Headers() headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.organizationService.deactivateOrganization(id, headers);
  }

  // Organization Address endpoints

  /**
   * @method updateOrganizationAddress
   * @description Updates an organization address
   * @param orgId string representing the organizationId
   * @param addressId string representing the addressId
   * @param body UpdateAddressRequestBody
   * @param headers IGenericStringObject
   * @returns `Observable<OrganizationAddress | BusHierError>`
   */
  @Put(':orgId/address/:addressId')
  @ApiResponse({ status: 200, description: 'Update Organization Address', type: Organization })
  @ApiBody({
    description: 'Organization',
    type: UpdateAddressRequestBody,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: OrganizationAddress,
  })
  updateOrganizationAddress(
    @Param('orgId') orgId: string,
    @Param('addressId') addressId: string,
    @Body() body: UpdateAddressRequestBody,
    @Headers() headers: IGenericStringObject
  ): Observable<OrganizationAddress | BusHierError> {
    const dtoBody: UpdateAddressDto = new UpdateAddressDto(body);

    return this.organizationService.updateOrganizationAddress(orgId, addressId, headers, dtoBody);
  }

  /**
   * @method activateOrganizationAddress
   * @description Activates an organization address
   * @param orgId string representing the organizationId
   * @param addressId string representing the addressId
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  @Patch(':orgId/address/:addressId/activate')
  @ApiResponse({ status: 204, description: 'Activates An Organization Address' })
  @HttpCode(204)
  activateOrganizationAddress(
    @Param('orgId') orgId: string,
    @Param('addressId') addressId: string,
    @Headers() headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.organizationService.activateOrganizationAddress(orgId, addressId, headers);
  }

  /**
   * @method deactivateOrganizationAddress
   * @description Deactivates an organization address
   * @param orgId string representing the organizationId
   * @param addressId string representing the addressId
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  @Patch(':orgId/address/:addressId/deactivate')
  @ApiResponse({ status: 204, description: 'Deactivates An Organization Address' })
  @HttpCode(204)
  deactivateOrganizationAddress(
    @Param('orgId') orgId: string,
    @Param('addressId') addressId: string,
    @Headers() headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.organizationService.deactivateOrganizationAddress(orgId, addressId, headers);
  }
}
