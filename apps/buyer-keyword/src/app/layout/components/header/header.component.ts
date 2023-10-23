import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'bkws-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() logout = new EventEmitter<void>();
}
