import { Injectable } from '@angular/core';

import {
  SearchBodyApplyField,
  SearchBodyRequest,
  SearchBodyResultFilter,
  SearchFilters,
} from '../../shared/interfaces';

interface GetSearchRequest {
  sourceId: string;
  filters?: SearchFilters;
  sortField?: string;
  sortDirection?: string;
  page?: string;
  groupBy?: string[];
  pageSize?: string;
  applyFields?: SearchBodyApplyField[];
  resultFilters?: SearchBodyResultFilter[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchHelperService {
  getSearchRequestBody(request: GetSearchRequest): SearchBodyRequest {
    const searchRequest: SearchBodyRequest = {
      Controls: {
        SourceId: request.sourceId,
      },
    };

    if (request.filters && Object.keys(request.filters).length > 0) {
      searchRequest.Filters = request.filters;
    }

    if (!request.page && !request.pageSize) {
      searchRequest.Controls.SearchAllPages = true;
    } else {
      searchRequest.Controls.Page = request.page;
      searchRequest.Controls.PageSize = request.pageSize;
    }

    if (request.groupBy) {
      searchRequest.GroupBy = request.groupBy;
    }

    if (request.applyFields) {
      searchRequest.ApplyFields = request.applyFields;
    }

    if (request.resultFilters) {
      searchRequest.ResultFilters = request.resultFilters;
    }

    if (request.sortField) {
      searchRequest.SortField = request.sortField;
    }

    if (request.sortDirection) {
      searchRequest.SortDirection = request.sortDirection;
    }

    return searchRequest;
  }
}
