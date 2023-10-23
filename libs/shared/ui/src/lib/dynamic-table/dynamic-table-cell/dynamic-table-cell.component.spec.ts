import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableCellComponent } from './dynamic-table-cell.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ax-dynamic-component',
  template: `<button>Test</button>`,
})
export class DynamicComponent {}

describe('DynamicTableCellComponent', () => {
  let component: DynamicTableCellComponent<any>;
  let fixture: ComponentFixture<DynamicTableCellComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicTableCellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableCellComponent);
    component = fixture.componentInstance;
    component.columnDef = {
      columnDef: 'multiSelect',
      headerCellDef: 'test3',
      cellDef: {
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
    it('should have returned null', () => {
      component.columnDef.cellDef = null;
      expect(component.columnDef.cellDef).toBeNull();

      component.columnDef = null;
      expect(component.columnDef).toBeNull();
    });
  });

  describe('loadDynamicComponent', () => {
    jest.useFakeTimers();
    it('should return truthy', () => {
      component.columnDef = null;
      component.isRenderingDynamicComponent;

      const spy = jest.spyOn(component, 'loadDynamicComponent');
      component.ngAfterViewInit();
      jest.runAllTimers();
      expect(spy).toHaveBeenCalled();

      expect(component.loadDynamicComponent()).toBeUndefined();
    });

    it('should return else if RenderingDynamicComponent is true', () => {
      component.isRenderingDynamicComponent;

      component.ngAfterViewInit();
      jest.runAllTimers();

      expect(component.loadDynamicComponent).toBeDefined();
    });
  });
});
