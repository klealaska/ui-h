import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display text', () => {
    component.text = 'success';
    fixture.detectChanges();
    expect(component.text).toBeDefined();
    expect(component.text).toEqual('success');
  });

  it('should display the icon passed into the icon input', () => {
    component.icon = 'check';
    fixture.detectChanges();
    expect(component.icon).toBeDefined();
    expect(component.icon).toEqual('check');
  });

  it('should apply the "default" class when "default" is passed into type input', () => {
    component.style = 'filled';
    component.type = 'default';
    fixture.detectChanges();
    const tagClass = fixture.debugElement.query(By.css('.ax-tag__filled--default')).nativeElement
      .classList;
    expect(tagClass[0]).toContain('default');
  });

  it('should apply the "filled" class when "filled" is passed into style input', () => {
    component.style = 'filled';
    component.type = 'default';
    fixture.detectChanges();
    const tagClass = fixture.debugElement.query(By.css('.ax-tag__filled--default')).nativeElement
      .classList;
    expect(tagClass[0]).toContain('filled');
  });

  it('should apply the "border" class when "border" is passed into style input', () => {
    component.style = 'border';
    component.type = 'default';
    fixture.detectChanges();
    const tagClass = fixture.debugElement.query(By.css('.ax-tag__border--default')).nativeElement
      .classList;
    expect(tagClass[0]).toContain('border');
  });

  it('should apply the "sm" class when "sm" is passed into size input', () => {
    component.style = 'filled';
    component.type = 'default';
    component.size = 'sm';
    fixture.detectChanges();
    const tagClass = fixture.debugElement.query(By.css('.ax-tag__filled--default')).nativeElement
      .classList;
    expect(tagClass).toContain('sm');
  });

  it('should apply the "md" class when "md" is passed into size input', () => {
    component.style = 'filled';
    component.type = 'default';
    component.size = 'md';
    fixture.detectChanges();
    const tagClass = fixture.debugElement.query(By.css('.ax-tag__filled--default')).nativeElement
      .classList;
    expect(tagClass).toContain('md');
  });

  it('should apply the "lg" class when "lg" is passed into size input', () => {
    component.style = 'filled';
    component.type = 'default';
    component.size = 'lg';
    fixture.detectChanges();
    const tagClass = fixture.debugElement.query(By.css('.ax-tag__filled--default')).nativeElement
      .classList;
    expect(tagClass).toContain('lg');
  });
});
