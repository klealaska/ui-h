import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fixed', () => {
    it('should not have fixed classes', () => {
      const fixedButton = fixture.nativeElement.querySelector('.fixed-width');
      expect(fixedButton).toBeFalsy();
    });

    it('should have fixed classes', () => {
      component.fixed = true;
      fixture.detectChanges();
      const fixedButton = fixture.nativeElement.querySelector('.fixed-width');
      expect(fixedButton).toBeTruthy();
    });
  });

  describe('disabled', () => {
    it('should have disabled classes', () => {
      const button = fixture.nativeElement.querySelector('.ax-button');
      expect(button.disabled).toBeFalsy();
    });
    it('should not have disabled classes', () => {
      component.disabled = true;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.ax-button');
      expect(button.disabled).toBeTruthy();
    });
  });

  describe('type', () => {
    it('button type should equal button', () => {
      const button = fixture.nativeElement.querySelector('.ax-button');
      expect(button.type).toBe('button');
    });
    it('button type should equal submit', () => {
      component.btnType = 'submit';
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.ax-button');
      expect(button.type).toBe('submit');
    });
  });

  describe('size', () => {
    it('should display size-lg class', () => {
      const buttonSize = fixture.nativeElement.querySelector('.size-lg');
      expect(buttonSize).toBeTruthy();
    });
    it('should display size-md class', () => {
      component.size = 'md';
      fixture.detectChanges();

      const buttonSize = fixture.nativeElement.querySelector('.size-md');
      expect(buttonSize).toBeTruthy();
    });
  });

  describe('style', () => {
    it('should display type-primary class', () => {
      const buttontype = fixture.nativeElement.querySelector('.type-primary');
      expect(buttontype).toBeTruthy();
    });
    it('should display type-secondary class', () => {
      component.type = 'secondary';
      fixture.detectChanges();
      const buttontype = fixture.nativeElement.querySelector('.type-secondary');
      expect(buttontype).toBeTruthy();
    });
    it('should display type-tertiary class', () => {
      component.type = 'tertiary';
      fixture.detectChanges();
      const buttontype = fixture.nativeElement.querySelector('.type-tertiary');
      expect(buttontype).toBeTruthy();
    });
  });

  describe('color', () => {
    it('should display color-default class', () => {
      const buttonStyle = fixture.nativeElement.querySelector('.color-default');
      expect(buttonStyle).toBeTruthy();
    });
    it('should display color-critical class', () => {
      component.color = 'critical';
      fixture.detectChanges();
      const buttonStyle = fixture.nativeElement.querySelector('.color-critical');
      expect(buttonStyle).toBeTruthy();
    });
    it('should display color-neutral class', () => {
      component.color = 'neutral';
      fixture.detectChanges();
      const buttonStyle = fixture.nativeElement.querySelector('.color-neutral');
      expect(buttonStyle).toBeTruthy();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should have class text-button', () => {
      expect(fixture.nativeElement.querySelector('.text-button')).toBeTruthy();
    });
    it('should have class icon-button', () => {
      const button = fixture.nativeElement.querySelector('.ax-button');
      button.innerHTML = '<mat-icon class="mat-icon">add</mat-icon>';
      component.ngAfterViewInit();

      expect(fixture.nativeElement.querySelector('.icon-button')).toBeTruthy();
    });
    it('should have class left-icon-button', () => {
      const button = fixture.nativeElement.querySelector('.ax-button');
      button.innerText = 'Button \n add';
      button.innerHTML = '<mat-icon class="mat-icon">add</mat-icon>Button';
      component.ngAfterViewInit();

      expect(fixture.nativeElement.querySelector('.left-icon-button')).toBeTruthy();
    });
    it('should have class right-icon-button', () => {
      const button = fixture.nativeElement.querySelector('.ax-button');
      button.innerText = 'Button \n add';
      button.innerHTML = 'Button<mat-icon class="mat-icon">add</mat-icon>';
      component.ngAfterViewInit();

      expect(fixture.nativeElement.querySelector('.right-icon-button')).toBeTruthy();
    });
  });
});
