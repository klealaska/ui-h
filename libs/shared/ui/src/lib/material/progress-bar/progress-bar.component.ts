import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProgressAnimationEnd } from '@angular/material/progress-bar';
import type { ThemePalette } from '@angular/material/core';
import type { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'ax-mat-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent {
  @Input() bufferValue: number;
  @Input() color: ThemePalette = 'primary';
  @Input() mode: ProgressBarMode = 'indeterminate';
  @Input() value: number;
  @Output() public animationEnd = new EventEmitter<ProgressAnimationEnd>();
}
