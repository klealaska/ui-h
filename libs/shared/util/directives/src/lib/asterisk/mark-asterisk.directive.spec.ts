import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkAsteriskDirective } from './mark-asterisk.directive';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <label [uiCoeMarkAsterisk]="showAsterisk">Some random text</label> `,
})
class HostComponent {
  showAsterisk = true;
}

describe('MarkAsteriskDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let label: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkAsteriskDirective],
      declarations: [HostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
  });

  it('should not display asterisk', () => {
    component.showAsterisk = false;
    fixture.detectChanges();
    label = fixture.debugElement.query(By.css('label'));
    const asterisk = fixture.debugElement.query(By.css('label > .asterisk'));
    expect(asterisk).toBeFalsy();
    expect(label.nativeElement.innerHTML).not.toContain('*');
  });

  it('should display asterisk', () => {
    component.showAsterisk = true;
    fixture.detectChanges();
    label = fixture.debugElement.query(By.css('label'));
    const asterisk = fixture.debugElement.query(By.css('label > .asterisk'));
    expect(asterisk).toBeTruthy();
    expect(label.nativeElement.innerHTML).toContain('*');
  });
});
