import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarSize } from '@ui-coe/shared/types';
import { SharedUtilPipesModule } from '@ui-coe/shared/util/pipes';

@Component({
  selector: 'ax-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedUtilPipesModule, MatIconModule, MatProgressBarModule],
})
export class ProgressBarComponent {
  @Input() label: string;
  @Input() icon: string;
  @Input() text: string;
  @Input() percentage: number;
  @Input() showPercentage: boolean;
  @Input() error: string;
  @Input() size: ProgressBarSize;
  @Output() iconEvent = new EventEmitter();
}
