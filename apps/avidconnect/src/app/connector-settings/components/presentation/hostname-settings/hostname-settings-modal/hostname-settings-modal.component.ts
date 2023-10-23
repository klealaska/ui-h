import { Store } from '@ngxs/store';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreState } from '../../../../../core/state/core.state';
import { HostnameSettings } from '../../../../../models';
import * as actions from '../../../../connector-settings.actions';
import { ToastService } from '../../../../../core/services/toast.service';
import { ToastStatus } from '../../../../../core/enums';

@Component({
  selector: 'avc-hostname-settings-modal',
  templateUrl: './hostname-settings-modal.component.html',
  styleUrls: ['./hostname-settings-modal.component.scss'],
})
export class HostnameSettingsModalComponent implements OnInit {
  hostnameForm: UntypedFormGroup;
  editMode = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      hostname: HostnameSettings;
      editMode: boolean;
      hostnames: string[];
    },
    public dialogRef: MatDialogRef<HostnameSettingsModalComponent>,
    private fb: UntypedFormBuilder,
    private store: Store,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.hostnameForm = this.fb.group({
      machine: [this.data.hostname.name, Validators.required],
      name: [this.data.hostname.value.description, [Validators.required]],
      enabled: [this.data.hostname.value.enabled],
    });

    this.editMode = this.data.editMode;
  }

  saveHostname(): void {
    if (this.hostnameForm.valid) {
      const hostnames: HostnameSettings[] = [];

      if (this.editMode && this.hostnameForm.get('machine').value !== this.data.hostname.name) {
        hostnames.push({
          name: this.data.hostname.name,
          value: { ...this.data.hostname.value, enabled: false },
        });
      }

      const hostname: HostnameSettings = {
        name: this.hostnameForm.get('machine').value,
        value: {
          description: this.hostnameForm.get('name').value,
          enabled: this.hostnameForm.get('enabled').value,
        },
      };

      if (this.editMode || !this.isHostNameDuplicated(hostname.name)) {
        hostnames.push(hostname);

        const customerId = this.store.selectSnapshot<number>(CoreState.customerId);
        const registrationId = this.store.selectSnapshot<number>(CoreState.registrationId);

        this.store
          .dispatch(new actions.PostHostnameSettings(customerId, registrationId, hostnames))
          .subscribe(() => this.dialogRef.close());
      } else {
        this.toast.open('Machine Name already exisits', ToastStatus.Error);
      }
    }
  }

  isHostNameDuplicated(name: string): boolean {
    return this.data.hostnames.includes(name.toLowerCase().trim());
  }
}
