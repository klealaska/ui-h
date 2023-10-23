import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HostnameSettings, SettingValue } from '../../../../models';
import { HostnameSettingsModalComponent } from './hostname-settings-modal/hostname-settings-modal.component';

@Component({
  selector: 'avc-hostname-settings',
  templateUrl: './hostname-settings.component.html',
  styleUrls: ['./hostname-settings.component.scss'],
})
export class HostnameSettingsComponent {
  @Input() hostnames: SettingValue[];

  hostname = new UntypedFormControl('hostname');

  constructor(private dialog: MatDialog) {
    this.hostname.setValue('');
  }

  openHostnameSettingsModal(editMode = false): void {
    const hostname = editMode ? this.hostname.value : new HostnameSettings();

    const hostnames: string[] = this.hostnames.map(hostname => hostname.name?.toLowerCase().trim());

    this.dialog.open(HostnameSettingsModalComponent, {
      data: { hostname, editMode, hostnames },
    });
  }
}
