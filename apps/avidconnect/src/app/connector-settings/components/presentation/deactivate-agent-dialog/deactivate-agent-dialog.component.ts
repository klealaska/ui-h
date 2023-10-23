import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OnPremAgentItem } from '../../../../models';

@Component({
  selector: 'avc-deactivate-agent',
  templateUrl: './deactivate-agent-dialog.component.html',
  styleUrls: ['./deactivate-agent-dialog.component.scss'],
})
export class DeactivateAgentDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: OnPremAgentItem) {}
}
