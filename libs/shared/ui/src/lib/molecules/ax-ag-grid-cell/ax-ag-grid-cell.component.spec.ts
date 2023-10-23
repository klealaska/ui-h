import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxAgGridCellComponent } from './ax-ag-grid-cell.component';
import { GridColumn } from '../../shared/models/ax-grid';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const colDefStub = {
  colId: '',
  imageCell: {
    valueGetter: (val: string): string => val,
  },
  linkCell: {
    valueGetter: (val: string): string => val,
    bold: false,
    isLocked: (val): any => val,
  },
  textCell: {
    valueGetter: (val: string): string => val,
    bold: false,
    size: '12px',
    color: '#000',
  },
  tooltipCell: {
    valueGetter: (val: string): string => val,
  },
} as GridColumn;

const paramsStub = {
  colDef: colDefStub,
  data: {},
  clicked: (val): any => val,
  value: '',
};

describe('AxAgGridCellComponent', () => {
  let component: AxAgGridCellComponent;
  let fixture: ComponentFixture<AxAgGridCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxAgGridCellComponent],
      imports: [MatTooltipModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxAgGridCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit()', () => {
    describe('when no params exist', () => {
      beforeEach(() => {
        component.agInit(null);
      });

      it('should not instantiate params', () => expect(component.params).toBeNull());
    });

    describe('when colDef does not exist', () => {
      beforeEach(() => {
        paramsStub.colDef = null;
        component.agInit(paramsStub);
      });

      it('should instantiate params', () => expect(component.params).toBe(paramsStub));

      it('should not instantiate image', () => expect(component.image).toBeUndefined());
    });

    describe('when colDef exists', () => {
      beforeEach(() => {
        paramsStub.colDef = colDefStub;
        component.agInit(paramsStub);
      });

      it('should instantiate cellData', () => expect(component.cellData).toEqual({}));

      it('should instantiate params', () => expect(component.params).toBe(paramsStub));

      it('should instantiate image', () => expect(component.image).toBeDefined());

      it('should instantiate text', () => expect(component.text).toBeDefined());

      it('should instantiate linkText', () => expect(component.linkText).toBeDefined());

      it('should instantiate tooltipText', () => expect(component.tooltipText).toBeDefined());
    });

    describe('when imageCell || textCell || linkCell data does not exist', () => {
      beforeEach(() => {
        paramsStub.colDef = colDefStub;
        paramsStub.colDef.imageCell = undefined;
        paramsStub.colDef.textCell = undefined;
        paramsStub.colDef.linkCell = undefined;
        paramsStub.colDef.tooltipCell = undefined;
        component.agInit(paramsStub);
      });

      it('should not instantiate image', () => expect(component.image).toBeUndefined());

      it('should not instantiate text', () => expect(component.text).toBeUndefined());

      it('should not instantiate text', () => expect(component.textBold).toBeUndefined());

      it('should not instantiate text', () => expect(component.textSize).toBeUndefined());

      it('should not instantiate text', () => expect(component.textColor).toBeUndefined());

      it('should not instantiate linkText', () => expect(component.linkText).toBeUndefined());

      it('should not instantiate linkText', () => expect(component.linkBold).toBeUndefined());

      it('should not instantiate tooltipText', () => expect(component.tooltipText).toBeUndefined());
    });

    describe('when colDef.colId is lockedBy', () => {
      beforeEach(() => {
        paramsStub.colDef = colDefStub;
        paramsStub.colDef.colId = 'lockedBy';
        paramsStub.colDef.imageCell = undefined;
        paramsStub.colDef.textCell = undefined;
        paramsStub.colDef.linkCell = undefined;
        paramsStub.colDef.tooltipCell = undefined;
        paramsStub.value = 'mockUser';
        component.agInit(paramsStub);
      });

      afterEach(() => {
        paramsStub.colDef.colId = '';
        paramsStub.value = '';
      });

      it('should instantiate showLockImage var', () =>
        expect(component.showLockImage).toBeTruthy());
    });

    describe('colDef.multiLineTextCell', () => {
      describe('when multiLineTextCell is defined', () => {
        const multiLineColDefStub = {
          multiLineTextCell: [
            {
              valueGetter: (val: string): string => val,
              bold: false,
              size: '12px',
              color: '#000',
            },
          ],
        };

        beforeEach(() => {
          paramsStub.colDef = multiLineColDefStub;
          component.agInit(paramsStub);
        });

        it('should set multiLineText to colDef.multiLineTextCell data', () =>
          expect(component.multiLineText).toEqual(multiLineColDefStub.multiLineTextCell));
      });

      describe('when multiLineTextCell is defined', () => {
        beforeEach(() => {
          paramsStub.colDef = colDefStub;
          component.agInit(paramsStub);
        });

        it('should keep multiLineText as empty array', () =>
          expect(component.multiLineText).toEqual([]));
      });
    });
  });

  describe('onClickLink()', () => {
    let cellData: any;

    beforeEach(() => {
      component.params = paramsStub;
      component.cellData = 'value';
      cellData = component.onClickLink();
    });

    it('should return {} when clicking on link', () => expect(cellData).toBe('value'));
  });

  describe('refresh()', () => {
    it('should return false', () => expect(component.refresh()).toBeFalsy());
  });

  describe('getValue()', () => {
    it('should throw error', () =>
      expect(() => component.getValue()).toThrow(new Error('Method not implemented.')));
  });

  describe('isPopup()', () => {
    it('should throw error', () =>
      expect(() => component.isPopup()).toThrow(new Error('Method not implemented.')));
  });

  describe('getPopupPosition()', () => {
    it('should throw error', () =>
      expect(() => component.getPopupPosition()).toThrow(new Error('Method not implemented.')));
  });

  describe('isCancelBeforeStart()', () => {
    it('should throw error', () =>
      expect(() => component.isCancelBeforeStart()).toThrow(new Error('Method not implemented.')));
  });

  describe('isCancelAfterEnd()', () => {
    it('should throw error', () =>
      expect(() => component.isCancelAfterEnd()).toThrow(new Error('Method not implemented.')));
  });

  describe('focusIn()', () => {
    it('should throw error', () =>
      expect(() => component.focusIn()).toThrow(new Error('Method not implemented.')));
  });

  describe('focusOut()', () => {
    it('should throw error', () =>
      expect(() => component.focusOut()).toThrow(new Error('Method not implemented.')));
  });

  describe('getFrameworkComponentInstance()', () => {
    it('should throw error', () =>
      expect(() => component.getFrameworkComponentInstance()).toThrow(
        new Error('Method not implemented.')
      ));
  });

  describe('afterGuiAttached()', () => {
    it('should throw error', () =>
      expect(() => component.afterGuiAttached()).toThrow(new Error('Method not implemented.')));
  });
});
