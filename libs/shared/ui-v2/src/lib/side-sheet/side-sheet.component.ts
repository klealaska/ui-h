import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleService } from '@ui-coe/shared/util/services';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { MatDividerModule } from '@angular/material/divider';
import { SideSheetButton } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-side-sheet',
  standalone: true,
  templateUrl: './side-sheet.component.html',
  styleUrls: ['./side-sheet.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    ButtonComponent,
    MatDividerModule,
  ],
})
export class SideSheetComponent implements OnInit, OnChanges {
  @Input() opened: boolean;
  @Input() sheetTitle: string;
  @Input() btn1: SideSheetButton;
  @Input() btn2: SideSheetButton;
  @Output() btn1Event = new EventEmitter();
  @Output() btn2Event = new EventEmitter();
  @Output() closeButtonEvent = new EventEmitter();

  constructor(public toggleService: ToggleService) {}

  ngOnInit(): void {
    this.toggleService.setState(this.opened);
  }

  ngOnChanges(data): void {
    if (data.opened) this.toggleService.setState(data.opened.currentValue);
  }

  toggleSideSheet(): void {
    this.opened = !this.opened;
    this.toggleService.setState(this.opened);
    this.closeButtonEvent.emit();
  }
}
