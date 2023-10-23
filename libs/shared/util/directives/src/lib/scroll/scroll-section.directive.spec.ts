import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScrollSectionDirective } from './scroll-section.directive';
import { ScrollService } from './services';

@Component({
  template: `
    <div [uiCoeScrollSection]="'box-1'" [attr.id]="'box-1'">box 1</div>
    <div [uiCoeScrollSection]="'box-2'" [attr.id]="'box-2'">box 2</div>
  `,
})
class TestComponent {
  @ViewChild(ScrollSectionDirective) directive: ScrollSectionDirective;
}
describe('ScrollSectionDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let els;
  let component: TestComponent;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ScrollSectionDirective, TestComponent],
      providers: [ScrollService],
    }).createComponent(TestComponent);
    fixture.detectChanges();
    els = fixture.debugElement.queryAll(By.directive(ScrollSectionDirective));
    component = fixture.componentInstance;
  });
  it('should create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.directive).toBeTruthy();
  });
  it('should query all elements with scroll section directive', () => {
    expect(els.length).toBe(2);
  });
  it('should query all elements with scroll section directive', () => {
    jest.spyOn(component.directive, 'scroll').mockImplementation((): void => void 0);
    component.directive.scroll();
    expect(component.directive.id).toBe('box-1');
    expect(component.directive.scroll).toHaveBeenCalled();
  });
});
