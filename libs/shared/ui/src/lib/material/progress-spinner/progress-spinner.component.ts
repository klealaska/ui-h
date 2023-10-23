import { Component, Input } from '@angular/core';
import type { ThemePalette } from '@angular/material/core';
import type { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'ax-mat-progress-spinner',
  templateUrl: './progress-spinner.component.html',
})
export class ProgressSpinnerComponent {
  @Input() color: ThemePalette = 'primary';
  @Input() diameter: number;
  @Input() mode: ProgressSpinnerMode = 'determinate';
  @Input() strokeWidth: number;
  @Input() value: number;
}
