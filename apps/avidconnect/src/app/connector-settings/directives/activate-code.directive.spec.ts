import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivateCodeDirective } from './activate-code.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input type="text" avcActivateCode />`,
})
export class MockParentComponent {}

describe('activate code directive', () => {
  let fixture: ComponentFixture<MockParentComponent>;
  let inputElement: HTMLInputElement;
  let directive: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockParentComponent, ActivateCodeDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(MockParentComponent);
    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(ActivateCodeDirective));
    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should trim the input string if there are any spaces', () => {
    inputElement.value = '11 1';
    inputElement.dispatchEvent(new Event('input'));
    expect(inputElement.value).toBe('111');
  });

  it('should add spaces to a string after every four characters', () => {
    inputElement.value = '111111111111';
    inputElement.dispatchEvent(new Event('input'));
    expect(inputElement.value).toBe('1111 1111 1111');
  });
});
