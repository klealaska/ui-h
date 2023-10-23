import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'bkws-home-modal',
  templateUrl: './home-modal.component.html',
  styleUrls: ['./home-modal.component.scss'],
})
export class HomeModalComponent implements OnInit {
  modalConfig: {
    title: string;
    message: string;
  };
  confirmText = '';
  confirmPlaceholder = 'Type: Confirm';

  constructor(
    private dialogRef: MatDialogRef<HomeModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: { customerName: string }
  ) {}

  ngOnInit(): void {
    this.modalConfig = {
      title: 'Confirm',
      message: `Are you sure you want to execute mass delete for this ${this.data.customerName}? This action cannot be undone.`,
    };
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  typeConfirm(value: string): void {
    this.confirmText = value.toLowerCase();
  }
}
