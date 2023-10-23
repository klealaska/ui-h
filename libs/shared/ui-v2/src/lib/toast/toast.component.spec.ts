import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: {},
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a title and message that matches the values passed in', () => {
    component.data.title = 'title';
    component.data.message = 'message';
    fixture.detectChanges();

    expect(component.data.title && component.data.message).toBeDefined();
    expect(component.data.title).toEqual('title');
    expect(component.data.message).toEqual('message');

    const titleClass = fixture.debugElement.query(By.css('.toast-container__title')).nativeElement;
    const messageClass = fixture.debugElement.query(
      By.css('.toast-container__message')
    ).nativeElement;

    expect(titleClass.classList[0]).toContain('title');
    expect(messageClass.classList[0]).toContain('message');
    expect(titleClass.textContent).toEqual('title');
    expect(messageClass.textContent).toEqual('message');
  });

  it('should display the icon passed into the icon input', () => {
    component.data.icon = 'check';
    fixture.detectChanges();

    expect(component.data.icon).toBeDefined();
    expect(component.data.icon).toEqual('check');

    const iconClass = fixture.debugElement.query(By.css('.toast-container__icon')).nativeElement;

    expect(iconClass.classList[0]).toBeTruthy();
    expect(iconClass.textContent).toEqual('check');
  });

  describe('toast close', () => {
    it('should display the close element and icon if close is true', () => {
      component.data.close = true;
      fixture.detectChanges();

      const closeClass = fixture.debugElement.query(
        By.css('.toast-container__close')
      ).nativeElement;

      expect(closeClass.classList[0]).toBeTruthy();
      expect(closeClass.textContent).toEqual('close');
    });
  });

  describe('toast action', () => {
    it('should have the correct text and href value assigned and open the link in a new tab when clicked', () => {
      component.data.action = {
        text: 'link',
        link: 'https://www.google.com/',
      };
      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css('#action'));

      expect(link.nativeElement.textContent).toEqual('link');
      expect(link.nativeElement.href).toEqual('https://www.google.com/');
    });
  });

  describe('toast types', () => {
    it('should apply the "success" class when "success" is passed into type input', () => {
      component.data.type = 'success';
      fixture.detectChanges();

      const toastClass = fixture.debugElement.query(By.css('.toast-container')).nativeElement
        .classList;

      expect(toastClass).toContain('success');
    });
    it('should apply the "warning" class when "warning" is passed into type input', () => {
      component.data.type = 'warning';
      fixture.detectChanges();

      const toastClass = fixture.debugElement.query(By.css('.toast-container')).nativeElement
        .classList;

      expect(toastClass).toContain('warning');
    });
    it('should apply the "critical" class when "critical" is passed into type input', () => {
      component.data.type = 'critical';
      fixture.detectChanges();

      const toastClass = fixture.debugElement.query(By.css('.toast-container')).nativeElement
        .classList;

      expect(toastClass).toContain('critical');
    });
    it('should apply the "informational" class when "informational" is passed into type input', () => {
      component.data.type = 'informational';
      fixture.detectChanges();

      const toastClass = fixture.debugElement.query(By.css('.toast-container')).nativeElement
        .classList;

      expect(toastClass).toContain('informational');
    });
  });
});
