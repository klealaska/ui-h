import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPermissionsDirective } from './check-permissions.directive';

describe('CheckPermissionsDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, CheckPermissionsDirective],
    }).createComponent(TestComponent);
    fixture.detectChanges();
  });

  describe('ngAfterViewInit()', () => {
    it('should NOT show content1', () =>
      expect(fixture.nativeElement.innerHTML).not.toContain('content1'));

    it('should show content2', () => expect(fixture.nativeElement.innerHTML).toContain('content2'));
  });
});

@Component({
  template: `
    <div *axCheckPermissions="['mock']; user: ['mockAdmin']">content1</div>
    <div *axCheckPermissions="['mockAdmin']; user: ['mockAdmin']">content2</div>
  `,
})
export class TestComponent {}
