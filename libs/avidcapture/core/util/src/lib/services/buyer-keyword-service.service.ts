import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  Buyer,
  BuyerKeywordServiceApiUrls,
  Environment,
  RejectToSenderPayload,
  RejectToSenderTemplate,
  SearchBodyRequest,
} from '@ui-coe/avidcapture/shared/types';
import { Observable } from 'rxjs';

import { BaseAPIService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class BuyerKeywordService extends BaseAPIService {
  constructor(protected http: HttpClient, @Inject('environment') private environment: Environment) {
    super(http);
  }

  postRejectToSender(payload: RejectToSenderPayload): Observable<void> {
    return this.post<void>(
      `${this.environment.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER}`,
      payload
    );
  }

  postRejectToSenderTemplates(buyerId: number): Observable<RejectToSenderTemplate[]> {
    return this.post<RejectToSenderTemplate[]>(
      this.parseUrlParams(
        `${this.environment.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER_TEMPLATES}`,
        {
          buyerId,
        }
      ),
      null
    );
  }

  postRejectToSenderCreate(payload: RejectToSenderTemplate): Observable<number> {
    return this.post<number>(
      `${this.environment.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER_CREATE}`,
      payload
    );
  }

  postRejectToSenderEdit(payload: RejectToSenderTemplate): Observable<void> {
    return this.post<void>(
      `${this.environment.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER_EDIT}`,
      payload
    );
  }

  postRejectToSenderDelete(templateId: string): Observable<void> {
    return this.post<void>(
      this.parseUrlParams(
        `${this.environment.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER_DELETE}`,
        {
          templateId,
        }
      ),
      null
    );
  }

  postAggregateSearch(bodyRequest: SearchBodyRequest): Observable<Buyer[]> {
    return this.post<any[]>(
      `${this.environment.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_SEARCH}/${BuyerKeywordServiceApiUrls.POST_AGGREGATE}`,
      bodyRequest
    );
  }
}
