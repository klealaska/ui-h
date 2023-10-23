import { Selector } from '@ngxs/store';
import { DocumentStateModel } from '@ui-coe/avidcapture/shared/data-access';
import {
  Document,
  SortedColumnData,
  UploadedDocumentMessage,
} from '@ui-coe/avidcapture/shared/types';

import { UploadsQueuePageState } from './uploads-queue-page.state';

export class UploadsQueuePageSelectors {
  @Selector([UploadsQueuePageState.data])
  static invoices(state: DocumentStateModel): Document[] {
    return state.invoices;
  }

  @Selector([UploadsQueuePageState.data])
  static uploadedInvoices(state: DocumentStateModel): Document[] {
    return state.invoices;
  }

  @Selector([UploadsQueuePageState.data])
  static sortedColumnData(state: DocumentStateModel): SortedColumnData {
    return state.sortedColumnData;
  }

  @Selector([UploadsQueuePageState.data])
  static loadMoreHidden(state: DocumentStateModel): boolean {
    return state.loadMoreHidden;
  }

  @Selector([UploadsQueuePageState.data])
  static canRefreshPage(state: DocumentStateModel): boolean {
    return state.canRefreshPage;
  }

  @Selector([UploadsQueuePageState.data])
  static uploadedDocumentMessages(state: DocumentStateModel): UploadedDocumentMessage[] {
    return state.uploadedDocumentMessages;
  }

  @Selector([UploadsQueuePageState.data])
  static searchByFileNameValue(state: DocumentStateModel): string {
    return state.searchByFileNameValue;
  }
}
