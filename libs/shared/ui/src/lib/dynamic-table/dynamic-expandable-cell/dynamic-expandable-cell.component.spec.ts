import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExpandableCellComponent } from './dynamic-expandable-cell.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ax-dynamic-component',
  template: `<button>Test</button>`,
})
export class DynamicComponent {}

describe('DynamicExpandableCellComponent', () => {
  let component: DynamicExpandableCellComponent;
  let fixture: ComponentFixture<DynamicExpandableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicExpandableCellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicExpandableCellComponent);
    component = fixture.componentInstance;
    component.data = {
      isExpandable: true,
      isExpanded: true,
      mobileView: {
        doubleColumnTop: true,
      },
      component: {
        type: 'component',
        value: {
          type: DynamicComponent,
          inputs: (element: any): any => {
            return { element };
          },
        },
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    jest.useFakeTimers();
    it('should have called loadDynamicComponent funtion', () => {
      const spy = jest.spyOn(component, 'loadDynamicComponent');

      component.ngAfterViewInit();
      jest.runAllTimers();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isRenderingDynamicComponent', () => {
    it('should have returned undefined', () => {
      component.data.component.type = undefined;
      expect(component.data.component.type).toBeUndefined();

      component.data = undefined;
      expect(component.data).toBeUndefined();
    });

    it('should have returned null', () => {
      component.data.component = null;
      expect(component.data.component).toBeNull();
    });
  });

  describe('loadDynamicComponent', () => {
    jest.useFakeTimers();
    it('should return truthy', () => {
      component.data.component.type = '';
      component.isRenderingDynamicComponent;

      const spy = jest.spyOn(component, 'loadDynamicComponent');
      component.ngAfterViewInit();
      jest.runAllTimers();
      expect(spy).toHaveBeenCalled();

      expect(component.loadDynamicComponent()).toBeFalsy();
    });
  });
});
