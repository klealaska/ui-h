import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';

import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { IGenericStringObject } from '@ui-coe/shared/bff/types';

import { HttpConfigService } from '../../../../services/http-config.service';
import { busHierErrorMapper } from '../../../shared';
import { BusHierError, BusinessHierarchyCount, IBusinessHierarchyCountAPI } from '../../models';

@Injectable()
export class BusHierCountService {
  constructor(private http: HttpService, private httpConfigService: HttpConfigService) {}

  /**
   * @method getBusinessHierarchyCount
   * @param {Object} headers
   * @returns {Observable<BusinessHierarchyCount | BusHierError>}
   */
  getBusinessHierarchyCount(
    headers: IGenericStringObject
  ): Observable<BusinessHierarchyCount | BusHierError> {
    return this.http
      .get(this.httpConfigService.getBusinessHierarchyCount(), {
        headers,
      })
      .pipe(
        map(response =>
          camelCaseObjectKeys<IBusinessHierarchyCountAPI, BusinessHierarchyCount>(response.data)
        ),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }
}
