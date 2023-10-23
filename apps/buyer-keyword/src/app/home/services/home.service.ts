import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BaseHttpService } from '../../core/services/base-http.service';
import { AppsUrls, BkwsUrls } from '../../shared/enums';
import {
  Buyer,
  BuyerPayload,
  MassVoidBodyRequest,
  SearchBodyRequest,
} from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class HomeService extends BaseHttpService {
  constructor(public http: HttpClient) {
    super(http);
  }

  getBuyers(body: SearchBodyRequest): Observable<Buyer[]> {
    return this.post<Buyer[]>(
      `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.POST_SEARCH}`,
      body
    ).pipe(
      catchError(err => {
        throw err;
      })
    );
  }

  updateBuyer(values: BuyerPayload): Observable<void> {
    return this.post<void>(
      `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.UPDATE_BUYERS}`,
      values
    ).pipe(
      catchError(err => {
        throw err;
      })
    );
  }

  getAggregateSearch(body: SearchBodyRequest): Observable<Buyer[]> {
    return this.post<Buyer[]>(
      `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.POST_SEARCH}${BkwsUrls.POST_AGGREGATE}`,
      body
    ).pipe(
      catchError(err => {
        throw err;
      })
    );
  }

  massVoid(body: MassVoidBodyRequest): Observable<void> {
    return this.post<void>(
      `${environment.apiBaseUri}${AppsUrls.AVID_CAPTURE}${BkwsUrls.MASS_VOID}`,
      body
    ).pipe(
      catchError(err => {
        throw err;
      })
    );
  }
}
