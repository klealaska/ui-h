import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hotkey } from '@ui-coe/avidcapture/shared/types';

@Component({
  selector: 'xdc-hotkeys-dialog',
  templateUrl: './hotkeys-dialog.component.html',
  styleUrls: ['./hotkeys-dialog.component.scss'],
})
export class HotkeysDialogComponent implements OnInit {
  hotkeys: Hotkey[] = [];

  constructor(
    private dialogRef: MatDialogRef<HotkeysDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { hotkeys: Hotkey[] }
  ) {}

  ngOnInit(): void {
    this.hotkeys = this.data.hotkeys;
  }

  close(): void {
    this.dialogRef.close();
  }
}
