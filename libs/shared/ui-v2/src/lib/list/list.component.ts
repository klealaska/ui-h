import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ax-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ListComponent {
  @Input() unordered: boolean;
  @Input() items: Array<string>;
  @Input() disabled: boolean;
  @Output() itemEvent = new EventEmitter();
}
