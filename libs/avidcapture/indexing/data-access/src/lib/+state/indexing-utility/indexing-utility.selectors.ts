import { Selector } from '@ngxs/store';
import {
  DuplicateDetectionError,
  IndexedData,
  IndexedLabel,
  LabelColor,
  RejectToSenderTemplate,
} from '@ui-coe/avidcapture/shared/types';

import { IndexingUtilityStateModel } from './indexing-utility.model';
import { IndexingUtilityState } from './indexing-utility.state';

export class IndexingUtilitySelectors {
  @Selector([IndexingUtilityState.data])
  static labelColors(state: IndexingUtilityStateModel): LabelColor[] {
    return state.labelColors;
  }

  @Selector([IndexingUtilityState.data])
  static duplicateDetectionError(state: IndexingUtilityStateModel): DuplicateDetectionError {
    return state.duplicateDetectionError;
  }

  @Selector([IndexingUtilityState.data])
  static selectedDocumentText(state: IndexingUtilityStateModel): IndexedLabel {
    return state.selectedDocumentText;
  }

  @Selector([IndexingUtilityState.data])
  static rejectToSenderTemplates(state: IndexingUtilityStateModel): RejectToSenderTemplate[] {
    return state.rejectToSenderTemplates;
  }

  @Selector([IndexingUtilityState.data])
  static customRejectToSenderTemplates(state: IndexingUtilityStateModel): RejectToSenderTemplate[] {
    return state.rejectToSenderTemplates.filter(
      t => t.sourceSystemBuyerId !== '' && t.sourceSystemBuyerId != null
    );
  }

  @Selector([IndexingUtilityState.data])
  static duplicateIndexedData(state: IndexingUtilityStateModel): IndexedData {
    return state.duplicateIndexedData;
  }

  @Selector([IndexingUtilityState.data])
  static canSubmit(state: IndexingUtilityStateModel): boolean {
    return state.canSubmit;
  }
}
