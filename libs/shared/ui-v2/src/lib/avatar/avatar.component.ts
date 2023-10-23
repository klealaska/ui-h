import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarName, AvatarSize } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AvatarComponent {
  initials: string;
  @Input() size: AvatarSize;
  @Input() img: string;
  @Input() set name(value: AvatarName) {
    if (value) {
      this.initials = value?.first?.[0] + value?.last?.[0];
    }
  }
}
