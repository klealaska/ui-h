import { CdkStepLabel, CdkStepper, StepperOrientation } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { StepComponent } from './step/step.component';
import { StepHeaderComponent } from './step-header/step-header.component';
import { CircularStepperComponent } from './circular-stepper/circular-stepper.component';
import { Directionality } from '@angular/cdk/bidi';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'ax-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  /* ANGULAR: This custom stepper provides itself as CdkStepper so that it can be recognized
    / by other components. */
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
  imports: [
    CommonModule,
    CdkStepperModule,
    StepComponent,
    StepHeaderComponent,
    CircularStepperComponent,
  ],
})
export class StepperComponent extends CdkStepper implements OnInit {
  @Input() direction: StepperOrientation = 'horizontal';
  mobile$: Observable<boolean>;
  showStepper = false;

  /**
   * Override the getter and setter from CdkStepper as CdkStep component is inhesrting and
   * modified as part of StepComponent
   */
  override get selected(): StepComponent {
    return super.selected;
  }
  override set selected(step: StepComponent) {
    super.selected = step;
  }

  constructor(
    _dir: Directionality,
    _changeDetectorRef: ChangeDetectorRef,
    _elementRef: ElementRef<HTMLElement>,
    private breakpointObserver: BreakpointObserver
  ) {
    super(_dir, _changeDetectorRef, _elementRef);
  }

  /**
   * Observe the viewport width initialization of component
   */
  ngOnInit() {
    this.mobile$ = this.breakpointObserver.observe(['(min-width: 600px)']).pipe(
      map((state: BreakpointState) => {
        this.showStepper = true;
        return !state.matches;
      })
    );
  }

  /**
   * @param step {StepComponent}
   * @returns string label of given step if it is a text label.
   */
  _stringLabel(step: StepComponent): string | null {
    return typeof step?.label === 'string' ? step.label : null;
  }

  /**
   *
   * @param step {StepComponent}
   * @returns CdkStepLabel if the label of given step is a template label.
   */
  _templateLabel(step: StepComponent): CdkStepLabel | null {
    return step?.stepLabel instanceof CdkStepLabel ? step.stepLabel : null;
  }
}
