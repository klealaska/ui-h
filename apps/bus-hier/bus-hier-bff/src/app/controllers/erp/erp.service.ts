import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IGenericStringObject, IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { HttpConfigService } from '../../../services/http-config.service';
import { busHierErrorMapper } from '../../shared';
import {
  IErpAPI,
  IErp,
  IErpMapped,
  Erp,
  BusHierError,
  UpdateErpDto,
  ErpList,
  ListWrapper,
} from '../models';

@Injectable()
export class ErpService {
  constructor(private http: HttpService, private httpConfigService: HttpConfigService) {}

  getErps(
    orgId: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<ErpList> {
    return this.http
      .get(this.httpConfigService.getErps(orgId), {
        headers,
        params: snakeCaseObjectKeys(query),
      })
      .pipe(
        map(response => {
          const camelCaseResponse: ListWrapper<Erp> = camelCaseObjectKeys<
            IListWrapperAPI<IErpAPI>,
            ListWrapper<Erp>
          >(response.data);

          const items: IErpMapped[] = camelCaseResponse.items.map((item: IErp) => ({
            organizationId: item.organizationId,
            erpId: item.erpId,
            erpName: item.erpName,
            erpCode: item.erpCode,
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
   * @method getErpById
   * @param {string} id string representing the erpId
   * @returns {Observable<Erp>}
   */
  getErpById(id: string, headers: IGenericStringObject): Observable<Erp | BusHierError> {
    return this.http.get(this.httpConfigService.getErpById(id), { headers }).pipe(
      map(response => camelCaseObjectKeys<IErpAPI, Erp>(response.data)),
      catchError(err => {
        throw new HttpException(busHierErrorMapper(err), err.response?.status);
      })
    );
  }

  /**
   * @method updateErp
   * @param {Object} headers
   * @param {UpdateErpDto} body UpdateErpDto
   * @returns {Observable<ErpInterface>}
   */
  updateErp(
    id: string,
    headers: IGenericStringObject,
    body: UpdateErpDto
  ): Observable<Erp | BusHierError> {
    return this.http
      .put(this.httpConfigService.updateErp(id), snakeCaseObjectKeys(body), {
        headers,
      })
      .pipe(
        map(data => camelCaseObjectKeys<IErpAPI, Erp>(data.data)),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method activateErp
   * @param {Object} headers
   * @returns {Observable<null>}
   */
  activateErp(id: string, headers: { [key: string]: string }): Observable<null | BusHierError> {
    return this.http
      .patch(
        this.httpConfigService.activateErp(id),
        {},
        {
          headers,
        }
      )
      .pipe(
        map(response => response.data),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }

  /**
   * @method activateErp
   * @param {Object} headers
   * @returns {Observable<null>}
   */
  deactivateErp(id: string, headers: { [key: string]: string }): Observable<null | BusHierError> {
    return this.http
      .patch(
        this.httpConfigService.deactivateErp(id),
        {},
        {
          headers,
        }
      )
      .pipe(
        map(response => response.data),
        catchError(err => {
          throw new HttpException(busHierErrorMapper(err), err.response?.status);
        })
      );
  }
}
