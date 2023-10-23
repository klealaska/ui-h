import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Component, Input, ViewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { RouterModule } from '@angular/router';
import { NavItem } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    RouterModule,
    MenuListItemComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  @Input() navItems: NavItem[] = [];
  @ViewChild('sidenav') sidenav: MatSidenav;
}
