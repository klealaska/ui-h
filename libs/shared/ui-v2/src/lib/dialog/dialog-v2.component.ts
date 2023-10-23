import { MatDialogModule } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../button/button.component';
import { DialogDataV2 } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-dialog-v2',
  templateUrl: './dialog-v2.component.html',
  styleUrls: ['./dialog-v2.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, ButtonComponent, MatIconModule, DragDropModule],
})
export class DialogV2Component {
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<DialogV2Component>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataV2
  ) {
    dialogRef.addPanelClass('ax-dialog');
    dialogRef.disableClose = true;
    this.local_data = { ...data };

    this.local_data.draggable
      ? dialogRef.addPanelClass('non-modal-dialog')
      : dialogRef.addPanelClass('modal-dialog');
  }

  closeDialog(btnEvent) {
    this.dialogRef.close({ event: btnEvent, data: this.local_data });
  }
}
