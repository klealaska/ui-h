import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map } from 'rxjs';

import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { IGenericStringObject, IListWrapperAPI } from '@ui-coe/shared/bff/types';

import { HttpConfigService } from '../../../services/http-config.service';
import { busHierErrorMapper, entityMapper } from '../../shared';
import {
  BusHierError,
  EntityMapped,
  EntityFull,
  EntityFullList,
  EntityList,
  IEntityApi,
  UpdateEntityDTO,
  UpdateAddressDto,
  EntityAddress,
  IEntityAddressApi,
} from '../models';

@Injectable()
export class EntityService {
  constructor(private http: HttpService, private httpConfig: HttpConfigService) {}

  getEntitiesByErpId(
    erpId: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<EntityList | BusHierError> {
    return this.http
      .get(this.httpConfig.getEntitiesByErpId(erpId), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
            IListWrapperAPI<IEntityApi>,
            EntityFullList
          >(response.data);

          const mappedItems: EntityMapped[] = camelCaseResponse.items.map((item: EntityFull) =>
            entityMapper(item)
          );

          return {
            ...camelCaseResponse,
            items: mappedItems,
          };
        }),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  getEntityByEntityId(
    entityId: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<EntityMapped | BusHierError> {
    return this.http
      .get(this.httpConfig.getEntityByEntityId(entityId), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: EntityFull = camelCaseObjectKeys<IEntityApi, EntityFull>(
            response.data
          );

          return entityMapper(camelCaseResponse);
        }),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  getEntitiesByBusinessLevel(
    erpId: string,
    businessLevel: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<EntityList | BusHierError> {
    return this.http
      .get(this.httpConfig.getEntitiesByBusinessLevel(erpId, businessLevel), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
            IListWrapperAPI<IEntityApi>,
            EntityFullList
          >(response.data);

          const mappedItems: EntityMapped[] = camelCaseResponse.items.map((item: EntityFull) =>
            entityMapper(item)
          );

          return {
            ...camelCaseResponse,
            items: mappedItems,
          };
        }),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  getChildEntitiesByChildLevel(
    entityId: string,
    erpId: string,
    childLevel: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<EntityFullList> {
    return this.http
      .get(this.httpConfig.getChildEntitiesByChildLevel(entityId, erpId, childLevel), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
            IListWrapperAPI<IEntityApi>,
            EntityFullList
          >(response.data);

          return camelCaseResponse;
        }),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  getAllChildEntities(
    entityId: string,
    erpId: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<EntityList | BusHierError> {
    return this.http
      .get(this.httpConfig.getAllChildEntities(entityId, erpId), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
            IListWrapperAPI<IEntityApi>,
            EntityFullList
          >(response.data);

          const mappedItems: EntityMapped[] = camelCaseResponse.items.map((item: EntityFull) =>
            entityMapper(item)
          );

          return {
            ...camelCaseResponse,
            items: mappedItems,
          };
        }),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }
  /**
   * @method updateEntity
   * @param {Object} headers
   * @param {UpdateEntityDto} body UpdateEntityDto
   * @returns {Observable<EntityFull>}
   */
  updateEntity(
    id: string,
    headers: { [key: string]: string },
    body: UpdateEntityDTO
  ): Observable<EntityFull | BusHierError> {
    return this.http
      .put(this.httpConfig.updateEntity(id), snakeCaseObjectKeys(body), {
        headers,
      })
      .pipe(
        map(data => camelCaseObjectKeys<IEntityApi, EntityFull>(data.data)),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  activateEntity(id: string, headers: { [key: string]: string }): Observable<null | BusHierError> {
    return this.http.patch(this.httpConfig.activateEntity(id), {}, { headers }).pipe(
      map(response => response.data),
      catchError(err => {
        throw new HttpException(busHierErrorMapper(err), err.response?.status);
      })
    );
  }

  deactivateEntity(id: string, headers: IGenericStringObject): Observable<null | BusHierError> {
    return this.http.patch(this.httpConfig.deactivateEntity(id), {}, { headers }).pipe(
      map(response => response.data),
      catchError(err => {
        throw new HttpException(busHierErrorMapper(err), err.response?.status);
      })
    );
  }

  // Entity Address

  /**
   * @method updateEntityAddress
   * @description Update an entity address
   * @param entityId string
   * @param addressId string
   * @param body UpdateAddressDto
   * @param headers IGenericStringObject
   * @returns `Observable<EntityAddress | BusHierError>`
   */
  updateEntityAddress(
    entityId: string,
    addressId: string,
    body: UpdateAddressDto,
    headers: IGenericStringObject
  ): Observable<EntityAddress | BusHierError> {
    return this.http
      .put(this.httpConfig.updateEntityAddress(entityId, addressId), body, {
        headers,
      })
      .pipe(
        map(response => camelCaseObjectKeys<IEntityAddressApi, EntityAddress>(response.data)),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method activateEntityAddress
   * @description Activate an entity address
   * @param entityId string
   * @param addressId string
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  activateEntityAddress(
    entityId: string,
    addressId: string,
    headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.http
      .patch(this.httpConfig.activateEntityAddress(entityId, addressId), {}, { headers })
      .pipe(
        map(response => response.data),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method deactivateEntityAddress
   * @description Deactivate an entity address
   * @param entityId string
   * @param addressId string
   * @param headers IGenericStringObject
   * @returns `Observable<null | BusHierError>`
   */
  deactivateEntityAddress(
    entityId: string,
    addressId: string,
    headers: IGenericStringObject
  ): Observable<null | BusHierError> {
    return this.http
      .patch(this.httpConfig.deactivateEntityAddress(entityId, addressId), {}, { headers })
      .pipe(
        map(response => response.data),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }
}
