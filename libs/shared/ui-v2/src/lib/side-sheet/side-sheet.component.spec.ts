import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetComponent } from './side-sheet.component';
import { Component } from '@angular/core';

describe('SideSheetComponent', () => {
  let component: SideSheetComponent;
  let fixture: ComponentFixture<SideSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(SideSheetComponent);
    component = fixture.componentInstance;
    component.opened = true;
    component.sheetTitle = 'Title';
    component.btn2 = { text: 'Save' };
    component.btn1 = { text: 'Save' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('opened', () => {
    it('should be opened', () => {
      const openedSideSheet = fixture.nativeElement.querySelector('.ax-side-sheet');
      expect(openedSideSheet).toBeTruthy();
    });

    it('should not be opened', () => {
      component.opened = false;
      fixture.detectChanges();
      const closedSideSheet = fixture.nativeElement.querySelector('.ax-side-sheet');
      expect(closedSideSheet).toBeFalsy();
    });
  });

  describe('toggleSideSheet()', () => {
    it('should close the component', () => {
      const closeBtn = fixture.nativeElement.querySelector('[data-test="exit"]');
      closeBtn.click();
      expect(component.opened).toBeFalsy();
    });

    it('should emit close button event', () => {
      jest.spyOn(component.closeButtonEvent, 'emit');
      const closeBtn = fixture.nativeElement.querySelector('[data-test="exit"]');
      closeBtn.click();
      expect(component.closeButtonEvent.emit).toHaveBeenCalled();
    });
  });

  it('should emit close button event', () => {
    jest.spyOn(component.closeButtonEvent, 'emit');
    const closeBtn = fixture.nativeElement.querySelector('[data-test="exit"]');
    closeBtn.click();
    expect(component.closeButtonEvent.emit).toHaveBeenCalled();
  });

  describe('sheetTitle', () => {
    it('should display a title', () => {
      const title = fixture.nativeElement.querySelector('.ax-side-sheet__header-title');
      expect(title.innerHTML).toEqual(component.sheetTitle);
    });

    it('should not display a title', () => {
      component.sheetTitle = '';
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('.ax-side-sheet__header-title');
      expect(title.innerHTML).toEqual(component.sheetTitle);
    });
  });

  describe('btn1Event', () => {
    it('btn1 should emit event', () => {
      jest.spyOn(component.btn1Event, 'emit');
      const btn = fixture.nativeElement.querySelector('[data-test="btn1"]');
      btn.click();
      expect(component.btn1Event.emit).toHaveBeenCalled();
    });
  });

  describe('btn2Event', () => {
    it('btn2 should emit event', () => {
      jest.spyOn(component.btn2Event, 'emit');
      const btn = fixture.nativeElement.querySelector('[data-test="btn2"]');
      btn.click();
      expect(component.btn2Event.emit).toHaveBeenCalled();
    });
  });

  describe('btn1', () => {
    it('btn1 should display on screen', () => {
      const btn = fixture.nativeElement.querySelector('[data-test="btn1"]');
      expect(btn).toBeTruthy();
    });

    it('btn1 should not display on screen', () => {
      component.btn1.text = '';
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('[data-test="btn1"]');
      expect(btn).toBeFalsy();
    });

    it('btn1 should not be defined', () => {
      component.btn1 = undefined;
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('[data-test="btn1"]');
      expect(btn).toBeFalsy();
    });
  });

  describe('btn2', () => {
    it('btn2 should display on screen', () => {
      const btn = fixture.nativeElement.querySelector('[data-test="btn2"]');
      expect(btn).toBeTruthy();
    });

    it('btn2 should not display on screen', () => {
      component.btn2.text = '';
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('[data-test="btn2"]');
      expect(btn).toBeFalsy();
    });

    it('btn2 should not be defined', () => {
      component.btn2 = undefined;
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('[data-test="btn2"]');
      expect(btn).toBeFalsy();
    });
  });
});

@Component({
  template: '<ax-side-sheet [opened]="opened"></ax-side-sheet>',
})
class TestHostComponent {
  opened: boolean;
}

describe('Component: Greeter w/ host', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render side sheet`', () => {
    component.opened = true;
    fixture.detectChanges();
    const openedSideSheet = fixture.nativeElement.querySelector('.ax-side-sheet');
    expect(openedSideSheet).toBeTruthy();
  });
});
