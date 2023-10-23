import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { SplitButtonComponent } from './split-button.component';

describe('SplitButtonComponent', () => {
  let component: SplitButtonComponent;
  let fixture: ComponentFixture<SplitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SplitButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SplitButtonComponent);
    component = fixture.componentInstance;

    component.dropdown = ['Suggestion', 'Suggestion', 'Suggestion'];
    component.size = 'sm';
    component.type = 'primary';
    component.color = 'default';
    component.fixed = false;
    component.disabled = false;

    fixture.detectChanges();
  });

  // Sets the offsetWidth to 100
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 100 });
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    it('should be active', () => {
      component.ngAfterViewInit();
      jest.runAllTimers();
      expect(component.width).toBe(98);
    });
  });

  describe('types', () => {
    it('should display primary type', () => {
      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.type).toBe('primary');
        expect(menuButton.nativeElement.type).toBe('primary');
      });
    });

    it('should display secondary type', () => {
      component.type = 'secondary';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.type).toBe('secondary');
        expect(menuButton.nativeElement.type).toBe('secondary');
      });
    });

    it('should display tertiary type', () => {
      component.type = 'tertiary';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.type).toBe('tertiary');
        expect(menuButton.nativeElement.type).toBe('tertiary');
      });
    });
  });

  describe('sizes', () => {
    it('should display sm size', () => {
      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.size).toBe('sm');
        expect(menuButton.nativeElement.size).toBe('sm');
      });
    });

    it('should display md size', () => {
      component.size = 'md';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.size).toBe('md');
        expect(menuButton.nativeElement.size).toBe('md');
      });
    });

    it('should display lg size', () => {
      component.size = 'lg';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.size).toBe('lg');
        expect(menuButton.nativeElement.size).toBe('lg');
      });
    });
  });

  describe('colors', () => {
    it('should display default color', () => {
      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.color).toBe('default');
        expect(menuButton.nativeElement.color).toBe('default');
      });
    });

    it('should display critical color', () => {
      component.color = 'critical';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.color).toBe('critical');
        expect(menuButton.nativeElement.color).toBe('critical');
      });
    });

    it('should display neutral color', () => {
      component.color = 'neutral';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.color).toBe('neutral');
        expect(menuButton.nativeElement.color).toBe('neutral');
      });
    });
  });

  describe('disabled', () => {
    it('should disable the button', () => {
      component.disabled = true;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.disabled).toBe(true);
        expect(menuButton.nativeElement.disabled).toBe(true);
      });
    });

    it('should not disable the button', () => {
      component.disabled = false;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));
        const menuButton = fixture.debugElement.query(By.css('#menu-button'));

        expect(mainButton.nativeElement.disabled).toBe(false);
        expect(menuButton.nativeElement.disabled).toBe(false);
      });
    });
  });

  describe('fixed', () => {
    it('should display fixed width button', () => {
      component.fixed = true;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));

        expect(mainButton.nativeElement.fixed).toBe(true);
      });
    });

    it('should not display fixed width button', () => {
      component.fixed = false;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const mainButton = fixture.debugElement.query(By.css('#main-button'));

        expect(mainButton.nativeElement.fixed).toBe(false);
      });
    });
  });

  describe('dropdown menu', () => {
    it('should open when menu-button is clicked', () => {
      const menuButton = fixture.debugElement.query(By.css('#menu-button'));
      menuButton.nativeElement.click();

      const menuAction = fixture.debugElement.query(By.css('#Suggestion-dropdown-action'));

      expect(menuAction).toBeTruthy();
    });
  });

  describe('button event emitter', () => {
    it('should emit the dropdown value on click', () => {
      jest.spyOn(component.buttonEvent, 'emit');

      const dropdownButton = fixture.debugElement.query(By.css('#menu-button'));
      dropdownButton.nativeElement.click();

      const dropdownAction = fixture.debugElement.query(By.css('#Suggestion-dropdown-action'));
      dropdownAction.nativeElement.click();

      expect(component.buttonEvent.emit).toHaveBeenCalled();
      expect(component.buttonEvent.emit).toHaveBeenCalledWith('Suggestion');
    });
  });
});
