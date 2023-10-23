import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TagSize, TagType, TagStyle } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class TagComponent {
  @Input() size: TagSize;
  @Input() type: TagType;
  @Input() style: TagStyle;
  @Input() icon: string;
  @Input() text: string;
}
