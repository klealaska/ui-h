import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain icon', () => {
    component.icon = 'error';
    fixture.detectChanges();
    expect(component.icon).toBeDefined();
    expect(component.icon).toEqual('error');
  });

  it('should contain text', () => {
    component.text =
      'Clearly state what the user can do next, such as try different search terms, select an item from the list, etc.';
    fixture.detectChanges();
    expect(component.text).toBeDefined();
    expect(component.text).toEqual(
      'Clearly state what the user can do next, such as try different search terms, select an item from the list, etc.'
    );
  });

  it('should contain title', () => {
    component.title = 'Empty state title';
    fixture.detectChanges();
    expect(component.title).toBeDefined();
    expect(component.title).toEqual('Empty state title');
  });

  describe('background', () => {
    beforeEach(() => {
      (component.icon = 'error'),
        (component.title = 'Empty state title'),
        (component.text =
          'Clearly state what the user can do next, such as try different search terms, select an item from the list, etc.'),
        (component.size = 'sm'),
        (component.background = true),
        fixture.detectChanges();
    });

    it('should display the background when background is true', () => {
      const container = fixture.debugElement.query(By.css('.container__background')).nativeElement
        .classList;
      expect(container).toBeTruthy();
    });

    it('should not display the background when background is false', () => {
      component.background = false;
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.container')).nativeElement.classList;
      expect(container).toBeTruthy();
    });
  });

  describe('sizes', () => {
    beforeEach(() => {
      (component.icon = 'error'),
        (component.title = 'Empty state title'),
        (component.text =
          'Clearly state what the user can do next, such as try different search terms, select an item from the list, etc.'),
        (component.size = 'sm'),
        (component.background = true),
        fixture.detectChanges();
    });

    it('should apply the "sm" class when "sm" is passed into size input', () => {
      const iconClass = fixture.debugElement.query(By.css('.icon')).nativeElement.classList;
      expect(iconClass).toContain('sm');

      const titleClass = fixture.debugElement.query(By.css('.title')).nativeElement.classList;
      expect(titleClass).toContain('sm');

      const textClass = fixture.debugElement.query(By.css('.text')).nativeElement.classList;
      expect(textClass).toContain('sm');
    });

    it('should apply the "md" class when "md" is passed into size input', () => {
      component.size = 'md';
      fixture.detectChanges();

      const iconClass = fixture.debugElement.query(By.css('.icon')).nativeElement.classList;
      expect(iconClass).toContain('md');

      const titleClass = fixture.debugElement.query(By.css('.title')).nativeElement.classList;
      expect(titleClass).toContain('md');

      const textClass = fixture.debugElement.query(By.css('.text')).nativeElement.classList;
      expect(textClass).toContain('md');
    });

    it('should apply the "lg" class when "lg" is passed into size input', () => {
      component.size = 'lg';
      fixture.detectChanges();

      const iconClass = fixture.debugElement.query(By.css('.icon')).nativeElement.classList;
      expect(iconClass).toContain('lg');

      const titleClass = fixture.debugElement.query(By.css('.title')).nativeElement.classList;
      expect(titleClass).toContain('lg');

      const textClass = fixture.debugElement.query(By.css('.text')).nativeElement.classList;
      expect(textClass).toContain('lg');
    });
  });
});
