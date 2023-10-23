import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChipsSize, ChipsStyle, ChipsType, HeaderNavAvatarInput } from '@ui-coe/shared/types';
import { MatChipEvent, MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'ax-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    AvatarComponent
  ],
})
export class ChipsComponent {
  @Input() style: ChipsStyle;
  @Input() size: ChipsSize;
  @Input() type: ChipsType;
  @Input() avatarInput: HeaderNavAvatarInput;
  @Input() chipsLabel: string;
  @Input() filterText: string;
  @Input() removable: boolean;
  @Input() selected: boolean;
  @Input() selectable: boolean;
  @Input() disabled = false;
  @Output() selectedState = new EventEmitter();
  @Output() readonly onremove = new EventEmitter<MatChipEvent>();
  removed = false;

  setSelected(event:MatChipSelectionChange):void {
    if (this.selectable) {
      this.selectedState.emit(event);
    }
  }

  removeChip(event:MatChipEvent): void {
    if (!this.disabled) {
      this.removed = true;
      this.onremove.emit(event);
    }
  }
}
