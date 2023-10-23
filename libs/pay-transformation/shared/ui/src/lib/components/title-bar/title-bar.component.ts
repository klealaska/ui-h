import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-coe-titlebar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
})
export class TitleBarComponent {
  @Input() title!: string;
  @Input() showBackButton!: boolean;
  @Output() buttonEvent = new EventEmitter<void>();
}
