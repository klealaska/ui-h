import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { TitleBarComponent } from './title-bar.component';

describe('TitleBarComponent', () => {
  let component: TitleBarComponent;
  let fixture: ComponentFixture<TitleBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleBarComponent],
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title text', () => {
    component.title = 'payments';
    fixture.detectChanges();
    expect(component.title).toBeDefined();
    expect(component.title).toEqual('payments');

    const title = fixture.debugElement.query(By.css('#title-Bar-Text'));
    expect(title).toBeTruthy();
  });

  it('should show the back button if `showBackButton` input is true', () => {
    component.title = 'payments';
    component.showBackButton = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#title-Bar-Back-Button'));
    expect(button).toBeTruthy();
  });

  it('should not show the back button if `showBackButton` input is false', () => {
    component.title = 'payments';
    component.showBackButton = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#title-Bar-Back-Button'));
    expect(button).toBeFalsy();
  });

  describe('button event emitter', () => {
    it('should emit an event on click', () => {
      component.title = 'payment details';
      component.showBackButton = true;
      fixture.detectChanges();

      jest.spyOn(component.buttonEvent, 'emit');

      const button = fixture.debugElement.query(By.css('#title-Bar-Back-Button'));
      button.nativeElement.click();

      expect(component.buttonEvent.emit).toHaveBeenCalled();
    });
  });
});
