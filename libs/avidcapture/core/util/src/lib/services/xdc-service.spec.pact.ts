import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Matchers } from '@pact-foundation/pact';
import {
  getAggregateBodyRequest,
  getArchivedDocumentsStub,
  getCompositeDataStub,
  getDocuments,
  getPactConfig,
  getRecycledDocuments,
  getResearchDocuments,
  getSearchBodyRequest,
} from '@ui-coe/avidcapture/shared/test';
import {
  CompositeDocument,
  Document,
  EscalationCategoryTypes,
  Headers,
  XdcApiUrls,
} from '@ui-coe/avidcapture/shared/types';
import { pactWith } from 'jest-pact';

import { XdcService } from './xdc.service';

const environmentStub = {
  apiBaseUri: '',
};

pactWith(getPactConfig('idc-api'), provider => {
  describe('Xdc Service Pact', () => {
    let xdcService: XdcService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [
          XdcService,
          {
            provide: 'environment',
            useValue: environmentStub,
          },
        ],
      });

      xdcService = TestBed.inject(XdcService);
      environmentStub.apiBaseUri = `${provider.mockService.baseUrl}/`;
    });

    describe('postSearch()', () => {
      describe('Pending documents', () => {
        const pendingDocuments: Document[] = getDocuments();
        const searchBodyRequestStub = getSearchBodyRequest({
          buyerId: ['25'] as any,
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          isSubmitted: [0],
        });

        beforeEach(async () => {
          await provider.addInteraction({
            uponReceiving: 'a request to POST a search for pending documents',
            state: 'pending documents exist',
            withRequest: {
              method: 'POST',
              path: `/${XdcApiUrls.POST_SEARCH}`,
              headers: {
                [Headers.ContentType]: Headers.appJson,
              },
              body: searchBodyRequestStub,
            },
            willRespondWith: {
              status: 200,
              body: Matchers.like(pendingDocuments),
            },
          });
        });

        it('should get a list of pending documents via postSearch', done => {
          xdcService.postSearch(searchBodyRequestStub).subscribe(res => {
            expect(res).toEqual(pendingDocuments);
            done();
          });
        });
      });

      describe('Research documents', () => {
        const researchDocuments: Document[] = getResearchDocuments();
        const searchBodyRequestStub = getSearchBodyRequest({
          buyerId: ['25'] as any,
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.None}`,
          ],
          isSubmitted: [0],
        });

        beforeEach(async () => {
          await provider.addInteraction({
            uponReceiving: 'a request to POST a search for research documents',
            state: 'research documents exist',
            withRequest: {
              method: 'POST',
              path: `/${XdcApiUrls.POST_SEARCH}`,
              headers: {
                [Headers.ContentType]: Headers.appJson,
              },
              body: searchBodyRequestStub,
            },
            willRespondWith: {
              status: 200,
              body: Matchers.like(researchDocuments),
            },
          });
        });

        it('should get a list of research documents via postSearch', done => {
          xdcService.postSearch(searchBodyRequestStub).subscribe(res => {
            expect(res).toEqual(researchDocuments);
            done();
          });
        });
      });

      describe('Archived documents', () => {
        const archivedDocuments: Document[] = getArchivedDocumentsStub();
        const searchBodyRequestStub = getSearchBodyRequest({
          buyerId: ['25'] as any,
          isSubmitted: [1],
        });

        beforeEach(async () => {
          await provider.addInteraction({
            uponReceiving: 'a request to POST a search for archived documents',
            state: 'archived documents exist',
            withRequest: {
              method: 'POST',
              path: `/${XdcApiUrls.POST_SEARCH}`,
              headers: {
                [Headers.ContentType]: Headers.appJson,
              },
              body: searchBodyRequestStub,
            },
            willRespondWith: {
              status: 200,
              body: Matchers.like(archivedDocuments),
            },
          });
        });

        it('should get a list of archived documents via postSearch', done => {
          xdcService.postSearch(searchBodyRequestStub).subscribe(res => {
            expect(res).toEqual(archivedDocuments);
            done();
          });
        });
      });

      describe('Recycled documents', () => {
        const recycledDocuments: Document[] = getRecycledDocuments();
        const searchBodyRequestStub = getSearchBodyRequest({
          buyerId: ['25'] as any,
          escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
          isSubmitted: [0],
        });

        beforeEach(async () => {
          await provider.addInteraction({
            uponReceiving: 'a request to POST a search for recycled documents',
            state: 'recycled documents exist',
            withRequest: {
              method: 'POST',
              path: `/${XdcApiUrls.POST_SEARCH}`,
              headers: {
                [Headers.ContentType]: Headers.appJson,
              },
              body: searchBodyRequestStub,
            },
            willRespondWith: {
              status: 200,
              body: Matchers.like(recycledDocuments),
            },
          });
        });

        it('should get a list of recycled documents via postSearch', done => {
          xdcService.postSearch(searchBodyRequestStub).subscribe(res => {
            expect(res).toEqual(recycledDocuments);
            done();
          });
        });
      });
    });

    describe('postAggregateSearch()', () => {
      describe('QueryDocumentCardSetCounts for Pending Queue', () => {
        const aggregateBodyRequestStub = {
          Controls: {
            SourceId: 'AvidSuite',
            SearchAllPages: true,
          },
          Filters: {
            buyerId: ['25', '2842741'] as any,
            escalationCategoryIssue: ['None'],
            isSubmitted: [0],
          },
          GroupBy: ['isSubmitted'],
          ReduceFields: [
            {
              Function: 'COUNT',
              Alias: 'count',
            },
          ],
        };
        const responseStub = [{ isSubmitted: '0', count: '49' }];

        beforeEach(async () => {
          await provider.addInteraction({
            uponReceiving:
              'a request to POST a search for document summary counts of the pending queue',
            state: 'when wanting to get a document summary count of the pending queue',
            withRequest: {
              method: 'POST',
              path: `/${XdcApiUrls.POST_AGGREGATE}`,
              headers: {
                [Headers.ContentType]: Headers.appJson,
              },
              body: aggregateBodyRequestStub,
            },
            willRespondWith: {
              status: 200,
              body: Matchers.like(responseStub),
            },
          });
        });

        it('should get a count of pending documents', done => {
          xdcService.postAggregateSearch(aggregateBodyRequestStub).subscribe(res => {
            expect(res).toEqual(responseStub);
            done();
          });
        });
      });

      describe('QueryDocumentCardSetCounts for Research Queue', () => {
        const aggregateBodyRequestStub = {
          Controls: {
            SourceId: 'AvidSuite',
            SearchAllPages: true,
          },
          Filters: {
            buyerId: ['25', '2842741'] as any,
            escalationCategoryIssue: ['-None', '-Recycle Bin'],
            isSubmitted: [0],
          },
          GroupBy: ['isSubmitted'],
          ReduceFields: [
            {
              Function: 'COUNT',
              Alias: 'count',
            },
          ],
        };
        const responseStub = [{ isSubmitted: '0', count: '109' }];

        beforeEach(async () => {
          await provider.addInteraction({
            uponReceiving:
              'a request to POST a search for document summary counts of the research queue',
            state: 'when wanting to get a document summary count of the research queue',
            withRequest: {
              method: 'POST',
              path: `/${XdcApiUrls.POST_AGGREGATE}`,
              headers: {
                [Headers.ContentType]: Headers.appJson,
              },
              body: aggregateBodyRequestStub,
            },
            willRespondWith: {
              status: 200,
              body: Matchers.like(responseStub),
            },
          });
        });

        it('should get a count of research documents', done => {
          xdcService.postAggregateSearch(aggregateBodyRequestStub).subscribe(res => {
            expect(res).toEqual(responseStub);
            done();
          });
        });
      });

      describe('QueryBuyerLookAhead', () => {
        const aggregateBodyRequestStub = {
          Controls: {
            SourceId: 'AvidSuite',
            SearchAllPages: true,
          },
          Filters: {
            buyerId: ['2842741', '25'] as any,
          },
          GroupBy: ['buyerName', 'buyerId'],
          ApplyFields: [
            {
              ParameterName: 'buyerName',
              ParameterValue: 'avid',
              Function: 'contains',
              Alias: 'buyer',
            },
          ],
          ReduceFields: [
            {
              Function: 'COUNT',
              Alias: 'Count',
            },
          ],
          ResultFilters: [
            {
              ParameterName: 'buyer',
              ParameterValue: '1',
              Operation: '==',
              Chain: null,
            },
          ],
        };
        const responseStub = [{ buyerName: 'avidxchange, inc', buyerId: '25', Count: '5208' }];

        beforeEach(async () => {
          await provider.addInteraction({
            uponReceiving: 'a request to POST a search for a buyer',
            state: 'when wanting to filter by a specific buyer',
            withRequest: {
              method: 'POST',
              path: `/${XdcApiUrls.POST_AGGREGATE}`,
              headers: {
                [Headers.ContentType]: Headers.appJson,
              },
              body: aggregateBodyRequestStub,
            },
            willRespondWith: {
              status: 200,
              body: Matchers.like(responseStub),
            },
          });
        });

        it('should get back buyer information', done => {
          xdcService.postAggregateSearch(aggregateBodyRequestStub).subscribe(res => {
            expect(res).toEqual(responseStub);
            done();
          });
        });
      });
    });

    describe('getArchivedDocument()', () => {
      const documentId = '1';
      const archivedDocument: CompositeDocument = getCompositeDataStub();

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to GET an archived document',
          state: 'when wanting to view an archived document',
          withRequest: {
            method: 'GET',
            path: `/api/unindexed/invoice/readonly/${documentId}`,
            headers: {
              [Headers.ContentType]: Headers.appJson,
            },
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(archivedDocument),
          },
        });
      });

      it('should get back an archived document', done => {
        xdcService.getArchivedDocument('1').subscribe(res => {
          expect(res).toEqual(archivedDocument);
          done();
        });
      });
    });

    describe('getUnindexedDocument()', () => {
      const documentId = '1';
      const userId = 'avidEmail@avidxchange.com';
      const unindexedDocument: CompositeDocument = getCompositeDataStub();

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to GET an unindexed document',
          state: 'when wanting to view an unindexed document',
          withRequest: {
            method: 'GET',
            path: `/api/unindexed/invoice/${documentId}/user/${userId}`,
            headers: {
              [Headers.ContentType]: Headers.appJson,
            },
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(unindexedDocument),
          },
        });
      });

      it('should get back an unindexed document', done => {
        xdcService.getUnindexedDocument(documentId, userId).subscribe(res => {
          expect(res).toEqual(unindexedDocument);
          done();
        });
      });
    });

    describe('getNextUnindexedDocument()', () => {
      const userId = 'avidEmail@avidxchange.com';
      const aggregateBodyRequestStub = getAggregateBodyRequest({
        buyerId: ['25'] as any,
        escalationCategoryIssue: [EscalationCategoryTypes.None],
        isSubmitted: [0],
      });
      const unindexedDocument: CompositeDocument = getCompositeDataStub();

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to POST for the next unindexed document available',
          state: 'when wanting to view the next unindexed document available',
          withRequest: {
            method: 'POST',
            path: `/api/search/document/next/${userId}`,
            headers: {
              [Headers.ContentType]: Headers.appJson,
            },
            body: aggregateBodyRequestStub,
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(unindexedDocument),
          },
        });
      });

      it('should get back the next unindexed document available', done => {
        xdcService.getNextUnindexedDocument(userId, aggregateBodyRequestStub).subscribe(res => {
          expect(res).toEqual(unindexedDocument);
          done();
        });
      });
    });

    describe('getFile()', () => {
      const documentId = '1';
      const blobStub = new Blob(['pact-test'], { type: Headers.appPdf });

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to GET pdf file',
          state: 'when wanting to get pdf file to index',
          withRequest: {
            method: 'GET',
            path: `/api/file/${documentId}`,
            headers: {
              Accept: Headers.appPdf,
              [Headers.ContentType]: Headers.appJson,
            },
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(blobStub),
          },
        });
      });

      it('should get back a pdf file to index', done => {
        xdcService.getFile(documentId).subscribe(res => {
          expect(res).toEqual(blobStub);
          done();
        });
      });
    });
  });
});
