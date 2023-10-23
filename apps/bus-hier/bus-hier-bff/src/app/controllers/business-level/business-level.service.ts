import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IGenericStringObject, IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { HttpConfigService } from '../../../services/http-config.service';
import { busHierErrorMapper, businessLevelMapper } from '../../shared';
import {
  BusHierError,
  IBusinessLevelAPI,
  BusinessLevel,
  BusinessLevelMapped,
  BusinessLevelMappedList,
  ListWrapper,
  UpdateBusinessLevelDto,
  CreateBusinessLevelDto,
} from '../models';

@Injectable()
export class BusinessLevelService {
  constructor(private http: HttpService, private httpConfigService: HttpConfigService) {}
  /**
   * @method getBusinessLevelByErpId
   * @param {string} erpId string representing the erpId
   * @returns {Observable<BusinessLevelMappedList>}
   */
  getBusinessLevelsByErpId(
    erpId: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<BusinessLevelMappedList> {
    return this.http
      .get(this.httpConfigService.getBuisnessLevelByErpId(erpId), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: ListWrapper<BusinessLevel> = camelCaseObjectKeys<
            IListWrapperAPI<IBusinessLevelAPI>,
            ListWrapper<BusinessLevel>
          >(response.data);

          const items: BusinessLevelMapped[] = camelCaseResponse.items.map((item: BusinessLevel) =>
            businessLevelMapper(item)
          );
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

  createBusinessLevel(
    erpId: string,
    body: CreateBusinessLevelDto,
    headers: IGenericStringObject
  ): Observable<BusinessLevel | BusHierError> {
    return this.http
      .post(this.httpConfigService.createBusinessLevel(erpId), body, { headers })
      .pipe(
        map(response => camelCaseObjectKeys<IBusinessLevelAPI, BusinessLevel>(response.data)),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method getBusinessLevel
   * @param {string} businessLevelId string representing the businessLevelId
   * @returns {Observable<BusinessLevel>}
   */
  getBusinessLevel(
    businessLevelId: string,
    headers: IGenericStringObject
  ): Observable<BusinessLevel | BusHierError> {
    return this.http
      .get(this.httpConfigService.getBusinessLevel(businessLevelId), { headers })
      .pipe(
        map(response => camelCaseObjectKeys<IBusinessLevelAPI, BusinessLevel>(response.data)),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  updateBusinessLevel(
    businessLevelId: string,
    body: UpdateBusinessLevelDto,
    headers: IGenericStringObject
  ): Observable<BusinessLevel | BusHierError> {
    return this.http
      .put(this.httpConfigService.updateBusinessLevel(businessLevelId), body, {
        headers,
      })
      .pipe(
        map(response => camelCaseObjectKeys<IBusinessLevelAPI, BusinessLevel>(response.data)),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }
}
