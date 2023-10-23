import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetV2Component } from './side-sheet-v2.component';

describe('SideSheetV2Component', () => {
  let component: SideSheetV2Component;
  let fixture: ComponentFixture<SideSheetV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetV2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(SideSheetV2Component);
    component = fixture.componentInstance;
    component.opened = true;
    component.backdrop = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('opened', () => {
    it('should be opened', () => {
      expect(fixture.nativeElement.classList.contains('side-sheet-opened')).toBeTruthy();
    });

    it('should not be opened', () => {
      component.opened = false;
      fixture.detectChanges();
      expect(fixture.nativeElement.classList.contains('side-sheet-opened')).toBeFalsy();
    });
  });

  describe('backDrop', () => {
    it('should contain backdrop', () => {
      const backdrop = fixture.nativeElement.querySelector('.ax-backdrop');
      expect(backdrop).toBeTruthy();
    });

    it('should not contain backdrop', () => {
      component.backdrop = false;
      fixture.detectChanges();
      const backdrop = fixture.nativeElement.querySelector('.ax-backdrop');
      expect(backdrop).toBeFalsy();
    });
  });

  describe('boxShadow', () => {
    it('should contain boxShadow', () => {
      const openedSideSheet = fixture.nativeElement.querySelector('.side-sheet--boxshadow');
      expect(openedSideSheet).toBeTruthy();
    });

    it('should not contain boxShadow', () => {
      component.boxShadow = false;
      fixture.detectChanges();
      const closedSideSheet = fixture.nativeElement.querySelector('.side-sheet--boxshadow');
      expect(closedSideSheet).toBeFalsy();
    });
  });

  describe('closeEvent', () => {
    it('should emit closeEvent', () => {
      jest.spyOn(component.closeEvent, 'emit');

      const closeBtn = fixture.nativeElement.querySelector('[data-test="side-sheet-close"]');
      closeBtn.click();

      expect(component.closeEvent.emit).toHaveBeenCalled();
    });
  });

  describe('backDropEvent', () => {
    it('should emit backDropEvent', () => {
      jest.spyOn(component.backDropEvent, 'emit');

      const backDrop = fixture.nativeElement.querySelector('.ax-backdrop');
      backDrop.click();

      expect(component.backDropEvent.emit).toHaveBeenCalled();
    });
  });
});
