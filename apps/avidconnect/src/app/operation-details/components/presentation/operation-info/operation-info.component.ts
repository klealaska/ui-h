import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Connector, Operation, Platform } from '../../../../models';

@Component({
  selector: 'avc-operation-info',
  templateUrl: './operation-info.component.html',
  styleUrls: ['./operation-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationInfoComponent {
  @Input() operation: Operation;
  @Input() connector: Connector;
  @Input() platform: Platform;
  @Input() hasDetails: boolean;
  @Input() hasLogs: boolean;
  @Input() hasArtifact: boolean;

  @Output() downloadArtifactClicked = new EventEmitter<number>();
  @Output() downloadReportClicked = new EventEmitter();
  @Output() downloadLogClicked = new EventEmitter<number>();

  isComplete = (currentOp: Operation): boolean =>
    currentOp &&
    (currentOp.operationStatusTypeName === 'Success' ||
      currentOp.operationStatusTypeName === 'Error');
  //public isComplete = (op: Operation): boolean => op.

  getOperationDuration(startDate: string, endDate: string): string {
    if (!endDate) return '';

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const duration = Math.abs(start - end);

    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));

    const thours = hours < 10 ? '0' + hours : hours;
    const tminutes = minutes < 10 ? '0' + minutes : minutes;
    const tseconds = seconds < 10 ? '0' + seconds : seconds;

    return +thours + ':' + tminutes + ':' + tseconds;
  }
}
