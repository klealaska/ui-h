import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepHeaderComponent } from './step-header.component';
import { By } from '@angular/platform-browser';

describe('StepHeaderComponent', () => {
  let component: StepHeaderComponent;
  let fixture: ComponentFixture<StepHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, StepHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return and display label ', () => {
    component.label = 'Basic Details 1';
    fixture.detectChanges();
    const labelTitleElem = fixture.debugElement.query(By.css('.label-title'));
    expect(labelTitleElem.nativeElement.textContent).toBe('Basic Details 1');
    expect(component._stringLabel()).toBe('Basic Details 1');
  });

  it('should set subtitle', () => {
    component.subtitle = 'some subtitle';
    fixture.detectChanges();
    const labelTextElem = fixture.debugElement.query(By.css('.label-text'));
    expect(labelTextElem.nativeElement.textContent).toBe('some subtitle');
  });

  it('should set status', () => {
    component.status = 'some status';
    fixture.detectChanges();
    const statusElem = fixture.debugElement.query(By.css('.label-status'));
    expect(statusElem.nativeElement.textContent).toBe('some status');
  });

  it('should return null if not template', () => {
    const tpl = `<ng-template cdkStepLabel>
        Basic Details 3
        </ng-template>`;
    component.label = tpl;
    expect(component._templateLabel()).toBeNull();
  });
});
