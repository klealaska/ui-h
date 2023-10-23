import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpinnerSize, SpinnerColor, SpinnerColors, SpinnerSizes } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SpinnerComponent {
  @Input() size: SpinnerSize = SpinnerSizes.lg;
  @Input() color: SpinnerColor = SpinnerColors.default;
}
