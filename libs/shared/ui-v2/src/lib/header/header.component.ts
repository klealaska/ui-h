import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderNavAvatarInput } from '@ui-coe/shared/types';
import { Router } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'ax-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, AvatarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() logoImgSrc = '/Avidxchange_Primarylogo_RGB.svg';
  @Input() homePath = '/';
  @Input() avatarInput: HeaderNavAvatarInput;
  @Output() userClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([this.homePath]);
  }
}
