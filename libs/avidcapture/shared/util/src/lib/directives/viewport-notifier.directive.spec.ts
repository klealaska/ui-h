import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportNotifierDirective } from './viewport-notifier.directive';

const nativeElementStub = {
  nativeElement: jest.fn(() => ({
    style: {
      height: 1200,
      width: 1600,
    },

    clientWidth: 1600,
  })),
};

(window as any).IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
}));

describe('ViewportNotifierDirective', () => {
  let directive: ViewportNotifierDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, ViewportNotifierDirective],
    }).createComponent(TestComponent);
    directive = new ViewportNotifierDirective(nativeElementStub);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});

@Component({
  template: `<ng-container xdcViewportNotifier>content1</ng-container>`,
})
export class TestComponent {}
