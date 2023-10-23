import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CircularStepperComponent } from './circular-stepper.component';

describe('CircularStepperComponent', () => {
  let component: CircularStepperComponent;
  let fixture: ComponentFixture<CircularStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, CircularStepperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircularStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialze `_totalStepCount` and `_currentStepCount` with default values', () => {
    expect(component['_totalStepCount']).toBe(1);
    expect(component['_currentStepCount']).toBe(1);
  });

  it('should call `calculateProgress` when total count is intialized', () => {
    jest.spyOn(component, 'calculateProgress');
    component.totalStep = 5;
    expect(component.calculateProgress).toHaveBeenCalled();
  });

  it('should call `calculateProgress` when progress is updated', () => {
    jest.spyOn(component, 'calculateProgress');
    component.progress = 3;
    expect(component.calculateProgress).toHaveBeenCalled();
  });

  it('should update stroke with `60, 100` to define the progress', () => {
    component.totalStep = 5;
    component.progress = 3;
    expect(component.strokes).toBe('60, 100');
  });

  it('should update stroke with `100` to defined the progress if only one step', () => {
    component.totalStep = 1;
    component.progress = 1;
    expect(component.strokes).toBe('100, 100');
  });

  it('should have `step-status` class', () => {
    const stepStatus = fixture.debugElement.query(By.css('.step-status'));
    expect(stepStatus).toBeTruthy();
  });

  it('should display text', () => {
    component.text = '2 of 5';
    fixture.detectChanges();
    const stepStatus = fixture.debugElement.query(By.css('.step-status'));
    expect(stepStatus.nativeElement.textContent).toEqual('2 of 5');
  });
});
