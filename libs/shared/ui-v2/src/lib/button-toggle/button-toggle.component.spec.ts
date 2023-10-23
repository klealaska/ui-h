import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonToggleComponent } from './button-toggle.component';

describe('ButtonToggleComponent', () => {
  let component: ButtonToggleComponent;
  let fixture: ComponentFixture<ButtonToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ButtonToggleComponent,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonToggleModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonToggleComponent);
    component = fixture.componentInstance;
    component.disabled = false;
    component.content = [
      {
        text: 'Bold',
        icon: 'add',
      },
      {
        text: 'Italic',
        icon: 'done',
      },
      {
        text: 'Underline',
        icon: 'close',
      },
    ];
    component.multiSelect = false;
    component.size = 'sm';
    component.iconPosition = 'left';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the button toggle when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const buttonToggle = fixture.debugElement.query(By.css('.mat-button-toggle-disabled'))
      .nativeElement.classList;
    expect(buttonToggle).toContain('mat-button-toggle-disabled');
  });

  describe('button toggle icon position', () => {
    it('should have the left icon position class', () => {
      component.iconPosition = 'left';
      fixture.detectChanges();

      const buttonToggleGroup = fixture.debugElement.query(By.css('#content-container'))
        .nativeElement.classList;
      expect(buttonToggleGroup).toContain('left-icon');
    });

    it('should have the right icon position class', () => {
      component.iconPosition = 'right';
      fixture.detectChanges();

      const buttonToggleGroup = fixture.debugElement.query(By.css('#content-container'))
        .nativeElement.classList;
      expect(buttonToggleGroup).toContain('right-icon');
    });
  });

  describe('button toggle sizes', () => {
    it('should apply the "sm" class when "sm" is passed into size input', () => {
      component.size = 'sm';
      fixture.detectChanges();

      const buttonToggleGroup = fixture.debugElement.query(By.css('.mat-button-toggle-group'))
        .nativeElement.classList;
      expect(buttonToggleGroup).toContain('sm');
    });

    it('should apply the "md" class when "sm" is passed into size input', () => {
      component.size = 'md';
      fixture.detectChanges();

      const buttonToggleGroup = fixture.debugElement.query(By.css('.mat-button-toggle-group'))
        .nativeElement.classList;
      expect(buttonToggleGroup).toContain('md');
    });

    it('should apply the "lg" class when "sm" is passed into size input', () => {
      component.size = 'lg';
      fixture.detectChanges();

      const buttonToggleGroup = fixture.debugElement.query(By.css('.mat-button-toggle-group'))
        .nativeElement.classList;
      expect(buttonToggleGroup).toContain('lg');
    });
  });
});
