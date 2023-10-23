import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ExpansionPanelType } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule],
  viewProviders: [MatExpansionPanel],
})
export class ExpansionPanelComponent {
  @Input() type: ExpansionPanelType = 'primary';
  @Input() title: string;
  @Input() disabled: boolean;
  @Input() expanded: boolean;
  @Output() afterCollapse = new EventEmitter();
  @Output() afterExpand = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Output() opened = new EventEmitter();
}
