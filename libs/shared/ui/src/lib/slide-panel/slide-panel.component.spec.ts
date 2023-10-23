import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { MockComponent } from 'ng-mocks';
import { AxSlidePanelComponent } from './slide-panel.component';

describe('AxSlidePanelComponent', () => {
  let component: AxSlidePanelComponent;
  let fixture: ComponentFixture<AxSlidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxSlidePanelComponent, MockComponent(MatIcon)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxSlidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    jest.spyOn(document.body, 'appendChild');

    it('should inject slide panel component using document appendChild dom api', () =>
      expect(document.body.appendChild).toHaveBeenCalled());
  });

  describe('ngOnChanges', () => {
    describe('when showPanel is true', () => {
      beforeEach(() => {
        jest.spyOn(component.panelOpened, 'emit');
        component.ngOnChanges({
          showPanel: new SimpleChange(null, true, true),
        });
      });

      it('should emit panelOpened event', () =>
        expect(component.panelOpened.emit).toHaveBeenCalledTimes(1));
    });

    describe('when showPanel is false', () => {
      beforeEach(() => {
        jest.spyOn(component.panelOpened, 'emit');
        component.ngOnChanges({
          showPanel: new SimpleChange(null, false, true),
        });
      });

      it('should emit panelOpened event', () =>
        expect(component.panelOpened.emit).not.toHaveBeenCalled());
    });
  });

  describe('ngOnDestroy', () => {
    let spyRemoveElement;

    beforeEach(() => {
      spyRemoveElement = jest.spyOn(component['element'], 'remove');
      component.ngOnDestroy();
    });

    it('should remove slide panel from dom when component is destroyed', () =>
      expect(spyRemoveElement).toHaveBeenCalled());
  });
});
