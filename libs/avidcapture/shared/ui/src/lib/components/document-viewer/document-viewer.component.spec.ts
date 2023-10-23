import { ViewportScroller } from '@angular/common';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getFieldBaseStub, pdfJsStub } from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys, HotKeyCode } from '@ui-coe/avidcapture/shared/types';
import { CompositeData100008306 } from '@ui-coe/avidcapture/shared/util';
import { AxLoadingSpinnerComponent } from '@ui-coe/shared/ui';
import { MockComponent } from 'ng-mocks';

import { DocumentCanvasComponent } from '../document-canvas/document-canvas.component';
import { DocumentViewerComponent } from './document-viewer.component';

const viewportScrollerStub = {
  setOffset: jest.fn(),
  scrollToAnchor: jest.fn(),
};

const viewportStub = {
  scrollToIndex: jest.fn(),
} as any;

describe('DocumentViewerComponent', () => {
  let component: DocumentViewerComponent;
  let fixture: ComponentFixture<DocumentViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentViewerComponent,
        MockComponent(DocumentCanvasComponent),
        MockComponent(AxLoadingSpinnerComponent),
      ],
      providers: [
        {
          provide: ViewportScroller,
          useValue: viewportScrollerStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewerComponent);
    component = fixture.componentInstance;
    component.pdfFile = pdfJsStub;
    component.compositeData = CompositeData100008306;
    component.fields = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set the viewport offset on init', () =>
      expect(viewportScrollerStub.setOffset).toHaveBeenNthCalledWith(1, [0, 125]));
  });

  describe('ngOnChanges()', () => {
    describe('when pdfFile gets a change && previousValue is undefined', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'loadDocument');
        component.pdfFile = pdfJsStub;
      });

      it('should set isLoading to true, loadedPdf to null, amountOfPages to empty array, & load up the PDF file', () => {
        component.ngOnChanges({
          pdfFile: new SimpleChange(undefined, pdfJsStub, true),
        });

        expect(component['loadDocument']).toHaveBeenCalledTimes(1);
        expect(component.amountOfPages.length).toBe(0);
        expect(component.loadedPdf).toBeNull();
        expect(component.isLoading).toBeTruthy();
      });
    });

    describe('when pdfFile gets a change && previousValue is NOT undefined', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'loadDocument');
        component.pdfFile = pdfJsStub;
      });

      it('should not call any loadingPDF tasks', () => {
        component.ngOnChanges({
          pdfFile: new SimpleChange(pdfJsStub, pdfJsStub, true),
        });

        expect(component['loadDocument']).not.toHaveBeenCalled();
        expect(component.amountOfPages.length).toBe(0);
        expect(component.loadedPdf).toBeUndefined();
        expect(component.isLoading).toBeFalsy();
      });
    });

    describe('when pdfFile gets a change & now has a password property', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'loadDocument');
        component.pdfFile = pdfJsStub;
        component.pdfFile.password = 'werock';
      });

      it('should call loadDocument', () => {
        component.ngOnChanges({
          pdfFile: new SimpleChange(pdfJsStub, pdfJsStub, true),
        });

        expect(component['loadDocument']).toHaveBeenCalledTimes(1);
      });
    });

    describe('when swappedDocument gets a change', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'resetComponentState').mockImplementation();
        jest.spyOn(component as any, 'loadDocument').mockImplementation();
        component.swappedDocument = null;
      });

      it('should call loadDocument fn', () => {
        component.ngOnChanges({
          swappedDocument: new SimpleChange(null, pdfJsStub, false),
        });

        expect(component['resetComponentState']).toHaveBeenCalledTimes(1);
        expect(component['loadDocument']).toHaveBeenCalledTimes(1);
      });
    });

    describe('when updateFontFace changes', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'resetComponentState').mockImplementation();
        jest.spyOn(component as any, 'loadDocument').mockImplementation();
        component.pdfFile = pdfJsStub;
      });

      it('should call loadDocument fn', () => {
        component.ngOnChanges({
          updateFontFace: new SimpleChange(null, true, false),
        });

        expect(component['resetComponentState']).toHaveBeenCalledTimes(1);
        expect(component['loadDocument']).toHaveBeenCalledTimes(1);
      });

      it('should call loadDocument fn when set back to false', () => {
        component.ngOnChanges({
          updateFontFace: new SimpleChange(true, false, false),
        });

        expect(component['resetComponentState']).toHaveBeenCalledTimes(1);
        expect(component['loadDocument']).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'resetComponentState');
      fixture.destroy();
    });

    it('should call resetComponentState fn and set all global vars back to defaults', () => {
      expect(component['resetComponentState']).toHaveBeenCalledTimes(1);
      expect(component.amountOfPages).toEqual([]);
      expect(component.amountOfUnindexedPages).toEqual([]);
      expect(component.amountOfReadOnlyPages).toEqual([]);
      expect(component.isLoading).toBeFalsy();
      expect(component.showLabels).toBeFalsy();
      expect(component.currentPage).toBe(1);
      expect(component.totalPages).toBe(1);
      expect(component.rotateLeft).toBe(1);
      expect(component.rotateRight).toBe(1);
      expect(component.zoomOut).toBe(1);
      expect(component.zoomIn).toBe(1);
    });

    describe('whenn updateFontFace changes', () => {
      beforeEach(() => {
        component.pdfFile = pdfJsStub;
      });

      it('should set isLoading to true, loadedPdf to null, amountOfPages to empty array, & load up the PDF file', () => {
        component.ngOnChanges({
          pdfFile: new SimpleChange(undefined, pdfJsStub, true),
        });

        expect(component.amountOfPages.length).toBe(0);
        expect(component.loadedPdf).toBeNull();
        expect(component.isLoading).toBeTruthy();
      });
    });

    describe('whenn updateFontFace changes', () => {
      beforeEach(() => {
        component.pdfFile = pdfJsStub;
      });

      it('should set isLoading to true, loadedPdf to null, amountOfPages to empty array, & load up the PDF file', () => {
        component.ngOnChanges({
          pdfFile: new SimpleChange(undefined, pdfJsStub, true),
        });

        expect(component.amountOfPages.length).toBe(0);
        expect(component.loadedPdf).toBeNull();
        expect(component.isLoading).toBeTruthy();
      });
    });
  });

  describe('@HostListener: onKeyDown', () => {
    const mouseEventStub = {
      altKey: true,
      code: '',
    } as any;

    beforeEach(() => {
      jest.spyOn(component, 'rotatePageRight').mockImplementation();
      jest.spyOn(component, 'toggleLabels').mockImplementation();
      jest.spyOn(component.openHotKeysModal, 'emit').mockImplementation();
    });

    describe('when alt key is not being held down', () => {
      beforeEach(() => {
        mouseEventStub.altKey = false;
        mouseEventStub.code = HotKeyCode.P;
        component.onKeyDown(mouseEventStub);
      });

      it('should not call any additional action functions', () => {
        expect(component.rotatePageRight).not.toHaveBeenCalled();
        expect(component.toggleLabels).not.toHaveBeenCalled();
        expect(component.openHotKeysModal.emit).not.toHaveBeenCalled();
      });
    });

    describe('when alt key is being held & key R is pressed', () => {
      beforeEach(() => {
        mouseEventStub.altKey = true;
        mouseEventStub.code = HotKeyCode.R;
        component.onKeyDown(mouseEventStub);
      });

      it('should call rotateRight function', () =>
        expect(component.rotatePageRight).toHaveBeenCalledTimes(1));
    });

    describe('when alt key is being held & key T is pressed', () => {
      beforeEach(() => {
        mouseEventStub.altKey = true;
        mouseEventStub.code = HotKeyCode.T;
        component.onKeyDown(mouseEventStub);
      });

      it('should call toggleLabels function', () =>
        expect(component.toggleLabels).toHaveBeenCalledTimes(1));
    });

    describe('when alt key is being held & key slash is pressed', () => {
      beforeEach(() => {
        mouseEventStub.altKey = true;
        mouseEventStub.code = HotKeyCode.Slash;
        component.onKeyDown(mouseEventStub);
      });

      it('should call toggleLabels function', () =>
        expect(component.openHotKeysModal.emit).toHaveBeenCalledTimes(1));
    });
  });

  describe('zoomPageOut()', () => {
    beforeEach(() => {
      component.zoomOut = 1;
      component.zoomPageOut();
    });

    it('should add 1 to current zoomOut var', () => expect(component.zoomOut).toBe(2));
  });

  describe('zoomPageIn()', () => {
    beforeEach(() => {
      component.zoomIn = 1;
      component.zoomPageIn();
    });

    it('should add 1 to current zoomIn var', () => expect(component.zoomIn).toBe(2));
  });

  describe('rotatePageLeft()', () => {
    beforeEach(() => {
      component.rotateLeft = 1;
      component.rotatePageLeft();
    });

    it('should add 1 to current rotateLeft var', () => expect(component.rotateLeft).toBe(2));
  });

  describe('rotatePageRight()', () => {
    beforeEach(() => {
      component.rotateRight = 1;
      component.rotatePageRight();
    });

    it('should add 1 to current rotateRight var', () => expect(component.rotateRight).toBe(2));
  });

  describe('goToFirstPage()', () => {
    describe('when totalPages is GREATER THAN the maxUnindexedPages allowed', () => {
      beforeEach(() => {
        component.totalPages = 25;
        component.maxUnindexedPages = 10;
        component.currentPage = 10;
        component.viewPort = viewportStub;

        component.goToFirstPage();
      });

      it('should call viewportScroller.scrollToIndex with canvas-1', () =>
        expect(component.viewPort.scrollToIndex).toHaveBeenNthCalledWith(1, 0, 'smooth'));
    });

    describe('when totalPages is LESS THAN the maxUnindexedPages allowed', () => {
      beforeEach(() => {
        component.totalPages = 5;
        component.maxUnindexedPages = 10;
        component.currentPage = 10;
        component.viewPort = viewportStub;

        component.goToFirstPage();
      });

      it('should call viewportScroller.scrollToAnchor with canvas-1', () =>
        expect(viewportScrollerStub.scrollToAnchor).toHaveBeenNthCalledWith(1, 'olDiv-1'));
    });
  });

  describe('goToPageEntered()', () => {
    describe('when totalPages is GREATER THAN the maxUnindexedPages allowed', () => {
      beforeEach(() => {
        component.totalPages = 25;
        component.maxUnindexedPages = 10;
        component.currentPage = 10;
        component.viewPort = viewportStub;

        component.goToPageEntered('5');
      });

      it('should call viewPort.scrollToIndex with page entered -1', () =>
        expect(component.viewPort.scrollToIndex).toHaveBeenNthCalledWith(1, 4, 'smooth'));
    });

    describe('when totalPages is LESS THAN the maxUnindexedPages allowed', () => {
      beforeEach(() => {
        component.totalPages = 5;
        component.maxUnindexedPages = 10;
        component.currentPage = 10;
        component.viewPort = viewportStub;

        component.goToPageEntered('5');
      });

      it('should call viewportScroller.scrollToAnchor with canvas-5', () =>
        expect(viewportScrollerStub.scrollToAnchor).toHaveBeenNthCalledWith(1, 'olDiv-5'));
    });
  });

  describe('toggleLabels()', () => {
    beforeEach(() => {
      component.showLabels = false;
      component.toggleLabels();
    });

    it('should set showLabels the opposite of what it is currently', () =>
      expect(component.showLabels).toBeTruthy());
  });

  describe('getCurrentPage()', () => {
    describe('when pageWasEntered is true & the page passed in does NOT match the currentPage var', () => {
      beforeEach(() => {
        component['pageWasEntered'] = true;
        component.currentPage = 2;
        component.getCurrentPage(1);
      });

      it('should keep pageWasEntered as true', () =>
        expect(component['pageWasEntered']).toBeTruthy());
    });

    describe('when pageWasEntered is true & the page passed in does match the currentPage var', () => {
      beforeEach(() => {
        component['pageWasEntered'] = true;
        component.currentPage = 1;
        component.getCurrentPage(1);
      });

      it('should set pageWasEntered as false', () =>
        expect(component['pageWasEntered']).toBeFalsy());
    });

    describe('when pageWasEntered is false', () => {
      beforeEach(() => {
        component['pageWasEntered'] = false;
        component.currentPage = 2;
        component.getCurrentPage(1);
      });

      it('should set currentPage to passed in param', () => expect(component.currentPage).toBe(1));
    });
  });
});
