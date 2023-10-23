import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'xdc-pdf-password',
  templateUrl: './pdf-password.component.html',
  styleUrls: ['./pdf-password.component.scss'],
})
export class PdfPasswordComponent {
  formCtrl = new FormControl<string | null>(null);

  constructor(private dialogRef: MatDialogRef<PdfPasswordComponent>) {}

  submit(): void {
    this.dialogRef.close(this.formCtrl.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
