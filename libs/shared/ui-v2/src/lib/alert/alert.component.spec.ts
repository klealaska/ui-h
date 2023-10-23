import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertComponent } from './alert.component';

describe('alert', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlertComponent],
      declarations: [DemoTestBasicComponent],
    });
    TestBed.compileComponents();
  }));

  describe('basic alert', () => {
    let fixture: ComponentFixture<DemoTestBasicComponent>;
    let testComponent: DemoTestBasicComponent;
    let alert: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(DemoTestBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      alert = fixture.debugElement.query(By.directive(AlertComponent));
    });
    it('should className correct', () => {
      fixture.detectChanges();
      expect(alert.nativeElement.firstElementChild?.classList).toContain('ax-alert');
    });
    it('should closeable work', fakeAsync(() => {
      testComponent.closeable = true;
      fixture.detectChanges();
      // expect(testComponent.onHide).toHaveBeenCalledTimes(0);
      expect(alert.nativeElement.querySelector('.ax-alert-close-icon')).toBeDefined();
      alert.nativeElement.querySelector('.ax-alert-close-icon').click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      alert = fixture.debugElement.query(By.directive(AlertComponent));
      expect(alert.nativeElement.querySelector('.ax-alert')).toBeNull();
    }));

    it('should display message', () => {
      fixture.detectChanges();
      expect(alert.nativeElement.querySelector('.ax-alert-description').innerHTML?.trim()).toBe(
        'message'
      );
    });
    it('should title work', () => {
      fixture.detectChanges();
      expect(alert.nativeElement.querySelector('.ax-alert-title').innerHTML?.trim()).toBe('title');
    });
    it('should showIcon work', () => {
      fixture.detectChanges();
      expect(alert.nativeElement.querySelector('.ax-alert-icon')).toBeNull();
      testComponent.showIcon = true;
      expect(alert.nativeElement.querySelector('.ax-alert-icon')).toBeDefined();
    });
    it('should display alert type ', () => {
      const listOfType = ['success', 'info', 'warning', 'error'];
      listOfType.forEach(type => {
        testComponent.type = type;
        fixture.detectChanges();
        expect(alert.nativeElement.querySelector('.ax-alert').classList).toContain(
          `ax-alert-${type}`
        );
      });
    });
    it('should action work', () => {
      fixture.detectChanges();
      testComponent.action = testComponent.template;
      fixture.detectChanges();
      expect(alert.nativeElement.querySelector('.ax-alert-action').classList).not.toBeNull();
    });
  });
});

@Component({
  selector: 'ax-test-basic-alert',
  template: `
    <ng-template #template>template</ng-template>
    <ax-alert
      [closable]="closeable"
      [message]="message"
      [title]="title"
      [showIcon]="showIcon"
      [type]="type"
      [action]="template"
    ></ax-alert>
  `,
})
class DemoTestBasicComponent {
  @ViewChild('template', { static: false }) template!: TemplateRef<void>;
  action?: string | TemplateRef<void>;
  closeable = false;
  title: string | TemplateRef<void> = 'title';
  message: string | TemplateRef<void> = 'message';
  showIcon = false;
  type = 'info';
}
