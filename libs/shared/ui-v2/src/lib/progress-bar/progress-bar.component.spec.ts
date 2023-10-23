import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';
import { By } from '@angular/platform-browser';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a label', () => {
    const label = 'Progresss Bar Label';
    component.label = label;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.container__label').textContent).toContain(label);
  });

  it('should display the helper text', () => {
    const text = 'Helper text';
    component.text = text;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.container__text').textContent).toContain(text);
  });

  it('should have a percentage', () => {
    const percentage = 25;
    const showPercentage = true;
    component.percentage = percentage;
    component.showPercentage = showPercentage;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.container__percentage').textContent).toContain(
      percentage + '%'
    );
  });

  describe('size', () => {
    it('should have a small size', () => {
      component.size = 'small';
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.container__progress-bar--small')).toBeTruthy();
    });

    it('should have a large size', () => {
      component.size = 'large';
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.container__progress-bar--large')).toBeTruthy();
    });
  });

  describe('icon', () => {
    it('should have a icon', () => {
      const icon = 'delete';
      component.icon = icon;
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.container__icon').textContent).toContain(icon);
    });

    it('should emit an event with the icon value when clicked', () => {
      component.icon = 'delete';
      fixture.detectChanges();

      jest.spyOn(component.iconEvent, 'emit');

      const icon = fixture.debugElement.query(By.css('.container__icon'));
      icon.nativeElement.click();

      expect(component.iconEvent.emit).toHaveBeenCalled();
      expect(component.iconEvent.emit).toHaveBeenCalledWith('delete');
    });
  });

  describe('types', () => {
    it('should have a default type', () => {
      component.percentage = 25;
      component.size = 'small';

      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.default')).toBeTruthy();
    });
    it('should have a error type', () => {
      component.error = 'error message';
      component.size = 'small';
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.error')).toBeTruthy();
    });

    it('should have a success type', () => {
      component.percentage = 100;
      component.size = 'small';
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.success')).toBeTruthy();
    });
  });
});
