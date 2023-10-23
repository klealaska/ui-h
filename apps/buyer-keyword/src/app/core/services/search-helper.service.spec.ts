import { TestBed } from '@angular/core/testing';

import { getSearchBodyRequest } from '../../../testing/test-stubs';
import { SearchContext } from '../../shared/enums';
import { SearchHelperService } from './search-helper.service';

describe('SearchHelperService', () => {
  let service: SearchHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSearchRequestBody()', () => {
    describe('when all properties are NOT NULL', () => {
      it('should return a proper search request body', () => {
        const filters = { sourceSystemBuyerId: ['25'] } as any;
        let expectedValue = getSearchBodyRequest({ sourceSystemBuyerId: ['25'] } as any);
        expectedValue = {
          ...expectedValue,
          ApplyFields: [],
          GroupBy: [],
          ResultFilters: [],
          SortField: 'buyerName',
          SortDirection: 'asc',
        };
        expect(
          service.getSearchRequestBody({
            sourceId: SearchContext.AvidSuite,
            filters,
            page: '1',
            pageSize: '30',
            groupBy: [],
            applyFields: [],
            resultFilters: [],
            sortField: 'buyerName',
            sortDirection: 'asc',
          })
        ).toEqual(expectedValue);
      });
    });

    describe('when all properties are NULL', () => {
      it('should return a proper search request body', () => {
        const expectedValue = getSearchBodyRequest(null);
        delete expectedValue.Filters;
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
});
