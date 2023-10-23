import { CdkStep } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ax-step',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-template><ng-content></ng-content></ng-template>',
  providers: [{ provide: CdkStep, useExisting: StepComponent }],
  encapsulation: ViewEncapsulation.None,
})
export class StepComponent extends CdkStep implements OnChanges {
  /**
   * Inputs here are required because these will be been passed down to 'ax-step-header' from 'ax-step'
   */
  @Input() icon?: string;
  @Input() subtitle?: string;
  @Input() status?: string;
}
