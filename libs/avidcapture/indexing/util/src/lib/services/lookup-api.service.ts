import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseAPIService } from '@ui-coe/avidcapture/core/util';
import {
  Environment,
  LookupApiUrls,
  LookupBodyRequest,
  LookupCustomerAccountResponse,
  LookupOrderedByResponse,
  LookupPaymentTerms,
  LookupPropertyResponse,
  LookupSupplier,
  LookupSupplierResponse,
  LookupWorkflowResponse,
} from '@ui-coe/avidcapture/shared/types';
import { Observable, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LookupApiService extends BaseAPIService {
  constructor(protected http: HttpClient, @Inject('environment') private environment: Environment) {
    super(http);
  }

  getSuppliers(
    avidBillProxyV2SupplierIsActive$: Observable<boolean>,
    supplierBodyRequest: LookupBodyRequest,
    searchText: string,
    buyerId: number,
    accountingSystemID?: number
  ): Observable<LookupSupplierResponse> {
    return avidBillProxyV2SupplierIsActive$.pipe(
      mergeMap(isActive =>
        isActive
          ? this.post<LookupSupplierResponse>(
              `${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_SUPPLIERS_V2}`,
              supplierBodyRequest
            )
          : this.get<LookupSupplierResponse>(
              this.parseUrlParams(
                `${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_SUPPLIERS}`,
                {
                  searchText: encodeURIComponent(searchText),
                  buyerId,
                  accountingSystemID: accountingSystemID || '',
                }
              )
            )
      )
    );
  }

  getSupplier(registrationCode: string): Observable<LookupSupplier> {
    return this.get<LookupSupplier>(
      this.parseUrlParams(`${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_SUPPLIER}`, {
        registrationCode,
      })
    );
  }

  getProperties(
    avidBillProxyV2PropertyIsActive$: Observable<boolean>,
    propertyBodyRequest: LookupBodyRequest,
    searchText: string,
    buyerId: number,
    accountingSystemID?: number
  ): Observable<LookupPropertyResponse> {
    return avidBillProxyV2PropertyIsActive$.pipe(
      mergeMap(isActive =>
        isActive
          ? this.post<LookupPropertyResponse>(
              `${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_PROPERTIES_V2}`,
              propertyBodyRequest
            )
          : this.get<LookupPropertyResponse>(
              this.parseUrlParams(
                `${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_PROPERTIES}`,
                {
                  searchText: encodeURIComponent(searchText),
                  buyerId,
                  accountingSystemID: accountingSystemID || '',
                }
              )
            )
      )
    );
  }

  getCustomerAccounts(
    searchText: string,
    supplierId: number,
    exactMatch = false
  ): Observable<LookupCustomerAccountResponse> {
    return this.get<LookupCustomerAccountResponse>(
      this.parseUrlParams(
        `${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_CUSTOMERACCOUNTS}`,
        {
          searchText: encodeURIComponent(searchText),
          supplierId,
          exactMatch,
        }
      )
    );
  }

  getUsers(searchText: string, buyerId: number): Observable<LookupOrderedByResponse> {
    return this.get<LookupOrderedByResponse>(
      this.parseUrlParams(`${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_ORDEREDBY}`, {
        searchText: encodeURIComponent(searchText),
        buyerId,
      })
    );
  }

  getWorkflow(searchText: string, buyerId: number): Observable<LookupWorkflowResponse> {
    return this.get<LookupWorkflowResponse>(
      this.parseUrlParams(`${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_WORKFLOW}`, {
        searchText: encodeURIComponent(searchText),
        buyerId,
      })
    );
  }

  getPaymentTerms(): Observable<LookupPaymentTerms[]> {
    return this.get<LookupPaymentTerms[]>(
      `${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_PAYMENTTERMS}`
    );
  }

  getMaxInvoiceNumberLength(supplierId: string): Observable<number> {
    return this.get<number>(
      this.parseUrlParams(
        `${this.environment.lookupApiBaseUri}${LookupApiUrls.GET_MAX_INVOICE_NUMBER_LENGTH}`,
        { supplierId }
      )
    );
  }
}
