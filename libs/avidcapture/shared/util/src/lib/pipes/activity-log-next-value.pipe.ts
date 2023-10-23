import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { Activity, CompositeDocument, DocumentTypes } from '@ui-coe/avidcapture/shared/types';

@Pipe({
  name: 'activityLogNextValue',
})
export class ActivityLogNextValuePipe implements PipeTransform {
  constructor(private store: Store) {}

  transform(
    activities: Activity[],
    activityLabelName: string,
    indexIn: number,
    documentType: DocumentTypes
  ): string {
    const compositeData: CompositeDocument =
      documentType === DocumentTypes.Indexing
        ? this.store.selectSnapshot(state => state.indexingPage.compositeData)
        : this.store.selectSnapshot(state => state.archiveInvoicePage.document);
    let valueText: string;

    if (compositeData?.indexed.activities.length - 1 > indexIn) {
      const newActivities = activities.slice(indexIn + 1, activities.length);

      newActivities.every(value => {
        if (value.labels?.find(lbl => lbl.label === activityLabelName)) {
          valueText = value.labels.find(lbl => lbl.label === activityLabelName)?.value?.text || '';
          return false;
        }

        return true;
      });
    }

    return valueText;
  }
}
