import { FormBuilder } from '@angular/forms';

import { SearchContext } from '../app/shared/enums';
import { Buyer, BuyerPayload, SearchBodyRequest, SearchFilters } from '../app/shared/interfaces';

export function getBuyersStub(): Buyer[] {
  return [
    {
      sourceSystemBuyerId: '25',
      buyerName: 'AvidXchange, Inc.',
      buyerKeyword: 'avid',
      portalStatus: 'Active',
      bounceBackMessage: 'This is a bounceback message.',
      forwardingEmailAddress: 'example@avidxchange.com',
      sourceSystemId: 'Invoice',
      indexingSolutionId: '1',
      displayPredictedValues: '0',
      buyerKeywordId: '264',
      ingestionMethodId: '1',
      displayIdentifierSearchValues: '0',
    },
    {
      sourceSystemBuyerId: '1000',
      buyerName: 'ABN Staffing',
      buyerKeyword: 'abn',
      portalStatus: 'Inactive',
      bounceBackMessage: 'This is a bounceback message.',
      forwardingEmailAddress: 'example@avidxchange.com',
      sourceSystemId: 'Utility',
      indexingSolutionId: '2',
      displayPredictedValues: '1',
      buyerKeywordId: '263',
      displayIdentifierSearchValues: '1',
    },
  ];
}

export function getBuyerPayloadStub(): BuyerPayload {
  return {
    sourceSystemBuyerId: '25',
    indexingSolutionId: '1',
    portalStatus: 'Active',
    forwardingEmailAddress: 'example@avidxchange.com',
    bounceBackMessage: 'mock',
    displayPredictedValues: '1',
    buyerKeyword: 'mock',
    sourceSystemId: 'AIB',
    ingestionMethodId: '1',
    displayIdentifierSearchValues: '1',
  };
}

export function getBuyerFormStub(): any {
  return {
    sourceSystemBuyerId: '25',
    indexingSolutionId: '1',
    portalStatus: true,
    forwardingEmailAddress: 'example@avidxchange.com',
    bounceBackMessage: 'mock',
    displayPredictedValues: true,
    buyerKeyword: 'mock',
    sourceSystemId: 'AIB',
    ingestionMethodId: '1',
    displayIdentifierSearchValues: true,
  };
}

export function getSearchBodyRequest(filters: SearchFilters): SearchBodyRequest {
  return {
    Controls: {
      Page: '1',
      PageSize: '30',
      SourceId: SearchContext.AvidSuite,
    },
    Filters: filters,
  };
}

const formBuilder: FormBuilder = new FormBuilder();
export const formGroupInstanceStub = formBuilder.group({
  searchBuyer: 'mock',
});

export const formGroupInstanceHomeStub = formBuilder.group({
  sourceSystemBuyerId: '',
  indexingSolutionId: '',
  portalStatus: '',
  forwardingEmailAddress: '',
  bounceBackMessage: '',
  displayPredictedValues: '',
  buyerKeyword: '',
  buyerKeywordId: '',
  sourceSystemId: '',
  ingestionMethodId: '',
  displayIdentifierSearchValues: '',
});

export const massVoidPayload = {
  sourceSystemBuyerId: '',
  portalStatus: '',
  bounceBackMessage: '',
  forwardingEmailAddress: '',
  indexingSolutionId: '',
  displayPredictedValues: '',
  sourceSystemId: '',
  ingestionMethodId: '',
  buyerKeyword: '',
  displayIdentifierSearchValues: '',
};
