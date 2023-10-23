import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AnchorComponent } from './anchor.component';

describe('AnchorComponent', () => {
  let component: AnchorComponent;
  let fixture: ComponentFixture<AnchorComponent>;
  const mockData = {
    href: '#',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(AnchorComponent);
    component = fixture.componentInstance;
    component.href = mockData.href;
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

  describe('href', () => {
    it('href should equal mock href string', () => {
      const button = fixture.nativeElement.querySelector('.ax-button');
      expect(button.href).toBe('http://localhost/#');
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

  describe('type', () => {
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
      const buttonColor = fixture.nativeElement.querySelector('.color-default');
      expect(buttonColor).toBeTruthy();
    });
    it('should display color-critical class', () => {
      component.color = 'critical';
      fixture.detectChanges();
      const buttonColor = fixture.nativeElement.querySelector('.color-critical');
      expect(buttonColor).toBeTruthy();
    });
    it('should display color-neutral class', () => {
      component.color = 'neutral';
      fixture.detectChanges();
      const buttonColor = fixture.nativeElement.querySelector('.color-neutral');
      expect(buttonColor).toBeTruthy();
    });
  });

  describe('onClick', () => {
    it('should emit on button click', () => {
      jest.spyOn(component.btnClick, 'emit');
      const button = fixture.debugElement.query(By.css('.ax-button'));

      button.nativeElement.click();
      expect(component.btnClick.emit).toHaveBeenCalled();
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
