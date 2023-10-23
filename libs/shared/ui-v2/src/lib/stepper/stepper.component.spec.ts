import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { Component, NO_ERRORS_SCHEMA, Type, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StepperComponent } from './stepper.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepComponent } from './step/step.component';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, StepperComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    component.selected = {
      label: 'Basic Details 1',
      status: 'status step 1',
      stepLabel: undefined,
      subtitle: 'Assistive Text 1',
    } as unknown as StepComponent;
    component.selectedIndex = 1;
    jest
      .spyOn(component['breakpointObserver'], 'observe')
      .mockReturnValue(of({ matches: false, breakpoints: { '600px': true } }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return label ', () => {
    const selected = {
      label: 'Basic Details 1',
      status: 'status step 1',
      stepLabel: undefined,
      subtitle: 'Assistive Text 1',
    } as unknown as StepComponent;
    expect(component._stringLabel(selected)).toBe('Basic Details 1');
  });
});

describe('basic stepper', () => {
  let fixture: ComponentFixture<SimpleVerticalStepperComponent>;
  let breakpointObserver: BreakpointObserver;

  beforeEach(() => {
    fixture = createComponent(SimpleVerticalStepperComponent);
    breakpointObserver = TestBed.inject(BreakpointObserver);
    fixture.detectChanges();
  });

  it('should default to the first step', () => {
    const stepperComponent: CdkStepper = fixture.debugElement.query(
      By.css('ax-stepper')
    ).componentInstance;

    expect(stepperComponent.selectedIndex).toBe(0);
  });

  it('should throw when a negative `selectedIndex` is assigned', () => {
    const stepperComponent: CdkStepper = fixture.debugElement.query(
      By.css('ax-stepper')
    )?.componentInstance;

    expect(() => {
      stepperComponent.selectedIndex = -10;
      fixture.detectChanges();
    }).toThrowError(/Cannot assign out-of-bounds/);
  });

  it('should throw when an out-of-bounds `selectedIndex` is assigned', () => {
    const stepperComponent: CdkStepper = fixture.debugElement.query(
      By.css('ax-stepper')
    )?.componentInstance;

    expect(() => {
      stepperComponent.selectedIndex = 1000;
      fixture.detectChanges();
    }).toThrowError(/Cannot assign out-of-bounds/);
  });

  it('should go to previous available step when the previous button is clicked', () => {
    const stepperComponent = fixture.debugElement.query(
      By.directive(CdkStepper)
    )?.componentInstance;

    expect(stepperComponent.selectedIndex).toBe(0);
  });

  it('should go to next available step when the next button is clicked', () => {
    const stepperComponent = fixture.debugElement.query(
      By.directive(CdkStepper)
    )?.componentInstance;

    expect(stepperComponent.selectedIndex).toBe(0);
  });
});

function createComponent<T>(
  component: Type<T>,
  imports: any[] = [StepComponent, StepperComponent],
  encapsulation?: ViewEncapsulation
): ComponentFixture<T> {
  TestBed.configureTestingModule({
    imports: [CdkStepperModule, NoopAnimationsModule, ReactiveFormsModule, ...imports],
    declarations: [component],
  });

  if (encapsulation != null) {
    TestBed.overrideComponent(component, {
      set: { encapsulation },
    });
  }

  TestBed.compileComponents();
  return TestBed.createComponent<T>(component);
}

@Component({
  template: `
    <ax-stepper>
      <ax-step>
        <ng-template cdkStepLabel>Step 1</ng-template>
        Content 1
        <div>
          <button mat-button cdkStepperNext>Next</button>
        </div>
      </ax-step>
      <ax-step *ngIf="showStepTwo">
        <ng-template cdkStepLabel>Step 2</ng-template>
        Content 2
        <div>
          <button mat-button cdkStepperPrevious>Back</button>
          <button mat-button cdkStepperNext>Next</button>
        </div>
      </ax-step>
      <ax-step [label]="inputLabel">
        Content 3
        <div>
          <button mat-button cdkStepperPrevious>Back</button>
          <button mat-button cdkStepperNext>Next</button>
        </div>
      </ax-step>
    </ax-stepper>
  `,
})
class SimpleVerticalStepperComponent {
  inputLabel = 'Step 3';
  showStepTwo = true;
}
