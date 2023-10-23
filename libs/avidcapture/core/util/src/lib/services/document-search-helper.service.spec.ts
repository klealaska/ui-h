import { TestBed } from '@angular/core/testing';
import {
  getAggregateBodyRequest,
  getContainsAggregateBodyRequest,
  getSearchBodyRequest,
} from '@ui-coe/avidcapture/shared/test';
import {
  EscalationCategoryTypes,
  SearchAlias,
  SearchApplyFunction,
  SearchContext,
  SearchReduceFunction,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';

import { DocumentSearchHelperService } from './document-search-helper.service';

describe('DocumentSearchHelperService', () => {
  let service: DocumentSearchHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentSearchHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSearchRequestBody()', () => {
    describe('when all properties are NOT NULL', () => {
      it('should return a proper search request body', () => {
        const filters = { buyerId: '25' } as any;
        const expectedValue = getSearchBodyRequest({ buyerId: '25' } as any);

        expect(
          service.getSearchRequestBody({
            sourceId: SearchContext.AvidSuite,
            filters,
            page: 1,
            pageSize: 30,
            sortField: 'dateReceived',
            sortDirection: SortDirection.Ascending,
          })
        ).toEqual(expectedValue);
      });
    });

    describe('when all properties are NULL', () => {
      it('should return a proper search request body', () => {
        const expectedValue = getSearchBodyRequest(null);
        delete expectedValue.Filters;
        delete expectedValue.SortDirection;
        delete expectedValue.SortField;
        delete expectedValue.Controls.Page;
        delete expectedValue.Controls.PageSize;
        expectedValue.Controls.SearchAllPages = true;

        expect(
          service.getSearchRequestBody({
            sourceId: SearchContext.AvidSuite,
          })
        ).toEqual(expectedValue);
      });
    });
  });

  describe('getAggregateRequestBody()', () => {
    describe('when filters & sortBy are not NULL', () => {
      it('should return a proper aggregate request body', () => {
        const filters = { buyerId: '25' } as any;
        const expectedValue = getAggregateBodyRequest({ buyerId: '25' } as any);
        delete expectedValue.Fields;

        expect(
          service.getAggregateRequestBody({
            sourceId: SearchContext.AvidSuite,
            filters,
            page: 1,
            pageSize: 30,
            sortBy: {},
          })
        ).toEqual(expectedValue);
      });
    });

    describe('when sortBy and filters is NULL', () => {
      it('should return a proper aggregate request body', () => {
        const expectedValue = getAggregateBodyRequest(null);
        delete expectedValue.Filters;
        delete expectedValue.SortBy;
        delete expectedValue.Fields;

        expect(
          service.getAggregateRequestBody({
            sourceId: SearchContext.AvidSuite,
            page: 1,
            pageSize: 30,
          })
        ).toEqual(expectedValue);
      });
    });

    describe('when fields is NOT NULL', () => {
      it('should return a proper aggregate request body', () => {
        const expectedValue = getAggregateBodyRequest(null);
        delete expectedValue.Filters;
        delete expectedValue.SortBy;

        expect(
          service.getAggregateRequestBody({
            sourceId: SearchContext.AvidSuite,
            page: 1,
            pageSize: 30,
            fields: [],
          })
        ).toEqual(expectedValue);
      });
    });
  });

  describe('getContainsAggregateRequest()', () => {
    it('should return a proper contains aggregate request body', () => {
      const filters = { buyerId: '25' } as any;
      const expectedValue = getContainsAggregateBodyRequest(filters);

      expect(
        service.getContainsAggregateRequest(SearchContext.AvidSuite, filters, 'buyerName', 'av', [
          'buyerName',
          'buyerId',
        ])
      ).toEqual(expectedValue);
    });
  });

  describe('getMultipleContainsAggregateRequest()', () => {
    it('should return a proper contains aggregate request body', () => {
      const filters = { buyerId: '25' } as any;
      const expectedValue = getContainsAggregateBodyRequest(filters);
      delete expectedValue.ReduceFields;

      expect(
        service.getMultipleContainsAggregateRequest(
          SearchContext.AvidSuite,
          filters,
          [
            {
              ParameterName: 'buyerName',
              ParameterValue: 'av',
              Function: SearchApplyFunction.Contains,
              Alias: 'buyer',
            },
          ],
          [
            {
              ParameterName: 'buyer',
              ParameterValue: '1',
              Operation: '==',
              Chain: null,
            },
          ],
          ['buyerName', 'buyerId']
        )
      ).toEqual(expect.objectContaining(expectedValue));
    });
  });

  describe('getCountAggregateRequest()', () => {
    it('should return a proper document count aggregate request body', () => {
      const filters = {
        buyerId: ['25'],
        escalationCategoryIssue: [EscalationCategoryTypes.None],
        isSubmitted: [0],
      } as any;

      expect(service.getCountAggregateRequest(SearchContext.AvidSuite, filters)).toEqual({
        Controls: { SearchAllPages: true, SourceId: SearchContext.AvidSuite },
        Filters: {
          buyerId: ['25'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          isSubmitted: [0],
        },
        GroupBy: ['isSubmitted'],
        ReduceFields: [{ Alias: SearchAlias.Count, Function: SearchReduceFunction.Count }],
      });
    });

    it('should return a proper escalation count aggregate request body', () => {
      const filters = {
        buyerId: ['25'],
        escalationCategoryIssue: [`-${EscalationCategoryTypes.None}`],
        isSubmitted: [0],
      } as any;

      expect(service.getCountAggregateRequest(SearchContext.AvidSuite, filters)).toEqual({
        Controls: { SearchAllPages: true, SourceId: SearchContext.AvidSuite },
        Filters: {
          buyerId: ['25'],
          escalationCategoryIssue: [`-${EscalationCategoryTypes.None}`],
          isSubmitted: [0],
        },
        GroupBy: ['isSubmitted'],
        ReduceFields: [{ Alias: SearchAlias.Count, Function: SearchReduceFunction.Count }],
      });
    });
  });

  describe('getCountAggregateWithAliasRequest()', () => {
    it('should return a proper document count aggregate request body', () => {
      const filters = {
        buyerId: ['25'],
        escalationCategoryIssue: [EscalationCategoryTypes.None],
        isSubmitted: [0],
      } as any;

      expect(
        service.getCountAggregateWithAliasRequest(SearchContext.AvidSuite, filters, 'mock')
      ).toEqual({
        Controls: { SearchAllPages: true, SourceId: SearchContext.AvidSuite },
        Filters: {
          buyerId: ['25'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          isSubmitted: [0],
        },
        GroupBy: ['isSubmitted'],
        ReduceFields: [{ Alias: 'mock', Function: SearchReduceFunction.Count }],
      });
    });

    it('should return a proper escalation count aggregate request body', () => {
      const filters = {
        buyerId: ['25'],
        escalationCategoryIssue: [`-${EscalationCategoryTypes.None}`],
        isSubmitted: [0],
      } as any;

      expect(
        service.getCountAggregateWithAliasRequest(SearchContext.AvidSuite, filters, 'mock')
      ).toEqual({
        Controls: { SearchAllPages: true, SourceId: SearchContext.AvidSuite },
        Filters: {
          buyerId: ['25'],
          escalationCategoryIssue: [`-${EscalationCategoryTypes.None}`],
          isSubmitted: [0],
        },
        GroupBy: ['isSubmitted'],
        ReduceFields: [{ Alias: 'mock', Function: SearchReduceFunction.Count }],
      });
    });
  });
});
