import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  CompositeDocument,
  DocumentTypes,
  FieldBase,
  IndexedLabel,
} from '@ui-coe/avidcapture/shared/types';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogHelperService {
  private documentType: DocumentTypes;

  constructor(private store: Store) {}

  getMachineValue(label: IndexedLabel, index: number, documentType: DocumentTypes): string {
    this.documentType = documentType;

    if (label.value.confidence > 0 && label.value.confidence < 1) {
      return this.getConfidence(label);
    } else {
      return this.lastPredictedValue(label, index);
    }
  }

  private lastPredictedValue(label: IndexedLabel, index: number): string {
    const compositeData: CompositeDocument =
      this.documentType === DocumentTypes.Indexing
        ? this.store.selectSnapshot(state => state.indexingPage.compositeData)
        : this.store.selectSnapshot(state => state.archiveInvoicePage.document);

    for (let i = index - 1; i >= 0; i--) {
      const value = compositeData.indexed.activities[i].labels.find(
        lbl => lbl.label === label.label
      );

      if (value?.value?.confidence > 0 && value?.value?.confidence < 1) {
        return this.getConfidence(value);
      }
    }
    return '-';
  }

  private getConfidence(label: IndexedLabel): string {
    const formFields: FieldBase<string>[] =
      this.documentType === DocumentTypes.Indexing
        ? this.store.selectSnapshot(state => state.indexingDocumentFields.formFields)
        : this.store.selectSnapshot(state => state.archiveInvoicePage.formFields);
    const threshold = formFields.find(fld => fld.key === label.label)?.displayThreshold;

    if (threshold && label.value.text !== '') {
      const value = label.value.confidence * 100;
      switch (true) {
        case value >= threshold?.readonly:
          return `${label.value.text} (Confidence: High)`;
        case value >= threshold?.view:
          return `${label.value.text} (Confidence: Low)`;
        default:
          return '-';
      }
    }

    return '-';
  }
}
