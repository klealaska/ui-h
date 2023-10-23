import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { IGenericStringObject, IListWrapperAPI } from '@ui-coe/shared/bff/types';

import { HttpConfigService } from '../../../services/http-config.service';
import { busHierErrorMapper } from '../../shared';
import {
  BusHierError,
  CreateOrganizationDto,
  IOrganizationAPI,
  ListWrapper,
  Organization,
  OrganizationAddress,
  OrganizationAddressAPI,
  OrganizationList,
  OrganizationMapped,
  UpdateAddressDto,
  UpdateOrganizationDto,
} from '../models';

@Injectable()
export class OrganizationService {
  constructor(private http: HttpService, private httpConfigService: HttpConfigService) {}

  /**
   * @method createOrganization
   * @description Create a new Organization
   * @param headers IGenericStringObject
   * @param body CreateOrganizationDto
   * @returns `Observable<Organization | BusHierError>`
   */
  createOrganization(
    headers: IGenericStringObject,
    body: CreateOrganizationDto
  ): Observable<Organization | BusHierError> {
    return this.http
      .post(this.httpConfigService.createOrganization(), snakeCaseObjectKeys(body), { headers })
      .pipe(
        map(response => camelCaseObjectKeys<IOrganizationAPI, Organization>(response.data)),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method createOrganizationAddress
   * @description Get a list of Organizations
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<OrganizationList>`
   */
  getOrganizations(
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<OrganizationList> {
    return this.http
      .get(this.httpConfigService.getOrganizations(), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: ListWrapper<Organization> = camelCaseObjectKeys<
            IListWrapperAPI<IOrganizationAPI>,
            ListWrapper<Organization>
          >(response.data);

          const items: OrganizationMapped[] = camelCaseResponse.items.map((item: Organization) => ({
            organizationId: item.organizationId,
            organizationName: item.organizationName,
            organizationCode: item.organizationCode,
            isActive: item.isActive,
          }));

          return {
            ...camelCaseResponse,
            items,
          };
        }),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method getOrganizationById
   * @description Get Organization by Id
   * @param id string representing the organizationId
   * @param headers IGenericStringObject
   * @returns `Observable<Organization>`
   */
  getOrganizationById(id: string, headers: IGenericStringObject): Observable<Organization> {
    return this.http.get(this.httpConfigService.getOrganizationById(id), { headers }).pipe(
      map(response => camelCaseObjectKeys<IOrganizationAPI, Organization>(response.data)),
      catchError(err => {
        throw new HttpException(busHierErrorMapper(err), err.response?.status);
      })
    );
  }

  /**
   * @method getOrganizationAddresses
   * @description Update an Organization
   * @param id string representing the organizationId
   * @param headers IGenericStringObject
   * @param body UpdateOrganizationDto
   * @returns `Observable<Organization | BusHierError>`
   */
  updateOrganization(
    id: string,
    headers: IGenericStringObject,
    body: UpdateOrganizationDto
  ): Observable<Organization | BusHierError> {
    return this.http
      .put(this.httpConfigService.updateOrganization(id), snakeCaseObjectKeys(body), { headers })
      .pipe(
        map(response => camelCaseObjectKeys<IOrganizationAPI, Organization>(response.data)),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method activateOrganization
   * @description Activate an Organization
   * @param id string representing the organizationId
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  activateOrganization(id: string, headers: IGenericStringObject): Observable<null | BusHierError> {
    return this.http.patch(this.httpConfigService.activateOrganization(id), {}, { headers }).pipe(
      map(response => response.data),
      catchError(err => {
        throw new HttpException(busHierErrorMapper(err), err.response?.status);
      })
    );
  }

  /**
   * @method deactivateOrganization
   * @description Deactivate an Organization
   * @param id string representing the organizationId
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  deactivateOrganization(
    id: string,
    headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.http.patch(this.httpConfigService.deactivateOrganization(id), {}, { headers }).pipe(
      map(response => response.data),
      catchError(err => {
        throw new HttpException(busHierErrorMapper(err), err.response?.status);
      })
    );
  }

  // Organization Address

  /**
   * @method updateOrganizationAddress
   * @description Update an Organization Address
   * @param orgId string representing the organizationId
   * @param addressId string representing the addressId
   * @param headers IGenericStringObject
   * @param body UpdateAddressDto
   * @returns `Observable<OrganizationAddress | BusHierError>`
   */
  updateOrganizationAddress(
    orgId: string,
    addressId: string,
    headers: IGenericStringObject,
    body: UpdateAddressDto
  ): Observable<OrganizationAddress | BusHierError> {
    return this.http
      .put(this.httpConfigService.updateOrganizationAddress(orgId, addressId), body, {
        headers,
      })
      .pipe(
        map(response =>
          camelCaseObjectKeys<OrganizationAddressAPI, OrganizationAddress>(response.data)
        ),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method activateOrganizationAddress
   * @description Activate an Organization Address
   * @param orgId string representing the organizationId
   * @param addressId string representing the addressId
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  activateOrganizationAddress(
    orgId: string,
    addressId: string,
    headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.http
      .patch(this.httpConfigService.activateOrganizationAddress(orgId, addressId), {}, { headers })
      .pipe(
        map(response => response.data),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method deactivateOrganizationAddress
   * @description Deactivate an Organization Address
   * @param orgId string representing the organizationId
   * @param addressId string representing the addressId
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  deactivateOrganizationAddress(
    orgId: string,
    addressId: string,
    headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.http
      .patch(
        this.httpConfigService.deactivateOrganizationAddress(orgId, addressId),
        {},
        { headers }
      )
      .pipe(
        map(response => response.data),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }
}
