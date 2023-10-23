import { Pipe, PipeTransform } from '@angular/core';
import { IndexedLabel } from '@ui-coe/avidcapture/shared/types';

@Pipe({
  name: 'activityLogCurrentValue',
})
export class ActivityLogCurrentValuePipe implements PipeTransform {
  transform(labels: IndexedLabel[], activityLabelName: string): string {
    return labels.find(lbl => lbl.label === activityLabelName)?.value?.text || '';
  }
}
