import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'avc-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() userDisplayName: string;
  @Output() logout = new EventEmitter<null>();
}
