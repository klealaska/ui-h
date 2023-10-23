import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Color', () => {
    it('should be color default by default', () => {
      expect(fixture.nativeElement.querySelector('.spinner__default')).toBeTruthy();
    });

    it('should be color destructive', () => {
      component.color = 'destructive';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.spinner__destructive')).toBeTruthy();
    });

    it('should be color neutral', () => {
      component.color = 'neutral';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.spinner__neutral')).toBeTruthy();
    });

    it('should be color washed', () => {
      component.color = 'washed';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.spinner__washed')).toBeTruthy();
    });
  });

  describe('Size', () => {
    it('should be size lg by default', () => {
      expect(fixture.nativeElement.querySelector('.spinner__lg')).toBeTruthy();
    });

    it('should be size md', () => {
      component.size = 'md';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.spinner__md')).toBeTruthy();
    });

    it('should be size sm', () => {
      component.size = 'sm';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.spinner__sm')).toBeTruthy();
    });
  });
});
