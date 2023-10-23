import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'xdc-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  modalConfig = {
    title: '',
    message: '',
    confirmButton: 'xdc.shared.confirm-label',
    cancelButton: 'xdc.shared.cancel-label',
  };

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: { title: string; message: string; confirmButton?: string; cancelButton?: string }
  ) {}

  ngOnInit(): void {
    this.modalConfig.title = this.data.title;
    this.modalConfig.message = this.data.message;
    this.modalConfig.confirmButton = this.data.confirmButton
      ? this.data.confirmButton
      : this.modalConfig.confirmButton;
    this.modalConfig.cancelButton = this.data.cancelButton
      ? this.data.cancelButton
      : this.modalConfig.cancelButton;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
