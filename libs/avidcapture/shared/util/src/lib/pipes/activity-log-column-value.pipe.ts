import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  ActivityTypes,
  CompositeDocument,
  DocumentTypes,
  IndexedLabel,
} from '@ui-coe/avidcapture/shared/types';

import { ActivityLogHelperService } from '../services/activity-log-helper.service';

@Pipe({
  name: 'activityLogColumnValue',
})
export class ActivityLogColumnValuePipe implements PipeTransform {
  constructor(private store: Store, private activityLogHelperService: ActivityLogHelperService) {}

  transform(label: IndexedLabel, index: number, documentType: DocumentTypes): string {
    const compositeData: CompositeDocument =
      documentType === DocumentTypes.Indexing
        ? this.store.selectSnapshot(state => state.indexingPage.compositeData)
        : this.store.selectSnapshot(state => state.archiveInvoicePage.document);

    if (
      compositeData?.indexed.activities[index].indexer === 'System' &&
      this.activityLogHelperService.getMachineValue(label, index, documentType) === '-'
    ) {
      return label.value.text;
    } else if (
      compositeData?.indexed.activities[index].indexer === 'System' &&
      this.activityLogHelperService.getMachineValue(label, index, documentType) !== '-' &&
      compositeData?.indexed.activities[index].activity === ActivityTypes.Create
    ) {
      return '';
    } else if (
      compositeData?.indexed.activities[index].indexer === 'System' &&
      this.activityLogHelperService.getMachineValue(label, index, documentType) !== '-' &&
      compositeData?.indexed.activities[index].activity !== ActivityTypes.Create
    ) {
      return label.value.text;
    } else {
      return label.value.text;
    }
  }
}
