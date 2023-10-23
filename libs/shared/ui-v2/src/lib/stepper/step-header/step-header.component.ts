import { CdkStepLabel } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ax-step-header',
  templateUrl: './step-header.component.html',
  imports: [CommonModule, MatIconModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class StepHeaderComponent {
  /** Label of the given step. */
  @Input() label: CdkStepLabel | string;
  @Input() icon?: string;
  @Input() stepIndex?: number;
  @Input() subtitle?: string;
  @Input() status?: string;

  /** Returns string label of given step if it is a text label. */
  _stringLabel(): string | null {
    return this.label instanceof CdkStepLabel ? null : this.label;
  }

  /** Returns CdkStepLabel if the label of given step is a template label. */
  _templateLabel(): CdkStepLabel | null {
    return this.label instanceof CdkStepLabel ? this.label : null;
  }
}
