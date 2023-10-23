import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
})
export class MenuComponent {
  @Input() menuList = [];
  @Output() menuClick: EventEmitter<string> = new EventEmitter<string>();

  onMenuClick(menuItem) {
    this.menuClick.emit(menuItem);
  }
}
