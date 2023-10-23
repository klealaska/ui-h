import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Connector, GroupSettings } from '../../../../models';
import { ConnectorSettingsState } from '../../../connector-settings.state';

@Component({
  selector: 'avc-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Output() settingsUpdated = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      connector: Connector;
      changedSettings: GroupSettings[];
    },
    private store: Store
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getPropertyGroupName(name: string): Observable<string> {
    return this.store.select(ConnectorSettingsState.propertyGroup).pipe(
      first(),
      map(fn => fn(name).DisplayName || fn(name).Name)
    );
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
