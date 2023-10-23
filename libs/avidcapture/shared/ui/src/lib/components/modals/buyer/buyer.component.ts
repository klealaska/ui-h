import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Buyer } from '@ui-coe/avidcapture/shared/types';

@Component({
  selector: 'xdc-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss'],
})
export class BuyerComponent implements OnInit {
  optionsSelected: Buyer[] = [];
  orgNames: Buyer[] = [];

  constructor(
    private dialogRef: MatDialogRef<BuyerComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { orgNames: Buyer[] }
  ) {}

  ngOnInit(): void {
    this.orgNames = this.data.orgNames;
  }

  view(): void {
    this.dialogRef.close(this.optionsSelected);
  }

  filterTextChange(text: string): void {
    this.orgNames = !text
      ? this.data.orgNames
      : this.data.orgNames.filter(buyer => buyer.name.toLowerCase().includes(text.toLowerCase()));
  }
}
