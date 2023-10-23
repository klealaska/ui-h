import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';
import { join } from 'path';
import { cloneDeep, isEmpty, pick } from 'lodash';

import { ISortFilterConfig } from './sort-filter-config.interface';

/**
 * @typedef ApiHttpService
 * Type used for implementing mock versions of the various request functions in the HttpService
 * Inheriting the HttpService directly requires injecting axios and implementing functions that are not needed for mock data
 */
type ApiHttpService = Pick<
  HttpService,
  'request' | 'get' | 'delete' | 'head' | 'post' | 'put' | 'patch'
>;

/**
 * MockHttpService
 * @description A service to return mock json instead of live API data
 * This service is injected instead of the NestJs HttpService in the appropriate http module
 * A provider for 'MOCK_FILE_PATH' representing the relative path to the appropriate mock files.
 * e.g. in the @Module() metadata:
 *    providers: [
 *      {
 *        provide: 'MOCK_FILE_PATH',
 *        useValue: '../relative/path/mock/json/files',
 *      },
 *    ]
 *
 * A provider for `SORT_FILTER_CONFIG` is also required that will specify the sorting and filtering
 * properties that are used by the MFE, and it will have the shape of ISortFilterConfig.
 * If an MFE doesn't require any sorting or filtering, then the `defaultSortFilterConfig` can be provided instead
 */
@Injectable()
export class MockHttpService implements ApiHttpService {
  constructor(
    @Inject('MOCK_FILE_PATH') private mockFilePath: string,
    @Inject('SORT_FILTER_CONFIG')
    private sortFilterConfig: ISortFilterConfig
  ) {}

  /**
   * @method request
   * @description
   * The base request function that parses and mock data.
   * Use the appropriate get, delete, head, post, put, patch functions instead
   *
   * @param config `AxiosRequestConfig<D>`
   * D is the type of the body for post/put/patch requests
   * T is the expected response type
   *
   * @returns `Observable<AxiosResponse<T>>`
   */
  public request<T, D = any>(config: AxiosRequestConfig): Observable<AxiosResponse> {
    const data = fs.readFileSync(join(__dirname, `${this.mockFilePath}${config.url}`), 'utf-8');
    return of(this.createResponse(data, config));
  }

  /**
   * @method get
   * @description Used for `get` http requests
   *
   * @param url `string`
   * @param config `AxiosRequestConfig`
   * T is the expected response type
   *
   * @returns `Observable<AxiosResponse<T>>`
   */
  public get<T = any>(url: string, config: AxiosRequestConfig = {}): Observable<AxiosResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'get',
    });
  }

  /**
   * @method delete
   * @description Used for `delete` http requests
   *
   * @param url `string`
   * @param config `AxiosRequestConfig`
   * T is the expected response type
   *
   * @returns `Observable<AxiosResponse<T>>`
   */
  public delete<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Observable<AxiosResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'delete',
    });
  }

  /**
   * @method head
   * @description Used for `head` http requests
   *
   * @param url `string`
   * @param config `AxiosRequestConfig`
   * T is the expected response type
   *
   * @returns `Observable<AxiosResponse<T>>`
   */
  public head<T = any>(url: string, config: AxiosRequestConfig = {}): Observable<AxiosResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'head',
    });
  }

  /**
   * @method post
   * @description Used for `post` http requests
   *
   * @param url `string`
   * @param data D - The post data type
   * @param config `AxiosRequestConfig<T>`
   * T is the expected response type
   *
   * @returns `Observable<AxiosResponse<T>>`
   */
  public post<T = any, D = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Observable<AxiosResponse<T>> {
    return this.request<T, D>({
      ...config,
      url,
      data,
      method: 'post',
    });
  }

  /**
   * @method put
   * @description Used for `put` http requests
   *
   * @param url `string`
   * @param data D - The put data type
   * @param config `AxiosRequestConfig<T>`
   * T is the expected response type
   *
   * @returns `Observable<AxiosResponse<T>>`
   */
  public put<T = any, D = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Observable<AxiosResponse<T>> {
    return this.request<T, D>({
      ...config,
      url,
      data,
      method: 'put',
    });
  }

  /**
   * @method patch
   * @description Used for `patch` http requests
   *
   * @param url `string`
   * @param data D - The patch data type
   * @param config `AxiosRequestConfig<T>`
   * T is the expected response type
   *
   * @returns `Observable<AxiosResponse<T>>`
   */
  public patch<T = any, D = any>(
    url: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Observable<AxiosResponse<T>> {
    return this.request<T, D>({
      ...config,
      url,
      data,
      method: 'patch',
    });
  }

  /**
   * @method createResponse
   * @private
   *
   * @param data The unparsed data
   * @param config AxiosRequestConfig<T>
   * @returns AxiosResponse<T> - an object formatted as an axios response containing the requested data
   */
  private createResponse<T>(data: any, config: AxiosRequestConfig): AxiosResponse<T> {
    try {
      const parsedData: T = JSON.parse(data as any);
      let processedData: any;

      if (!this.sortFilterConfig.filterKeys.length && !this.sortFilterConfig.sortKey) {
        //* if sort and filter have not been configured, we want to just return the data as is
        processedData = parsedData;
      } else {
        /**
         * this assumes that parsedData will either be just an array
         * or it will be an object that includes a list of items in a wrapper of the following shape:
            interface IListWrapperAPI<T> {
              items_requested: number;
              items_returned: number;
              items_total: number;
              offset: number;
              items: T[];
            }
         * if it is something other than those, we are just setting it to an empty array for now
         * this will need to be refactored as other data shapes are encountered
         */

        const isParsedDataArray = Array.isArray(parsedData);
        const items = isParsedDataArray
          ? parsedData
          : (parsedData as any).items
          ? (parsedData as any).items
          : [];

        const filters = pick(config.params, this.sortFilterConfig.filterKeys);

        const filteredItems =
          items.length && !isEmpty(filters)
            ? items.filter(item =>
                //* this will do a case insensitive 'contains' filtering on the list of items
                //* and does not currently support exact match
                //* the filtered list will include any item that contains the filter value in at least one of the filterKeys
                Object.keys(filters).some(filterKey =>
                  item[filterKey].toLowerCase().includes(filters[filterKey].toLowerCase())
                )
              )
            : cloneDeep(items);

        if (
          filteredItems.length &&
          this.sortFilterConfig.sortKey &&
          config.params?.[this.sortFilterConfig.sortKey]
        ) {
          const sortVal = config.params[this.sortFilterConfig.sortKey];
          const ascendingSort = sortVal.includes(this.sortFilterConfig.sortDirectionKey.ascending);
          const sortProp = sortVal.replace(
            ascendingSort
              ? this.sortFilterConfig.sortDirectionKey.ascending
              : this.sortFilterConfig.sortDirectionKey.descending,
            ''
          );

          filteredItems.sort((a, b) => {
            if (ascendingSort) {
              return a[sortProp] > b[sortProp] ? 1 : -1;
            }
            return a[sortProp] < b[sortProp] ? 1 : -1;
          });
        }

        processedData = isParsedDataArray
          ? filteredItems
          : {
              ...parsedData,
              items: filteredItems,
            };
      }

      return {
        config,
        data: processedData,
        status: HttpStatus.OK,
        statusText: `Mock data file: ${config.url}`,
        headers: {},
      };
    } catch (err) {
      return {
        config,
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        statusText: `Error parsing mock data file: ${config.url}`,
        headers: {},
      };
    }
  }
}
