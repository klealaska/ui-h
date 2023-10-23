import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ViewportNotifierDirective } from './directives/viewport-notifier.directive';
import { ActivityLogColumnValuePipe } from './pipes/activity-log-column-value.pipe';
import { ActivityLogCurrentValuePipe } from './pipes/activity-log-current-value.pipe';
import { ActivityLogDisplayLabelPipe } from './pipes/activity-log-display-label.pipe';
import { ActivityLogMachineValuePipe } from './pipes/activity-log-machine-value.pipe';
import { ActivityLogNextValuePipe } from './pipes/activity-log-next-value.pipe';
import { DateMilliPipe } from './pipes/date-milli.pipe';
import { DuplicateDocumentIdPipe } from './pipes/duplicate-document-id.pipe';
import { TimeZonePipe } from './pipes/timezone.pipe';
import { UppercaseWordPipe } from './pipes/uppercase-word.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ViewportNotifierDirective,
    ActivityLogColumnValuePipe,
    ActivityLogCurrentValuePipe,
    ActivityLogDisplayLabelPipe,
    ActivityLogMachineValuePipe,
    ActivityLogNextValuePipe,
    DateMilliPipe,
    DuplicateDocumentIdPipe,
    TimeZonePipe,
    UppercaseWordPipe,
  ],
  exports: [
    ViewportNotifierDirective,
    ActivityLogColumnValuePipe,
    ActivityLogCurrentValuePipe,
    ActivityLogDisplayLabelPipe,
    ActivityLogMachineValuePipe,
    ActivityLogNextValuePipe,
    DateMilliPipe,
    DuplicateDocumentIdPipe,
    TimeZonePipe,
    UppercaseWordPipe,
  ],
})
export class AvidcaptureSharedUtilModule {}
