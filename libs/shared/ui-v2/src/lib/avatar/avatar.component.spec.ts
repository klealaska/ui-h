import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AvatarComponent } from './avatar.component';
import { AvatarSize, AvatarName } from '@ui-coe/shared/types';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display initials', () => {
    const expectedInitials = 'jd';
    const testName = { first: 'john', last: 'doe' };
    component.name = testName;
    fixture.detectChanges();
    expect(component.initials).toBeDefined();
    expect(component.initials).toEqual(expectedInitials);
  });

  it('should have default class "ax-avatar" ', () => {
    component.size = '' as AvatarSize;
    const hostElement = fixture.debugElement;
    const elem = hostElement.query(By.css('.ax-avatar'));
    expect(elem).not.toBeNull();
    expect(elem).toBeTruthy();
  });

  it('should apply "lg" class based on "lg" size passed', () => {
    component.size = 'lg';
    fixture.detectChanges();
    const hostElement = fixture.debugElement;
    const elemClass = hostElement.query(By.css('.ax-avatar')).nativeElement.classList;
    expect(elemClass).toContain('lg');
  });

  it('should apply "sm" class based on "sm" size passed', () => {
    component.size = 'sm';
    fixture.detectChanges();
    const hostElement = fixture.debugElement;
    const elemClass = hostElement.query(By.css('.ax-avatar')).nativeElement.classList;
    expect(elemClass).toContain('sm');
  });

  it('should apply "xs" class based on "xs" size passed', () => {
    component.size = 'xs';
    fixture.detectChanges();
    const hostElement = fixture.debugElement;
    const elemClass = hostElement.query(By.css('.ax-avatar')).nativeElement.classList;
    expect(elemClass).toContain('xs');
  });

  it('should display image not Initials', () => {
    const testName = { first: 'john', last: 'doe' };
    component.name = testName;
    fixture.detectChanges();
    expect(component.initials).toBe('jd');
    component.img = 'localhost://test';
    fixture.detectChanges();
    const nameInitialsElem = fixture.debugElement.query(By.css('.text'));
    const imgElem = fixture.debugElement.query(By.css('img'));
    expect(nameInitialsElem).toBeNull();
    expect(imgElem).not.toBeNull();
  });

  it('should not display anything empty object', () => {
    const testName = {} as AvatarName;
    component.name = testName;
    fixture.detectChanges();
    expect(component.initials).toBe(NaN);
  });

  it('should not display anything when passed null ', () => {
    const testName = null as AvatarName;
    component.name = testName;
    fixture.detectChanges();
    expect(component.initials).toBeUndefined();
  });
});
