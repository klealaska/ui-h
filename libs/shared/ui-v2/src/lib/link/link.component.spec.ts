import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('link disable', () => {
    it('should disable the link when disabled is true', () => {
      component.size = 'sm';
      component.disabled = true;
      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css('.link--sm')).nativeElement.classList;
      expect(link).toContain('disabled');
    });
  });

  describe('link sizes', () => {
    beforeEach(() => {
      component.disabled = false;
      fixture.detectChanges();
    });

    it('should apply the "sm" class when "sm" is passed into size input', () => {
      component.size = 'sm';
      fixture.detectChanges();

      const linkHrefClass = fixture.debugElement.query(By.css('.link--sm')).nativeElement.classList;
      expect(linkHrefClass[0]).toContain('sm');

      const linkIconClass = fixture.debugElement.query(By.css('.link--sm')).nativeElement.classList;
      expect(linkIconClass[0]).toContain('sm');
    });

    it('should apply the "md" class when "md" is passed into size input', () => {
      component.size = 'md';
      fixture.detectChanges();

      const linkHrefClass = fixture.debugElement.query(By.css('.link--md')).nativeElement.classList;
      expect(linkHrefClass[0]).toContain('md');

      const linkIconClass = fixture.debugElement.query(By.css('.link--md')).nativeElement.classList;
      expect(linkIconClass[0]).toContain('md');
    });

    it('should apply the "lg" class when "lg" is passed into size input', () => {
      component.size = 'lg';
      fixture.detectChanges();

      const linkHrefClass = fixture.debugElement.query(By.css('.link--lg')).nativeElement.classList;
      expect(linkHrefClass[0]).toContain('lg');

      const linkIconClass = fixture.debugElement.query(By.css('.link--lg')).nativeElement.classList;
      expect(linkIconClass[0]).toContain('lg');
    });
  });
});
