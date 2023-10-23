import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ax-side-sheet-v2',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule, MatDividerModule],
  templateUrl: './side-sheet-v2.component.html',
  styleUrls: ['./side-sheet-v2.component.scss'],
})
export class SideSheetV2Component {
  @Input() opened: boolean;
  @Input() backdrop: boolean;
  @Input() boxShadow = true;
  @Output() closeEvent = new EventEmitter();
  @Output() backDropEvent = new EventEmitter();

  @HostBinding('class.side-sheet-opened') private get class(): boolean {
    return this.opened;
  }
}
