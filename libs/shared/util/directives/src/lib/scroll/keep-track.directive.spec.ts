import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KeepTrackDirective } from './keep-track.directive';
import { ScrollService } from './services';

@Component({
  template: `
    <div uiCoeKeepTrack [sections]="sections" style="height: 1200px;">
      <div [id]="'box-1'" [attr.id]="'box-1'" style="height: 500px;">box 1</div>
      <div [id]="'box-2'" [attr.id]="'box-2'" style="height: 500px;">box 2</div>
    </div>
  `,
})
class TestComponent {
  @ViewChild(KeepTrackDirective) directive: KeepTrackDirective;

  sections = [
    { name: 'Placeholder1', isActive: true, anchorId: 'box-1' },
    { name: 'Placeholder2', isActive: false, anchorId: 'box-2' },
  ];
}
describe('KeepTrackDirective', () => {
  describe('ScrollSectionDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element;
    let component: TestComponent;
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [KeepTrackDirective, TestComponent],
        providers: [ScrollService],
      }).compileComponents();
    });
    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      element = fixture.debugElement.queryAll(By.directive(KeepTrackDirective));
      fixture.detectChanges();
    });

    it('should create a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should create a component instance with directive', () => {
      expect(component.directive).toBeTruthy();
      expect(element.length).toBe(1);
    });
  });
});
