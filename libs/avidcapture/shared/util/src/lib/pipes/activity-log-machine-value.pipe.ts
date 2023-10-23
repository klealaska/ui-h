import { Pipe, PipeTransform } from '@angular/core';
import { DocumentTypes, IndexedLabel } from '@ui-coe/avidcapture/shared/types';

import { ActivityLogHelperService } from '../services/activity-log-helper.service';

@Pipe({
  name: 'activityLogMachineValue',
})
export class ActivityLogMachineValuePipe implements PipeTransform {
  constructor(private activityLogHelperService: ActivityLogHelperService) {}

  transform(label: IndexedLabel, index: number, documentType: DocumentTypes): string {
    return this.activityLogHelperService.getMachineValue(label, index, documentType);
  }
}
