import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NoopAnimationsModule, TooltipComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    component.tooltipText = 'Info about action';
    component.tooltipPosition = 'above';
    component.pointerPosition = 'center';
    component.tooltipStyle = 'primary';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display text', () => {
    expect(component.tooltipText).toBeDefined();
    expect(component.tooltipText).toEqual('Info about action');
  });

  it('should have and display the correct style', () => {
    expect(component.tooltipStyle).toBeDefined();
    expect(component.tooltipStyle).toEqual('primary');

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.ax-tooltip__primary')).toBeTruthy();
  });

  it('should have and display the correct position', () => {
    expect(component.tooltipPosition).toBeDefined();
    expect(component.tooltipPosition).toEqual('above');

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.above--center')).toBeTruthy();
  });

  it('should have and display the correct pointer', () => {
    expect(component.pointerPosition).toBeDefined();
    expect(component.pointerPosition).toEqual('center');

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.above--center')).toBeTruthy();
  });
});
