import { Injectable } from '@angular/core';
import {
  AdvancedFilter,
  AggregateBodyRequest,
  SearchAlias,
  SearchApplyFunction,
  SearchBodyApplyField,
  SearchBodyReduce,
  SearchBodyRequest,
  SearchBodyResultFilter,
  SearchReduceFunction,
  SortDirection,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';

interface GetSearchRequest {
  sourceId: string;
  filters?: AdvancedFilter;
  sortField?: string;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
}

interface GetAggregateRequest {
  sourceId: string;
  fields?: string[];
  sortBy?: SortedColumnData;
  filters?: AdvancedFilter;
  page?: number;
  pageSize?: number;
  groupBy?: string[];
  applyFields?: SearchBodyApplyField[];
  reduceFields?: SearchBodyReduce[];
  resultFilters?: SearchBodyResultFilter[];
}

@Injectable({
  providedIn: 'root',
})
export class DocumentSearchHelperService {
  getSearchRequestBody(request: GetSearchRequest): SearchBodyRequest {
    const searchRequest: SearchBodyRequest = {
      Controls: {
        SourceId: request.sourceId,
      },
    };

    if (request.filters && Object.keys(request.filters).length > 0) {
      searchRequest.Filters = request.filters;
    }

    if (request.sortField) {
      searchRequest.SortField = request.sortField;
    }

    if (request.sortDirection) {
      searchRequest.SortDirection = request.sortDirection;
    }

    if (!request.page && !request.pageSize) {
      searchRequest.Controls.SearchAllPages = true;
    } else {
      searchRequest.Controls.Page = request.page;
      searchRequest.Controls.PageSize = request.pageSize;
    }

    return searchRequest;
  }

  getAggregateRequestBody(request: GetAggregateRequest): AggregateBodyRequest {
    const searchRequest: AggregateBodyRequest = {
      Controls: {
        SourceId: request.sourceId,
      },
    };

    if (request.fields) {
      searchRequest.Fields = request.fields;
    }

    if (request.filters && Object.keys(request.filters).length > 0) {
      searchRequest.Filters = request.filters;
    }

    if (request.sortBy) {
      searchRequest.SortBy = request.sortBy;
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

    if (request.reduceFields) {
      searchRequest.ReduceFields = request.reduceFields;
    }

    if (request.resultFilters) {
      searchRequest.ResultFilters = request.resultFilters;
    }

    return searchRequest;
  }

  getContainsAggregateRequest(
    sourceId: string,
    filters: AdvancedFilter,
    searchField: string,
    searchValue: string,
    fieldsToReturn: string[]
  ): AggregateBodyRequest {
    return this.getAggregateRequestBody({
      sourceId,
      filters,
      applyFields: [
        {
          ParameterName: searchField,
          ParameterValue: searchValue,
          Function: SearchApplyFunction.Contains,
          Alias: 'buyer',
        },
      ],
      resultFilters: [
        {
          ParameterName: 'buyer',
          ParameterValue: '1',
          Operation: '==',
          Chain: null,
        },
      ],
      groupBy: fieldsToReturn,
      reduceFields: [
        {
          Function: SearchReduceFunction.Count,
          Alias: 'Count',
        },
      ],
    });
  }

  getMultipleContainsAggregateRequest(
    sourceId: string,
    filters: AdvancedFilter,
    applyFields: SearchBodyApplyField[],
    resultFilters: SearchBodyResultFilter[],
    fieldsToReturn: string[]
  ): AggregateBodyRequest {
    return this.getAggregateRequestBody({
      sourceId,
      filters,
      applyFields,
      resultFilters,
      groupBy: fieldsToReturn,
    });
  }

  getCountAggregateRequest(contextName: string, filters: AdvancedFilter): AggregateBodyRequest {
    return this.getAggregateRequestBody({
      groupBy: ['isSubmitted'],
      filters,
      sourceId: contextName,
      reduceFields: [{ Function: SearchReduceFunction.Count, Alias: SearchAlias.Count }],
    });
  }

  getCountAggregateWithAliasRequest(
    contextName: string,
    filters: AdvancedFilter,
    alias: string
  ): AggregateBodyRequest {
    return this.getAggregateRequestBody({
      groupBy: ['isSubmitted'],
      filters,
      sourceId: contextName,
      reduceFields: [{ Function: SearchReduceFunction.Count, Alias: alias }],
    });
  }
}
