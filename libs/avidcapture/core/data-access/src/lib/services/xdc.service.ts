import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment, XdcApiUrls } from '@ui-coe/avidcapture/shared/types';
import {
  AggregateBodyRequest,
  CompositeDocument,
  Document,
  DocumentReduce,
  IndexedData,
  IndexingUnitData,
  SearchBodyRequest,
} from '@ui-coe/avidcapture/shared/types';
import { User } from '@ui-coe/shared/ui';
import { Observable } from 'rxjs';

import { BaseAPIService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class XdcService extends BaseAPIService {
  constructor(protected http: HttpClient, @Inject('environment') private environment: Environment) {
    super(http);
  }

  // ARCHIVE
  getArchivedDocument(documentId: string): Observable<CompositeDocument> {
    return this.get<CompositeDocument>(
      this.parseUrlParams(`${this.environment.apiBaseUri}${XdcApiUrls.GET_ARCHIVED_DOCUMENT}`, {
        documentId,
      })
    );
  }

  // LOCK
  unlockDocument(documentId: string): Observable<void> {
    return this.delete<void>(
      this.parseUrlParams(`${this.environment.apiBaseUri}${XdcApiUrls.LOCK}`, { documentId })
    );
  }

  lockDocument(documentId: string): Observable<void> {
    return this.put<void>(
      this.parseUrlParams(`${this.environment.apiBaseUri}${XdcApiUrls.LOCK}`, { documentId }),
      {}
    );
  }

  // INDEXED
  putIndexed(indexed: IndexedData): Observable<IndexedData> {
    return this.put<IndexedData>(
      `${this.environment.apiBaseUri}${XdcApiUrls.PUT_INDEXED}`,
      indexed
    );
  }

  putIndexedSubmit(indexed: IndexedData): Observable<void> {
    return this.put<void>(
      `${this.environment.apiBaseUri}${XdcApiUrls.PUT_INDEXED_SUBMIT}`,
      indexed
    );
  }

  // ESCALATION
  putEscalation(indexed: IndexedData): Observable<void> {
    return this.put<void>(`${this.environment.apiBaseUri}${XdcApiUrls.PUT_ESCALATION}`, indexed);
  }

  // INDEXINGUNIT
  postIndexingUnit(indexingUnitData: IndexingUnitData): Observable<void> {
    return this.post<void>(
      `${this.environment.apiBaseUri}${XdcApiUrls.POST_INDEXINGUNIT}`,
      indexingUnitData
    );
  }

  getUnindexedDocument(documentId: string, userId: string): Observable<CompositeDocument> {
    return this.get<CompositeDocument>(
      this.parseUrlParams(`${this.environment.apiBaseUri}${XdcApiUrls.GET_UNINDEXED_DOCUMENT}`, {
        documentId,
        userId,
      })
    );
  }

  getNextUnindexedDocument(
    userId: string,
    documentBodyRequest: AggregateBodyRequest
  ): Observable<CompositeDocument> {
    return this.post<CompositeDocument>(
      this.parseUrlParams(`${this.environment.apiBaseUri}${XdcApiUrls.GET_NEXT_DOCUMENT}`, {
        userId,
      }),
      documentBodyRequest
    );
  }

  getFile(documentId: string): Observable<Blob> {
    return this.getFileBlob(
      this.parseUrlParams(`${this.environment.apiBaseUri}${XdcApiUrls.GET_FILE}`, {
        documentId,
      })
    );
  }

  // SEARCH
  postAggregateSearch(body: AggregateBodyRequest): Observable<Document[] | DocumentReduce[]> {
    return this.post<Document[] | DocumentReduce[]>(
      `${this.environment.apiBaseUri}${XdcApiUrls.POST_AGGREGATE}`,
      body
    );
  }

  postAggregateBulkSearch(body: AggregateBodyRequest[]): Observable<Document[] | DocumentReduce[]> {
    return this.post<Document[] | DocumentReduce[]>(
      `${this.environment.apiBaseUri}${XdcApiUrls.POST_BULK_AGGREGATE}`,
      body
    );
  }

  postSearch(body: SearchBodyRequest): Observable<Document[]> {
    return this.post<Document[] | DocumentReduce[]>(
      `${this.environment.apiBaseUri}${XdcApiUrls.POST_SEARCH}`,
      body
    );
  }

  //ADMIN
  getUsers(pageNumber: number = 0): Observable<User[]> {
    return this.get<User[]>(
      this.parseUrlParams(`${this.environment.apiBaseUri}${XdcApiUrls.GET_ADMIN_USERS}`, {
        pageNumber,
      })
    );
  }
}
