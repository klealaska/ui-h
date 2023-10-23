import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateSize, EmptyStateSizes } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() icon?: string;
  @Input() title?: string;
  @Input() text?: string;
  @Input() size: EmptyStateSize = EmptyStateSizes.lg;
  @Input() background: boolean;
}
