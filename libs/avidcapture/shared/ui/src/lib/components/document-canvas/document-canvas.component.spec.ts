import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { getCompositeDataStub, getFieldBaseStub, pdfJsStub } from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys } from '@ui-coe/avidcapture/shared/types';
import {
  indexerHelper,
  labelHeaderStyle,
  labelHeaderStyleNoLabel,
  PdfHelperService,
  textHighlight,
  textHighlightCurrentlySelected,
  turnOffHighlight,
  turnOnHighlight,
} from '@ui-coe/avidcapture/shared/util';
import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import { DocumentCanvasComponent } from './document-canvas.component';
jest.mock('ol/source/Vector');

const pdfHelperServiceStub = {
  initializeMap: jest.fn(() => ({
    on: jest.fn(),
    setSize: jest.fn(),
    setTarget: jest.fn(),
    getView: jest.fn(() => ({
      setZoom: jest.fn(),
    })),
    removeLayer: jest.fn(),
    getLayers: jest.fn(() => []),
  })),
  createImageLayer: jest.fn(),
  createImageSource: jest.fn(),
  createMapView: jest.fn(),
  createVectorLayer: jest.fn(),
  getAssociatedLabels: jest.fn(),
  isModernBrowser: jest.fn(() => true),
};

const featuresStub = [
  new Feature({
    geometry: new Polygon([]),
    labelPoint: new Point([]),
    name: 'My Polygon',
  }),
];

const environmentStub = {
  maxUnindexedPages: '10',
};

describe('DocumentCanvasComponent', () => {
  let component: DocumentCanvasComponent;
  let fixture: ComponentFixture<DocumentCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentCanvasComponent],
      providers: [
        {
          provide: PdfHelperService,
          useValue: pdfHelperServiceStub,
        },
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCanvasComponent);
    component = fixture.componentInstance;
    component.map = {
      setSize: jest.fn(),
      getView: jest.fn(() => ({
        setZoom: jest.fn(),
      })),
      setTarget: jest.fn(),
      removeLayer: jest.fn(),
      getLayers: jest.fn(() => []),
    };
    component.textLayer = {
      getSource: jest.fn(() => ({ clear: jest.fn() })),
      setSource: jest.fn(),
    } as any;
    component.selectorLayer = {
      getSource: jest.fn(() => ({ clear: jest.fn() })),
      setSource: jest.fn(),
    } as any;
    component['labelsLayer'] = {
      getSource: jest.fn(() => ({ clear: jest.fn() })),
      setSource: jest.fn(),
    } as any;

    jest.spyOn(component, 'onResize');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when pageNumber is less than 10', () => {
      beforeEach(() => {
        component.pageNumber = 1;
        fixture.detectChanges();
      });

      it('should set isReadOnlyMode to FALSE', () => expect(component.isReadOnlyMode).toBeFalsy());
    });

    describe('when pageNumber is greater than 10', () => {
      beforeEach(() => {
        component.pageNumber = 11;
        fixture.detectChanges();
      });

      it('should set isReadOnlyMode to TRUE', () => expect(component.isReadOnlyMode).toBeTruthy());
    });

    it('should instantiate ctx on init', () => {
      fixture.detectChanges();
      expect(component['ctx']).toBeDefined();
    });
  });

  describe('ngAfterViewInit()', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'loadPage').mockImplementation();
      fixture.detectChanges();
    });

    it('should call loadPage fn', () => expect(component['loadPage']).toHaveBeenCalled());
  });

  describe('ngOnChanges()', () => {
    describe('when compositeData gets a change but the previousValue is undefined', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'clearTextSelected').mockImplementation();
        jest.spyOn(component as any, 'updateAssociatedLabels').mockImplementation();
        component.currentPage = 1;
        component.ngOnChanges({
          compositeData: new SimpleChange(null, getCompositeDataStub(), true),
        });
      });

      it('should call clearTextSelected fn', () => {
        expect(component['clearTextSelected']).not.toHaveBeenCalled();
      });

      it('should call updateAssociatedLabels fn', () => {
        expect(component['updateAssociatedLabels']).not.toHaveBeenCalled();
      });
    });

    describe('when compositeData gets a change & map is defined but loadedPdf is undefined', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'clearTextSelected').mockImplementation();
        jest.spyOn(component as any, 'updateAssociatedLabels').mockImplementation();
        component.currentPage = 1;
        component.ngOnChanges({
          compositeData: new SimpleChange({}, getCompositeDataStub(), true),
        });
      });

      it('should call clearTextSelected fn', () => {
        expect(component['clearTextSelected']).toHaveBeenCalledTimes(1);
      });

      it('should call updateAssociatedLabels fn', () => {
        expect(component['updateAssociatedLabels']).not.toHaveBeenCalled();
      });
    });

    describe('when compositeData gets a change & map is defined and loadedPdf is defined', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'clearTextSelected').mockImplementation();
        jest.spyOn(component as any, 'updateAssociatedLabels').mockImplementation();
        component.currentPage = 1;
        component.loadedPdf = pdfJsStub as any;
        component.ngOnChanges({
          compositeData: new SimpleChange({}, getCompositeDataStub(), true),
        });
      });

      it('should call clearTextSelected fn', () => {
        expect(component['clearTextSelected']).toHaveBeenCalledTimes(1);
      });

      it('should call updateAssociatedLabels fn', () => {
        expect(component['updateAssociatedLabels']).toHaveBeenCalledTimes(1);
      });
    });

    describe('when rotateLeft gets a change and previous value is not undefined and pageNumber equals currentPage', () => {
      beforeEach(() => {
        jest.spyOn(component, 'rotatePageLeft').mockImplementation();
        component.pageNumber = 1;
        component.currentPage = 1;
      });

      it('should call the rotatePageLeft method', () => {
        component.ngOnChanges({
          rotateLeft: new SimpleChange(1, 2, true),
        });

        expect(component.rotatePageLeft).toHaveBeenCalledTimes(1);
      });
    });

    describe('when rotateLeft gets a change but previous value is undefined', () => {
      beforeEach(() => {
        jest.spyOn(component, 'rotatePageLeft').mockImplementation();
        component.pageNumber = 1;
        component.currentPage = 1;
      });

      it('should NOT call the rotatePageLeft method', () => {
        component.ngOnChanges({
          rotateLeft: new SimpleChange(null, 1, true),
        });

        expect(component.rotatePageLeft).not.toHaveBeenCalled();
      });
    });

    describe('when rotateLeft gets a change and previous value is not undefined but pageNumber does NOT equal currentPage', () => {
      beforeEach(() => {
        jest.spyOn(component, 'rotatePageLeft').mockImplementation();
        component.pageNumber = 5;
        component.currentPage = 1;
      });

      it('should NOT call the rotatePageLeft method', () => {
        component.ngOnChanges({
          rotateLeft: new SimpleChange(1, 2, true),
        });

        expect(component.rotatePageLeft).not.toHaveBeenCalled();
      });
    });

    describe('when rotateRight gets a change and previous value is not undefined and pageNumber equals currentPage', () => {
      beforeEach(() => {
        jest.spyOn(component, 'rotatePageRight').mockImplementation();
        component.pageNumber = 1;
        component.currentPage = 1;
      });

      it('should call the rotatePageRight method', () => {
        component.ngOnChanges({
          rotateRight: new SimpleChange(1, 2, true),
        });

        expect(component.rotatePageRight).toHaveBeenCalledTimes(1);
      });
    });

    describe('when rotateRight gets a change but previous value is undefined', () => {
      beforeEach(() => {
        jest.spyOn(component, 'rotatePageRight').mockImplementation();
        component.pageNumber = 1;
        component.currentPage = 1;
      });

      it('should NOT call the rotatePageRight method', () => {
        component.ngOnChanges({
          rotateRight: new SimpleChange(null, 1, true),
        });

        expect(component.rotatePageRight).not.toHaveBeenCalled();
      });
    });

    describe('when rotateRight gets a change and previous value is not undefined but pageNumber does NOT equal currentPage', () => {
      beforeEach(() => {
        jest.spyOn(component, 'rotatePageRight').mockImplementation();
        component.pageNumber = 5;
        component.currentPage = 1;
      });

      it('should NOT call the rotatePageRight method', () => {
        component.ngOnChanges({
          rotateRight: new SimpleChange(1, 2, true),
        });

        expect(component.rotatePageRight).not.toHaveBeenCalled();
      });
    });

    describe('when zoomIn gets a change and previous value is not undefined and pageNumber equals currentPage', () => {
      beforeEach(() => {
        jest.spyOn(component, 'zoomPageIn').mockImplementation();
        component.pageNumber = 1;
        component.currentPage = 1;
      });

      it('should call the zoomPageIn method', () => {
        component.ngOnChanges({
          zoomIn: new SimpleChange(1, 2, true),
        });

        expect(component.zoomPageIn).toHaveBeenCalledTimes(1);
      });
    });

    describe('when zoomIn gets a change but previous value is undefined', () => {
      beforeEach(() => {
        jest.spyOn(component, 'zoomPageIn').mockImplementation();
        component.pageNumber = 1;
        component.currentPage = 1;
      });

      it('should NOT call the zoomPageIn method', () => {
        component.ngOnChanges({
          zoomIn: new SimpleChange(null, 1, true),
        });

        expect(component.zoomPageIn).not.toHaveBeenCalled();
      });
    });

    describe('when zoomIn gets a change and previous value is not undefined but pageNumber does NOT equal currentPage', () => {
      beforeEach(() => {
        jest.spyOn(component, 'zoomPageIn').mockImplementation();
        component.pageNumber = 5;
        component.currentPage = 1;
      });

      it('should NOT call the zoomPageIn method', () => {
        component.ngOnChanges({
          zoomIn: new SimpleChange(1, 2, true),
        });

        expect(component.zoomPageIn).not.toHaveBeenCalled();
      });
    });

    describe('when zoomOut gets a change and previous value is not undefined and pageNumber equals currentPage', () => {
      beforeEach(() => {
        jest.spyOn(component, 'zoomPageOut').mockImplementation();
        component.pageNumber = 1;
        component.currentPage = 1;
      });

      it('should call the zoomPageOut method', () => {
        component.ngOnChanges({
          zoomOut: new SimpleChange(1, 2, true),
        });

        expect(component.zoomPageOut).toHaveBeenCalledTimes(1);
      });
    });

    describe('when zoomOut gets a change but previous value is undefined', () => {
      beforeEach(() => {
        jest.spyOn(component, 'zoomPageOut').mockImplementation();
        component.pageNumber = 1;
        component.currentPage = 1;
      });

      it('should NOT call the zoomPageOut method', () => {
        component.ngOnChanges({
          zoomOut: new SimpleChange(null, 1, true),
        });

        expect(component.zoomPageOut).not.toHaveBeenCalled();
      });
    });

    describe('when zoomOut gets a change and previous value is not undefined but pageNumber does NOT equal currentPage', () => {
      beforeEach(() => {
        jest.spyOn(component, 'zoomPageOut').mockImplementation();
        component.pageNumber = 5;
        component.currentPage = 1;
      });

      it('should NOT call the zoomPageOut method', () => {
        component.ngOnChanges({
          zoomOut: new SimpleChange(1, 2, true),
        });

        expect(component.zoomPageOut).not.toHaveBeenCalled();
      });
    });

    describe('when showLabels gets a change and previous value is not undefined', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'showHideLabels').mockImplementation();
      });

      it('should call the showHideLabels method', () => {
        component.ngOnChanges({
          showLabels: new SimpleChange(1, 2, true),
        });

        expect(component['showHideLabels']).toHaveBeenCalledTimes(1);
      });
    });

    describe('when showLabels gets a change and previous value is undefined', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'showHideLabels').mockImplementation();
      });

      it('should NOT call the showHideLabels method', () => {
        component.ngOnChanges({
          showLabels: new SimpleChange(null, 1, true),
        });

        expect(component['showHideLabels']).not.toHaveBeenCalled();
      });
    });

    describe('when boundingBoxToHighlight gets a change', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'highlightBoundingBox').mockImplementation();
      });

      it('should call the highlightBoundingBox method', () => {
        component.ngOnChanges({
          boundingBoxToHighlight: new SimpleChange(null, '', true),
        });

        expect(component['highlightBoundingBox']).toHaveBeenCalledTimes(1);
      });
    });

    describe('when disableHighlight gets a change', () => {
      beforeEach(() => {
        component.map = {
          ...component.map,
          getLayers: jest.fn(() => [
            {
              get: jest.fn(() => 'textLayer'),
            },
          ]),
          removeLayer: jest.fn(),
        };

        jest.spyOn(component as any, 'loadUnindexedText').mockImplementation();
      });

      it('should call the loadUnindexedText method', () => {
        component.ngOnChanges({
          disableHighlight: new SimpleChange(null, true, true),
        });

        expect(component['loadUnindexedText']).toHaveBeenCalledTimes(1);
      });
    });

    describe('when disableHighlight gets a change and map layer is null', () => {
      beforeEach(() => {
        component.map = undefined;
        jest.spyOn(component as any, 'loadUnindexedText').mockImplementation();
      });

      it('should not call the loadUnindexedText method', () => {
        component.ngOnChanges({
          disableHighlight: new SimpleChange(null, true, true),
        });

        expect(component['loadUnindexedText']).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('@HostListener: onResize()', () => {
    describe('when width is less than 700', () => {
      beforeEach(() => {
        component['width'] = 500;
        component.olDiv.nativeElement.style = jest.fn();
        component.isLandscapePDF = true;
      });
      it('should set sizes for the map & olDiv', fakeAsync(() => {
        component.onResize();
        tick(100);
        expect(component.olDiv.nativeElement.style.height).toBe('361px');
        expect(component.olDiv.nativeElement.style.width).toBe('700px');
        expect(component.map.setSize).toHaveBeenNthCalledWith(1, [700, 361]);
      }));
    });

    describe('when docViewer clientWidth is more than 700', () => {
      beforeEach(() => {
        component['width'] = 1200;
        component.olDiv.nativeElement.style = jest.fn();
        component.isLandscapePDF = true;
      });
      it('should set sizes for the map & olDiv', fakeAsync(() => {
        component.onResize();
        tick(100);
        expect(component.olDiv.nativeElement.style.height).toBe('1008px');
        expect(component.olDiv.nativeElement.style.width).toBe('1200px');
        expect(component.map.setSize).toHaveBeenNthCalledWith(1, [1200, 1008]);
      }));
    });

    describe('when fitZoomOut is true', () => {
      beforeEach(() => {
        component['width'] = 1200;
        component['fitZoomOut'] = true;
        component['countZoomOut'] = 1.2;
        component.olDiv.nativeElement.style = jest.fn();
        component.isLandscapePDF = true;
      });
      it('should set sizes for the map & olDiv', fakeAsync(() => {
        component.onResize();
        tick(100);
        expect(component.olDiv.nativeElement.style.height).toBe('840px');
        expect(component.olDiv.nativeElement.style.width).toBe('1200px');
        expect(component.map.setSize).toHaveBeenNthCalledWith(1, [1200, 840]);
      }));
    });

    describe('when fitZoomOut is false && countZoomOut is > 1', () => {
      beforeEach(() => {
        component['width'] = 1200;
        component['fitZoomOut'] = false;
        component['countZoomOut'] = 1.2;
        component.olDiv.nativeElement.style = jest.fn();
        component.isLandscapePDF = true;
      });
      it('should set sizes for the map & olDiv', fakeAsync(() => {
        component.onResize();
        tick(100);
        expect(component.olDiv.nativeElement.style.height).toBe('840px');
        expect(component.olDiv.nativeElement.style.width).toBe('1200px');
        expect(component.map.setSize).toHaveBeenNthCalledWith(1, [1200, 840]);
      }));
    });
  });

  describe('zoomPageOut()', () => {
    describe('when isReadOnlyMode is TRUE & defaultscale is greater than 1', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'rerenderPage').mockImplementation();
        component.isReadOnlyMode = true;
        component['defaultScale'] = 1.5;
        component.zoomPageOut();
      });

      it('should set defaultscale -.25 of original value', () =>
        expect(component['defaultScale']).toBe(1.25));

      it('should call rerenderPage fn', () => {
        expect(component['rerenderPage']).toHaveBeenCalledTimes(1);
      });
    });

    describe('when isReadOnlyMode is TRUE but defaultscale is 1', () => {
      beforeEach(() => {
        component.map = {
          ...component.map,
          getView: jest.fn(() => ({
            getZoom: jest.fn(() => 1.1),
            setZoom: jest.fn(),
          })),
          setView: jest.fn(),
          setSize: jest.fn(),
        };
        jest.spyOn(component as any, 'rerenderPage').mockImplementation();
        component.isReadOnlyMode = true;
        component['defaultScale'] = 1;
        component.zoomPageOut();
      });

      it('should keep defaultscale at 1', () => expect(component['defaultScale']).toBe(1));

      it('should NOT call rerenderPage fn', () => {
        expect(component['rerenderPage']).not.toHaveBeenCalled();
      });
    });

    describe('when isReadOnlyMode is FALSE', () => {
      const setZoomSpy = jest.fn();

      beforeEach(() => {
        component.map = {
          ...component.map,
          getView: jest.fn(() => ({
            getZoom: jest.fn(() => 1.1),
            setZoom: setZoomSpy,
          })),
          setView: jest.fn(),
          setSize: jest.fn(),
        };
        component.isReadOnlyMode = false;
        component.isLandscapePDF = true;
        component.zoomPageOut();
      });

      it('should set zoom to 1', () => expect(setZoomSpy).toHaveBeenNthCalledWith(1, 1));

      it('should call handleHeightResizing', () => {
        component.isLandscapePDF = false;
        component.zoomPageOut();
        expect(component.onResize).toHaveBeenCalled();
      });
    });
  });

  describe('zoomPageIn()', () => {
    describe('when isReadOnlyMode is TRUE', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'rerenderPage').mockImplementation();
        component.isReadOnlyMode = true;
        component['defaultScale'] = 1.25;
        component.zoomPageIn();
      });

      it('should set defaultscale +.25 of original value', () =>
        expect(component['defaultScale']).toBe(1.5));

      it('should call rerenderPage fn', () => {
        expect(component['rerenderPage']).toHaveBeenCalledTimes(1);
      });
    });

    describe('when isReadOnlyMode is FALSE', () => {
      const setZoomSpy = jest.fn();

      beforeEach(() => {
        component.map = {
          ...component.map,
          getView: jest.fn(() => ({
            getZoom: jest.fn(() => 1),
            setZoom: setZoomSpy,
          })),
          setView: jest.fn(),
          setSize: jest.fn(),
        };
        component.isReadOnlyMode = false;
        component.isLandscapePDF = true;
        component.zoomPageIn();
      });

      it('should set zoom at 1.1', () => expect(setZoomSpy).toHaveBeenNthCalledWith(1, 1.1));
    });

    describe('when countZoomOut is greater than 1.1', () => {
      const setZoomSpy = jest.fn();

      beforeEach(() => {
        component.map = {
          ...component.map,
          getView: jest.fn(() => ({
            getZoom: jest.fn(() => 1),
            setZoom: setZoomSpy,
          })),
          setView: jest.fn(),
          setSize: jest.fn(),
        };
        component.isReadOnlyMode = false;
        component.isLandscapePDF = false;
        component['countZoomOut'] = 1.5;
        component.zoomPageIn();
      });

      it('should set fitZoomOut to false', () => expect(component['fitZoomOut']).toBeFalsy());

      it('should set countZoomOut to -0.1 less than what it is', () =>
        expect(component['countZoomOut']).toBe(1.4));
    });
  });

  describe('rotatePageLeft()', () => {
    const setRotationSpy = jest.fn();

    beforeEach(() => {
      component.map = {
        ...component.map,
        getView: jest.fn(() => ({
          getRotation: jest.fn(() => 0),
          setRotation: setRotationSpy,
        })),
        setView: jest.fn(),
      };
      component.rotatePageLeft();
    });

    it('should return rotation to -90 degrees', () =>
      expect(setRotationSpy).toHaveBeenNthCalledWith(1, -90));
  });

  describe('rotatePageRight()', () => {
    const setRotationSpy = jest.fn();

    beforeEach(() => {
      component.map = {
        ...component.map,
        getView: jest.fn(() => ({
          getRotation: jest.fn(() => 0),
          setRotation: setRotationSpy,
        })),
        setView: jest.fn(),
      };
      component.rotatePageRight();
    });

    it('should return rotation to 90 degrees', () =>
      expect(setRotationSpy).toHaveBeenNthCalledWith(1, 90));
  });

  describe('private loadPage()', () => {
    describe('when isReadOnlyMode is true', () => {
      it('should setDisplay for the map & only load labels when loading page successfully', fakeAsync(() => {
        component.loadedPdf = pdfJsStub as any;
        jest.spyOn(component as any, 'loadIndexingLayers').mockImplementation();
        jest
          .spyOn(component as any, 'loadPdfPage')
          .mockImplementation(() => Promise.resolve(component.loadedPdf));

        component.isReadOnlyMode = true;

        component['loadPage']();
        tick(10000);
        expect(component['loadIndexingLayers']).not.toHaveBeenCalled();
      }));
    });

    describe('when isArchive is true', () => {
      it('should setDisplay for the map & only load labels when loading page successfully', fakeAsync(() => {
        component.loadedPdf = pdfJsStub as any;
        jest.spyOn(component as any, 'loadArchivedLayers');
        jest.spyOn(component as any, 'loadUnindexedText').mockImplementation();
        jest.spyOn(component as any, 'loadAssociatedLabels').mockImplementation();
        jest.spyOn(component as any, 'loadSelectorLayer').mockImplementation();
        jest.spyOn(component as any, 'addDragBox').mockImplementation();
        jest
          .spyOn(component as any, 'loadPdfPage')
          .mockImplementation(() => Promise.resolve(component.loadedPdf));

        component['currentZoom'] = 0.5;
        component['currentRotation'] = 0;
        component['currentCenter'] = 1;

        component.map = {
          ...component.map,
          getView: jest.fn(() => ({
            setZoom: jest.fn(),
            setRotation: jest.fn(),
            setCenter: jest.fn(),
          })),
        };
        component.isArchive = true;

        jest.spyOn(component.map.getView(), 'setZoom');

        component['loadPage']();
        tick(10000);
        expect(component['loadArchivedLayers']).toHaveBeenCalledTimes(1);
        expect(component['loadAssociatedLabels']).toHaveBeenCalledTimes(1);

        expect(component['loadUnindexedText']).not.toHaveBeenCalledTimes(1);
        expect(component['loadSelectorLayer']).not.toHaveBeenCalledTimes(1);
        expect(component['addDragBox']).not.toHaveBeenCalledTimes(1);
      }));
    });

    describe('when isArchive is false', () => {
      it('should setDisplay for the map & load labels, unindexed text, & dragbox when loading page successfully', fakeAsync(() => {
        component.loadedPdf = pdfJsStub as any;
        jest.spyOn(component as any, 'loadIndexingLayers');
        jest.spyOn(component as any, 'loadUnindexedText').mockImplementation();
        jest.spyOn(component as any, 'loadAssociatedLabels').mockImplementation();
        jest.spyOn(component as any, 'loadSelectorLayer').mockImplementation();
        jest.spyOn(component as any, 'addDragBox').mockImplementation();
        jest
          .spyOn(component as any, 'loadPdfPage')
          .mockImplementation(() => Promise.resolve(component.loadedPdf));

        component['currentZoom'] = 0.5;
        component['currentRotation'] = 0;
        component['currentCenter'] = 1;

        component.map = {
          ...component.map,
          getView: jest.fn(() => ({
            setZoom: jest.fn(),
            setRotation: jest.fn(),
            setCenter: jest.fn(),
          })),
        };
        component.isArchive = false;

        jest.spyOn(component.map.getView(), 'setZoom');

        component['loadPage']();
        tick(10000);
        expect(component['loadIndexingLayers']).toHaveBeenCalledTimes(1);
        expect(component['loadUnindexedText']).toHaveBeenCalledTimes(1);
        expect(component['loadAssociatedLabels']).toHaveBeenCalledTimes(1);
        expect(component['loadSelectorLayer']).toHaveBeenCalledTimes(1);
        expect(component['addDragBox']).toHaveBeenCalledTimes(1);
      }));
    });
  });

  describe('private loadPdfPage()', () => {
    it('should call loadImageIntoOpenLayers', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [],
            rotate: 0,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      component.isReadOnlyMode = false;
      await component['loadPdfPage']();

      expect(component.isLandscapePDF).toBeFalsy();
      expect(component['loadImageIntoOpenLayers']).toHaveBeenCalled();
    });

    it('should set PDF to landscape when rotate = 90 & h > w', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [0, 0, 90, 100],
            rotate: 90,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      await component['loadPdfPage']();

      expect(component.isLandscapePDF).toBeTruthy();
    });

    it('should set PDF to landscape when rotate = 0 & w > h', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [0, 0, 100, 90],
            rotate: 0,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      await component['loadPdfPage']();

      expect(component.isLandscapePDF).toBeTruthy();
    });

    it('should keep PDF in portrait when rotate = 0 & w < h', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [0, 0, 90, 100],
            rotate: 0,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      await component['loadPdfPage']();

      expect(component.isLandscapePDF).toBeFalsy();
    });

    it('should keep PDF in portrait when rotate = 90 & h < w', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [0, 0, 100, 90],
            rotate: 90,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      await component['loadPdfPage']();

      expect(component.isLandscapePDF).toBeFalsy();
    });

    it('should turn on handlePointerMoveArchive for the map when isArchive is true', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [0, 0, 100, 90],
            rotate: 90,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      component.isArchive = true;
      component.isReadOnlyMode = false;

      await component['loadPdfPage']();

      expect(component.map.on).toHaveBeenNthCalledWith(
        2,
        'pointermove',
        component['handlePointerMoveArchive']
      );
    });

    it('should create a webp image when using a modern browser', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      jest.spyOn(component.canvas.nativeElement, 'toDataURL').mockImplementation();

      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [0, 0, 100, 90],
            rotate: 90,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      component.isReadOnlyMode = false;
      pdfHelperServiceStub.isModernBrowser.mockImplementationOnce(() => true);

      await component['loadPdfPage']();

      expect(component.canvas.nativeElement.toDataURL).toHaveBeenNthCalledWith(1, 'image/webp', 1);
    });

    it('should create a jpeg image when NOT using a modern browser', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      jest.spyOn(component.canvas.nativeElement, 'toDataURL').mockImplementation();

      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [0, 0, 100, 90],
            rotate: 90,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      component.isReadOnlyMode = false;
      pdfHelperServiceStub.isModernBrowser.mockImplementationOnce(() => false);

      await component['loadPdfPage']();

      expect(component.canvas.nativeElement.toDataURL).toHaveBeenNthCalledWith(1, 'image/jpeg', 1);
    });

    it('should NOT load any open layers map functionality', async () => {
      jest.spyOn(component as any, 'loadImageIntoOpenLayers').mockImplementation();
      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [0, 0, 100, 90],
            rotate: 90,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: jest.fn(() => ({
            promise: '',
          })),
        })),
      } as any;
      component.isReadOnlyMode = true;

      await component['loadPdfPage']();

      expect(pdfHelperServiceStub.initializeMap).not.toHaveBeenCalled();
    });
  });

  describe('private rerenderPage()', () => {
    const renderSpy = jest.fn(() => ({
      promise: '',
    }));

    it('should render context', async () => {
      component['loadedPdf'] = {
        getPage: jest.fn(() => ({
          _pageInfo: {
            view: [],
            rotate: 0,
          },

          getViewport: jest.fn(() => ({
            height: 100,
            width: 100,
          })),

          render: renderSpy,
        })),
      } as any;
      await component['rerenderPage']();

      expect(renderSpy).toHaveBeenCalled();
    });
  });

  describe('private loadImageIntoOpenLayers()', () => {
    const imageSourceStub = {
      setSource: jest.fn(),
    } as any;

    beforeEach(() => {
      pdfHelperServiceStub.createImageSource.mockReturnValue(imageSourceStub);
      pdfHelperServiceStub.createImageLayer.mockReturnValue({});
      pdfHelperServiceStub.createMapView.mockReturnValue({});

      component['imageExtent'] = [0, 0, 1292, 1674];
      component.map = {
        ...component.map,
        addLayer: jest.fn(),
        setSize: jest.fn(),
        setView: jest.fn(),
      };

      component['loadImageIntoOpenLayers']('mockImageUri');
    });

    it('should call pdfHelperService createImageSource function', () =>
      expect(pdfHelperServiceStub.createImageSource).toHaveBeenNthCalledWith(
        1,
        'mockImageUri',
        component['imageExtent']
      ));

    it('should call pdfHelperService createImageLayer function', () =>
      expect(pdfHelperServiceStub.createImageLayer).toHaveBeenNthCalledWith(1, imageSourceStub));

    it('should pdfHelperService createMapView function', () =>
      expect(pdfHelperServiceStub.createMapView).toHaveBeenNthCalledWith(
        1,
        component['imageExtent']
      ));

    it('should call map addLayer function', () =>
      expect(component.map.addLayer).toHaveBeenNthCalledWith(1, {}));

    it('should call map setView function', () => expect(component.map.setView).toHaveBeenCalled());

    it('should call handleHeightResizing', () => {
      expect(component.onResize).toHaveBeenCalled();
    });
  });

  describe('private loadUnindexedText()', () => {
    describe('when there is filteredText', () => {
      const textLayerStub = {
        getSource: jest.fn(() => ({ clear: jest.fn() })),
        setSource: jest.fn(),
      } as any;

      beforeEach(() => {
        pdfHelperServiceStub.createVectorLayer.mockReturnValue(textLayerStub);

        component['imageExtent'] = [0, 0, 1292, 1674];
        component.map = {
          ...component.map,
          addLayer: jest.fn(),
          setSize: jest.fn(),
          setView: jest.fn(),
        };
        component.compositeData = getCompositeDataStub();
        component.compositeData.unindexed.pages.push({ number: 1, lines: [] });
        component.pageNumber = 1;

        component['loadUnindexedText']();
      });

      it('should set selectedFeatures to an empty array', () =>
        expect(component.selectedFeatures).toEqual([]));

      it('should call pdfHelperService createVectorLayer function', () =>
        expect(pdfHelperServiceStub.createVectorLayer).toHaveBeenCalledTimes(1));

      it('should call map addLayer function', () =>
        expect(component.map.addLayer).toHaveBeenCalledTimes(1));
    });

    describe('when there is NO filteredText', () => {
      beforeEach(() => {
        component['imageExtent'] = [0, 0, 1292, 1674];
        component.map = {
          ...component.map,
          addLayer: jest.fn(),
          setSize: jest.fn(),
          setView: jest.fn(),
        };
        component.compositeData = getCompositeDataStub();
        component.pageNumber = 1;

        component['loadUnindexedText']();
      });

      it('should set selectedFeatures to an empty array', () =>
        expect(component.selectedFeatures).toEqual([]));

      it('should NOT call pdfHelperService createVectorLayer function', () =>
        expect(pdfHelperServiceStub.createVectorLayer).not.toHaveBeenCalled());

      it('should NOT call map addLayer function', () =>
        expect(component.map.addLayer).not.toHaveBeenCalled());
    });
  });

  describe('private loadAssociatedLabels()', () => {
    describe('when there are features', () => {
      const labelsLayerStub = {
        getSource: jest.fn(() => ({ clear: jest.fn() })),
        setSource: jest.fn(),
      } as any;

      beforeEach(() => {
        jest.spyOn(component as any, 'setBoundingBoxNames').mockImplementation();
        pdfHelperServiceStub.getAssociatedLabels.mockReturnValue(featuresStub);
        pdfHelperServiceStub.createVectorLayer.mockReturnValue(labelsLayerStub);

        component.map = {
          ...component.map,
          addLayer: jest.fn(),
          setSize: jest.fn(),
          setView: jest.fn(),
        };
        component.pageNumber = 1;
        component.compositeData = getCompositeDataStub();
        component.fields = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];
        component.labelColors = [];
        component['imageExtent'] = [0, 0, 1292, 1674];
        component.showLabels = false;

        component['loadAssociatedLabels']();
      });

      it('should call pdfHelperService getAssociatedLabels function', () =>
        expect(pdfHelperServiceStub.getAssociatedLabels).toHaveBeenNthCalledWith(
          1,
          component.pageNumber,
          component.compositeData,
          component.fields,
          component.labelColors,
          component['imageExtent'],
          component.showLabels,
          component.isSponsorUser,
          component.multipleDisplayThresholdsIsActive
        ));

      it('should call pdfHelperService createVectorLayer function', () =>
        expect(pdfHelperServiceStub.createVectorLayer).toHaveBeenNthCalledWith(
          1,
          'labelsLayer',
          textHighlight,
          expect.anything()
        ));

      it('should call map addLayer function', () =>
        expect(component.map.addLayer).toHaveBeenCalledTimes(1));

      it('should call setBoundingBoxNames function', () =>
        expect(component['setBoundingBoxNames']).toHaveBeenCalledTimes(1));
    });
  });

  describe('loadSelectorLayer()', () => {
    beforeEach(() => {
      const selectorLayerStub = {
        ...component.selectorLayer,
      } as any;

      pdfHelperServiceStub.createVectorLayer.mockReturnValue(selectorLayerStub);

      component.map = {
        ...component.map,
        addLayer: jest.fn(),
        setSize: jest.fn(),
        setView: jest.fn(),
      };

      component['loadSelectorLayer']();
    });

    it('should call pdfHelperService createVectorLayer fn', () =>
      expect(pdfHelperServiceStub.createVectorLayer).toHaveBeenCalledTimes(1));

    it('should call map addLayer function', () =>
      expect(component.map.addLayer).toHaveBeenCalledTimes(1));
  });

  describe('addDragBox()', () => {
    beforeEach(() => {
      component.map = {
        ...component.map,
        addInteraction: jest.fn(),
        setSize: jest.fn(),
        setView: jest.fn(),
      };

      component['addDragBox']();
    });

    it('should call map addInteraction function', () =>
      expect(component.map.addInteraction).toHaveBeenNthCalledWith(1, component['dragBox']));
  });

  describe('private updateAssociatedLabels()', () => {
    describe('when there are features', () => {
      const clearSpy = jest.fn();
      const addFeaturesSpy = jest.fn();
      const labelsLayerStub = {
        getSource: jest.fn(() => ({
          clear: clearSpy,
          addFeatures: addFeaturesSpy,
        })),
        setSource: jest.fn(),
      } as any;

      beforeEach(() => {
        jest.spyOn(component as any, 'setBoundingBoxNames').mockImplementation();
        pdfHelperServiceStub.getAssociatedLabels.mockReturnValue(featuresStub);

        component['labelsLayer'] = labelsLayerStub;
        component.pageNumber = 1;
        component.compositeData = getCompositeDataStub();
        component.fields = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];
        component.labelColors = [];
        component['imageExtent'] = [0, 0, 1292, 1674];
        component.showLabels = false;

        component['updateAssociatedLabels']();
      });

      it('should clear all features for the labelsLayer', () =>
        expect(clearSpy).toHaveBeenCalledTimes(1));

      it('should call pdfHelperService getAssociatedLabels function', () =>
        expect(pdfHelperServiceStub.getAssociatedLabels).toHaveBeenNthCalledWith(
          1,
          component.pageNumber,
          component.compositeData,
          component.fields,
          component.labelColors,
          component['imageExtent'],
          component.showLabels,
          component.isSponsorUser,
          component.multipleDisplayThresholdsIsActive
        ));

      it('should addFeatures to labelsLayer', () =>
        expect(addFeaturesSpy).toHaveBeenNthCalledWith(1, featuresStub));

      it('should call setBoundingBoxNames function', () =>
        expect(component['setBoundingBoxNames']).toHaveBeenCalledTimes(1));
    });

    describe('when there are NO features', () => {
      const clearSpy = jest.fn();
      const addFeaturesSpy = jest.fn();
      const labelsLayerStub = {
        getSource: jest.fn(() => ({
          clear: clearSpy,
          addFeatures: addFeaturesSpy,
        })),
        setSource: jest.fn(),
      } as any;

      beforeEach(() => {
        jest.spyOn(component as any, 'setBoundingBoxNames').mockImplementation();
        pdfHelperServiceStub.getAssociatedLabels.mockReturnValue([]);

        component['labelsLayer'] = labelsLayerStub;
        component.pageNumber = 1;
        component.compositeData = getCompositeDataStub();
        component.fields = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];
        component.labelColors = [];
        component['imageExtent'] = [0, 0, 1292, 1674];
        component.showLabels = false;

        component['updateAssociatedLabels']();
      });

      it('should clear all features for the labelsLayer', () =>
        expect(clearSpy).toHaveBeenCalledTimes(1));

      it('should call pdfHelperService getAssociatedLabels function', () =>
        expect(pdfHelperServiceStub.getAssociatedLabels).toHaveBeenNthCalledWith(
          1,
          component.pageNumber,
          component.compositeData,
          component.fields,
          component.labelColors,
          component['imageExtent'],
          component.showLabels,
          component.isSponsorUser,
          component.multipleDisplayThresholdsIsActive
        ));

      it('should NOT addFeatures to labelsLayer', () =>
        expect(addFeaturesSpy).not.toHaveBeenCalled());

      it('should NOT call setBoundingBoxNames function', () =>
        expect(component['setBoundingBoxNames']).not.toHaveBeenCalled());
    });
  });

  describe('private setBoundingBoxNames()', () => {
    describe('when field does NOT exist', () => {
      const featureStub = {
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'gray'),
          })),
          getText: jest.fn(() => ({
            getText: jest.fn(() => 'halp me'),
          })),
        })),
        get: jest.fn(() => '[2,2,2,2,2,2,2,2]'),
        setStyle: jest.fn(),
      } as any;

      beforeEach(() => {
        jest.spyOn(component.boundingBoxNameMapper, 'set').mockImplementation();
        component.fields = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];
        component['labelsLayer'] = {
          ...component['labelsLayer'],
          getSource: (): any => ({
            clear: jest.fn(),
            forEachFeature: jest.fn(cb => cb(featureStub)),
          }),
        } as any;

        component['setBoundingBoxNames']();
      });

      it('should set boundingBoxNameMapper', () =>
        expect(component.boundingBoxNameMapper.set).toHaveBeenNthCalledWith(
          1,
          '[2,2,2,2,2,2,2,2]',
          'halp me'
        ));
    });
  });

  describe('when field does exist', () => {
    const featureStub = {
      getStyle: jest.fn(() => ({
        getStroke: jest.fn(() => ({
          getColor: jest.fn(() => 'gray'),
        })),
        getText: jest.fn(() => ({
          getText: jest.fn(() => 'halp me'),
        })),
      })),
      get: jest.fn(() => '[2,2,2,2,2,2,2,2]'),
      setStyle: jest.fn(),
    } as any;

    beforeEach(() => {
      jest.spyOn(component.boundingBoxNameMapper, 'set').mockImplementation();
      component['labelsLayer'] = {
        ...component['labelsLayer'],
        getSource: (): any => ({
          clear: jest.fn(),
          forEachFeature: jest.fn(cb => cb(featureStub)),
        }),
      } as any;
      component.fields = [getFieldBaseStub('halp me')];

      component['setBoundingBoxNames']();
    });

    it('should set boundingBoxNameMapper', () =>
      expect(component.boundingBoxNameMapper.set).toHaveBeenNthCalledWith(
        1,
        '[2,2,2,2,2,2,2,2]',
        ''
      ));
  });

  describe('private handlePointerDown()', () => {
    const event = { originalEvent: {} } as any;

    describe('ctrl key not pressed down', () => {
      it('should clear features when there is no features at pixel clicked', () => {
        component.selectorLayer = {
          ...component.selectorLayer,
          getSource: jest.fn(() => ({
            clear: jest.fn(),
          })),
        } as any;
        component.textLayer = {
          ...component.textLayer,
          getSource: jest.fn(() => ({ clear: jest.fn() })),
        } as any;
        component.selectedFeatures = [
          {
            setStyle: jest.fn(),
          } as any,
        ];
        component.map = {
          ...component.map,
          hasFeatureAtPixel: jest.fn(() => false),
          getEventPixel: jest.fn(),
          forEachFeatureAtPixel: jest.fn(),
        };

        component['handlePointerDown'](event);

        expect(component.selectedFeatures.length).toBe(0);
      });

      describe('when there is a feature at pixel clicked', () => {
        beforeEach(() => {
          component.selectorLayer = {
            ...component.selectorLayer,
            getSource: jest.fn(() => ({
              clear: jest.fn(),
            })),
          } as any;
          component.map = {
            ...component.map,
            hasFeatureAtPixel: jest.fn(() => true),
            getEventPixel: jest.fn(),
            forEachFeatureAtPixel: jest.fn(),
          };

          component.selectedFeatures = [];
        });

        describe('and feature was not already selected', () => {
          const featureStub = [
            {
              values_: {
                text: 'mockText',
                labeled: false,
              },
              getId: (): string => '11111111',
              setStyle(): void {
                return;
              },
              getGeometry: (): any => ({
                getCoordinates: (): number[][] => [[1, 2]],
              }),
            } as any,
          ];

          beforeEach(() => {
            jest.spyOn(component.selectedItemsChanged, 'emit').mockImplementation();
            component.selectorLayer = {
              ...component.selectorLayer,
              getSource: jest.fn(() => ({
                clear: jest.fn(),
                addFeature: jest.fn(),
                getFeatures: (): any => {
                  return featureStub;
                },
              })),
            } as any;
            component.selectorLayer.getSource().clear();

            component['selectFeatureCallback'](featureStub[0]);
          });

          it('should add feature to selectedFeatures', () => {
            expect(component.selectedFeatures.length).toBe(1);
          });

          it('should draw a rectangle at feature coordinates', () => {
            expect(component.selectorLayer.getSource().getFeatures().length).toBe(1);
          });

          it('should emit label information', () => {
            expect(component.selectedItemsChanged.emit).toHaveBeenCalled();
          });
        });

        describe('and feature was already selected', () => {
          const feature = {
            values_: {
              text: 'mockText',
              labeled: false,
            },
            getId: (): string => '11111111',
            setStyle(): void {
              return;
            },
            getGeometry: (): any => ({
              getCoordinates: (): number[][] => [[1, 2]],
            }),
          } as any;

          beforeEach(() => {
            component.selectorLayer = {
              ...component.selectorLayer,
              getSource: jest.fn(() => ({
                clear: jest.fn(),
              })),
            } as any;
            component.selectedFeatures.push(feature);
            component['selectFeatureCallback'](feature);
          });

          it('should remove feature from selectedFeatures', () => {
            expect(component.selectedFeatures.indexOf(feature)).toBe(-1);
          });
        });
      });
    });

    describe('when textSource is at the featured pixel', () => {
      const layerStub = jest.fn(() => 'textVectorLayer');

      const featureStub = {
        layerFilter: jest.fn((obj, cb) => cb(layerStub)),
        values_: jest.fn(() => ({
          labeled: 'mock',
        })),
      } as any;

      it('should do some stuff', () => {
        component.textLayer = {
          ...component.textLayer,
          getSource: jest.fn(() => ({ clear: jest.fn() })),
        } as any;
        component.selectedFeatures = [
          {
            setStyle: jest.fn(),
          } as any,
        ];

        component.map = {
          ...component.map,
          getEventPixel: jest.fn(),
          hasFeatureAtPixel: jest.fn().mockImplementationOnce(() => true),
          forEachFeatureAtPixel: jest.fn((obj, cb) => {
            cb(featureStub);
          }),
        };

        component['selectFeatureCallback'] = jest.fn();

        component['handlePointerDown'](event);

        expect(component['selectFeatureCallback']).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('private selectMultipleItems()', () => {
    const featureStub = {
      getStyle: jest.fn(),
      get: jest.fn(() => '[]'),
      setStyle: jest.fn(),
      values_: jest.fn(),
    } as any;

    beforeEach(() => {
      jest.spyOn(component as any, 'addFeature').mockImplementation();
      jest.spyOn(component as any, 'drawRectangleSelection').mockImplementation();

      component['dragBox'] = {
        getGeometry: jest.fn(() => ({
          getExtent: jest.fn().mockImplementation(),
        })),
      } as any;

      component.textLayer = {
        ...component.textLayer,
        getSource: jest.fn(() => ({
          clear: jest.fn(),
          forEachFeatureIntersectingExtent: jest.fn((obj, cb) => cb(featureStub)),
        })),
      } as any;

      component['selectMultipleItems']();
    });

    it('should call addFeature, & drawRectangleSelection functions', () => {
      expect(component.selectedFeatures).toEqual([]);
      expect(component['addFeature']).toHaveBeenNthCalledWith(1, featureStub);
      expect(component['drawRectangleSelection']).toHaveBeenNthCalledWith(1, [featureStub]);
    });
  });

  describe('private clearTextSelected()', () => {
    const featureStub = {
      setStyle: jest.fn(),
      values_: {
        labeled: '[1,1,1,1,0,0,0,0]',
      },
    } as any;

    const clearStub = jest.fn();

    describe('when selectorLayer is NULL', () => {
      beforeEach(() => {
        component.selectorLayer = null;
        component.selectedFeatures = [];
        component['clearTextSelected']();
      });

      it('should NOT call clear selector layers sources', () =>
        expect(clearStub).not.toHaveBeenCalled());

      it('should set textHighlight style', () =>
        expect(featureStub.setStyle).not.toHaveBeenCalled());

      it('should set selectedFeatures to an empty array', () =>
        expect(component.selectedFeatures).toEqual([]));
    });

    describe('when selectorLayer is defined', () => {
      beforeEach(() => {
        component.selectorLayer = {
          ...component.selectorLayer,
          getSource: jest.fn(() => ({
            clear: clearStub,
          })),
        } as any;
        component.selectedFeatures = [featureStub];
        component['clearTextSelected']();
      });

      it('should call clear selector layers sources', () =>
        expect(clearStub).toHaveBeenCalledTimes(1));

      it('should set textHighlight style', () =>
        expect(featureStub.setStyle).toHaveBeenNthCalledWith(1, textHighlight));

      it('should set selectedFeatures to an empty array', () =>
        expect(component.selectedFeatures).toEqual([]));
    });
  });

  describe('private addFeature()', () => {
    const featureStub = {
      setStyle: jest.fn(),
    } as any;

    it('set textHighlightCurrentlySelected style & push the feature into selectedFeatures', () => {
      component['addFeature'](featureStub);

      expect(featureStub.setStyle).toHaveBeenNthCalledWith(1, textHighlightCurrentlySelected);
      expect(component.selectedFeatures).toEqual([featureStub]);
    });
  });

  describe('private drawRectangleSelection()', () => {
    describe('when features length is greater than 0', () => {
      const featuresStub = [
        {
          getStyle: jest.fn(),
          get: jest.fn(() => '[]'),
          setStyle: jest.fn(),
          values_: {
            text: 'mock',
            order: 1,
          },
        },
        {
          getStyle: jest.fn(),
          get: jest.fn(() => '[]'),
          setStyle: jest.fn(),
          values_: {
            text: 'test',
            order: 2,
          },
        },
      ] as any;

      const labelStub = {
        id: '00000000-0000-0000-0000-000000000000',
        label: '',
        page: 1,
        value: {
          text: 'mock test',
          confidence: 1,
          boundingBox: [1, 1, 1, 1, 1, 1, 1, 1],
          required: false,
          verificationState: 'NotRequired',
          incomplete: false,
          incompleteReason: '',
          type: '',
        },
      } as any;

      const clearStub = jest.fn();
      const addFeatureStub = jest.fn();

      beforeEach(() => {
        jest
          .spyOn(indexerHelper, 'getRectangleSelectionFeature')
          .mockImplementation(() => featuresStub[0]);
        jest
          .spyOn(indexerHelper, 'getFeaturesBoundingBoxes')
          .mockImplementation(() => [1, 1, 1, 1, 1, 1, 1, 1]);
        jest.spyOn(component as any, 'clearTextSelected').mockImplementation();
        jest.spyOn(component.selectedItemsChanged, 'emit').mockImplementation();

        component.selectorLayer = {
          ...component.selectorLayer,
          getSource: jest.fn(() => ({
            clear: clearStub,
            addFeature: addFeatureStub,
          })),
        } as any;
        component.selectedFeatures = featuresStub;
        component.currentPage = 1;

        component['drawRectangleSelection'](featuresStub);
      });

      afterEach(() => {
        component.selectorLayer = {
          ...component.selectorLayer,
          getSource: jest.fn(() => ({
            clear: jest.fn(),
          })),
        } as any;
      });

      it('should NOT call clearTextSelected fn', () => {
        expect(component['clearTextSelected']).not.toHaveBeenCalledTimes(1);
      });

      it('should clear the selectorSource and then add the new selected rectangle', () => {
        expect(clearStub).toHaveBeenCalledTimes(1);
        expect(addFeatureStub).toHaveBeenNthCalledWith(1, featuresStub[0]);
      });

      it('should emit selectedItemsChanged', () =>
        expect(component.selectedItemsChanged.emit).toHaveBeenNthCalledWith(1, labelStub));
    });

    describe('when features length is equal to 0', () => {
      const labelStub = {
        label: '',
        page: 1,
        value: {
          text: 'mock test',
          confidence: 1,
          boundingBox: [1, 1, 1, 1, 1, 1, 1, 1],
          required: false,
          verificationState: 'NotRequired',
          incomplete: false,
          incompleteReason: '',
          type: '',
        },
      } as any;

      const clearStub = jest.fn();
      const addFeatureStub = jest.fn();

      beforeEach(() => {
        jest.spyOn(component.selectedItemsChanged, 'emit').mockImplementation();
        jest.spyOn(component as any, 'clearTextSelected').mockImplementation();

        component.selectorLayer = {
          ...component.selectorLayer,
          getSource: jest.fn(() => ({
            clear: clearStub,
            addFeature: addFeatureStub,
          })),
        } as any;

        component['drawRectangleSelection']([]);
      });

      afterEach(() => {
        component.selectorLayer = {
          ...component.selectorLayer,
          getSource: jest.fn(() => ({
            clear: jest.fn(),
          })),
        } as any;
      });

      it('should call clearTextSelected fn', () => {
        expect(component['clearTextSelected']).toHaveBeenCalledTimes(1);
      });

      it('should NOT clear the selectorSource and then add the new selected rectangle', () => {
        expect(clearStub).not.toHaveBeenCalled();
        expect(addFeatureStub).not.toHaveBeenCalled();
      });

      it('should NOT emit selectedItemsChanged', () =>
        expect(component.selectedItemsChanged.emit).not.toHaveBeenNthCalledWith(1, labelStub));
    });
  });

  describe('private showHideLabels()', () => {
    const featureStub = {
      getStyle: jest.fn(() => ({
        getStroke: jest.fn(() => ({
          getColor: jest.fn(() => 'green'),
        })),

        getText: jest.fn(() => ({
          getText: jest.fn(() => 'arial'),
        })),
      })),
      setStyle: jest.fn(),
    } as any;

    it('should set labelHeaderStyle', () => {
      component['labelsLayer'] = {
        ...component['labelsLayer'],
        getSource: (): any => ({
          clear: jest.fn(),
          forEachFeature: jest.fn(cb => cb(featureStub)),
        }),
      } as any;
      component.showLabels = true;
      component.fields = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];
      component['showHideLabels']();

      expect(component.showLabels).toBeTruthy();
      expect(featureStub.setStyle).toHaveBeenNthCalledWith(1, labelHeaderStyle('arial', 'green'));
    });

    it('should set labelHeaderStyleNoLabel', () => {
      component['labelsLayer'] = {
        ...component['labelsLayer'],
        getSource: (): any => ({
          clear: jest.fn(),
          forEachFeature: jest.fn(cb => cb(featureStub)),
        }),
      } as any;
      component.showLabels = false;
      component.fields = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];
      component['showHideLabels']();

      expect(component.showLabels).toBeFalsy();
      expect(featureStub.setStyle).toHaveBeenNthCalledWith(
        1,
        labelHeaderStyleNoLabel('arial', 'green')
      );
    });
  });

  describe('private handlePointerMove()', () => {
    describe('when hoveredItem is NOT null', () => {
      const event = { pixel: [207, 102] } as any;
      const featureStub = {
        getStyle: jest.fn(),
        get: jest.fn(() => '[]'),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;

      beforeEach(() => {
        jest.spyOn(component.highlightField, 'emit').mockImplementation();
        component['hoveredItem'] = featureStub;
        component.map = {
          ...component.map,
          forEachFeatureAtPixel: jest.fn(),
        };
        component['handlePointerMove'](event);
      });

      it('should set hoveredItem to null', () => expect(component['hoveredItem']).toBeNull());

      it('should emit an empty array for highlightField', () =>
        expect(component.highlightField.emit).toHaveBeenNthCalledWith(1, null));
    });

    describe('when boundingbox (labeled) is hovered on', () => {
      const event = { pixel: [207, 102] } as any;
      const featureStub = {
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'green'),
          })),
        })),
        get: jest.fn(() => '[]'),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;

      it('should call style turnOnHighlight & emit the id', () => {
        jest.spyOn(component.highlightField, 'emit');
        component.map = {
          ...component.map,
          forEachFeatureAtPixel: jest.fn((obj, cb) => {
            cb(featureStub);
          }),
        };

        component['handlePointerMove'](event);

        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          turnOnHighlight(
            component['hoveredBoxColor'],
            component.showLabels,
            component['hoveredLabelName']
          )
        );
        expect(component.highlightField.emit).toHaveBeenNthCalledWith(1, '[]');
      });
    });

    describe('when words inside bounding box are hovered on', () => {
      const event = { pixel: [207, 102] } as any;
      const featureStub = {
        get: jest
          .fn()
          .mockImplementationOnce(null)
          .mockImplementation(() => 'mock'),
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'green'),
          })),
        })),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;
      const latestHoveredBoxStub = {
        get: jest.fn(() => 'mock'),
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'green'),
          })),
        })),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;

      it('should call style turnOnHighlight & emit the id', () => {
        jest.spyOn(component.highlightField, 'emit');
        component['latestHoveredBox'] = latestHoveredBoxStub;
        component.map = {
          ...component.map,
          forEachFeatureAtPixel: jest.fn((obj, cb) => {
            cb(featureStub);
          }),
        };

        component['handlePointerMove'](event);

        expect(latestHoveredBoxStub.setStyle).toHaveBeenNthCalledWith(
          1,
          turnOnHighlight(
            component['hoveredBoxColor'],
            component.showLabels,
            component['hoveredLabelName']
          )
        );
        expect(component.highlightField.emit).toHaveBeenNthCalledWith(1, 'mock');
      });
    });

    describe('when hovered item is outside a labeled item', () => {
      const event = { pixel: [207, 102] } as any;
      const featureStub = {
        get: jest.fn().mockImplementation(null),
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'green'),
          })),
        })),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;
      const latestHoveredBoxStub = {
        get: jest.fn(() => null),
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'green'),
          })),
        })),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;

      it('should NOT call style turnOnHighlight NOR emit the id', () => {
        jest.spyOn(component.highlightField, 'emit');
        component['latestHoveredBox'] = latestHoveredBoxStub;
        component.map = {
          ...component.map,
          forEachFeatureAtPixel: jest.fn((obj, cb) => {
            cb(featureStub);
          }),
        };

        component['handlePointerMove'](event);

        expect(latestHoveredBoxStub.setStyle).not.toHaveBeenNthCalledWith(
          1,
          turnOnHighlight(
            component['hoveredBoxColor'],
            component.showLabels,
            component['hoveredLabelName']
          )
        );
        expect(component.highlightField.emit).not.toHaveBeenNthCalledWith(1, 'mock');
      });
    });
  });

  describe('handlePointerMoveArchive()', () => {
    describe('when hoveredItem is NOT null', () => {
      const event = { pixel: [207, 102] } as any;
      const featureStub = {
        getStyle: jest.fn(),
        get: jest.fn(() => '[]'),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;

      beforeEach(() => {
        jest.spyOn(component.highlightField, 'emit').mockImplementation();
        component['hoveredItem'] = featureStub;
        component.map = {
          ...component.map,
          forEachFeatureAtPixel: jest.fn(),
        };
        component['handlePointerMoveArchive'](event);
      });

      it('should set hoveredItem to null', () => expect(component['hoveredItem']).toBeNull());

      it('should emit an empty array for highlightField', () =>
        expect(component.highlightField.emit).toHaveBeenNthCalledWith(1, null));
    });

    describe('when boundingbox (labeled) is hovered on', () => {
      const event = { pixel: [207, 102] } as any;
      const featureStub = {
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'green'),
          })),
          getText: jest.fn(() => ({
            getText: jest.fn(() => DocumentLabelKeys.nonLookupLabels.InvoiceDate),
          })),
        })),
        get: jest.fn(() => '[]'),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;

      it('should call style turnOnHighlight & emit the labelName', () => {
        jest.spyOn(component.highlightField, 'emit');

        component.map.forEachFeatureAtPixel = jest.fn().mockImplementation((obj, cb) => {
          cb(featureStub);
        });

        component['handlePointerMoveArchive'](event);

        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          turnOnHighlight(
            component['hoveredBoxColor'],
            component.showLabels,
            component['hoveredLabelName']
          )
        );
        expect(component.highlightField.emit).toHaveBeenNthCalledWith(
          1,
          DocumentLabelKeys.nonLookupLabels.InvoiceDate
        );
      });
    });
  });

  describe('private highlightBoundingBox()', () => {
    describe('when featureboundingbox id equals passed in boundingboxid', () => {
      const featureStub = {
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'green'),
          })),
          getText: jest.fn(() => ({
            getText: jest.fn(() => 'halp me'),
          })),
        })),
        get: jest.fn(() => '[1,1,1,1,1,1,1,1]'),
        setStyle: jest.fn(),
      } as any;

      beforeEach(() => {
        component.showLabels = true;
        component['labelsLayer'] = {
          ...component['labelsLayer'],
          getSource: (): any => ({
            clear: jest.fn(),
            forEachFeature: jest.fn(cb => cb(featureStub)),
          }),
        } as any;

        component['highlightBoundingBox']('[1,1,1,1,1,1,1,1]');
      });

      it('should set turnOnHighlight style', () =>
        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          turnOnHighlight('green', true, 'halp me')
        ));
    });

    describe('when featureboundingbox id equals passed in boundingboxid', () => {
      const featureStub = {
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'gray'),
          })),
          getText: jest.fn(() => ({
            getText: jest.fn(() => 'halp me'),
          })),
        })),
        get: jest.fn(() => '[2,2,2,2,2,2,2,2]'),
        setStyle: jest.fn(),
      } as any;

      beforeEach(() => {
        component.showLabels = true;
        component['labelsLayer'] = {
          ...component['labelsLayer'],
          getSource: (): any => ({
            clear: jest.fn(),
            forEachFeature: jest.fn(cb => cb(featureStub)),
          }),
        } as any;

        component['highlightBoundingBox']('[1,1,1,1,1,1,1,1]');
      });

      it('should set turnOffHighlight style', () =>
        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          turnOffHighlight('gray', true, 'halp me')
        ));
    });

    describe('when labelName equals passed in boundingboxid', () => {
      const featureStub = {
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'green'),
          })),
          getText: jest.fn(() => ({
            getText: jest.fn(() => 'halp me'),
          })),
        })),
        get: jest.fn(() => '[1,1,1,1,1,1,1,1]'),
        setStyle: jest.fn(),
      } as any;

      beforeEach(() => {
        component.showLabels = true;
        component['labelsLayer'] = {
          ...component['labelsLayer'],
          getSource: (): any => ({
            clear: jest.fn(),
            forEachFeature: jest.fn(cb => cb(featureStub)),
          }),
        } as any;

        component['highlightBoundingBox']('halp me');
      });

      it('should set turnOnHighlight style', () =>
        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          turnOnHighlight('green', true, 'halp me')
        ));
    });

    describe('when featureboundingbox id equals passed in boundingboxid', () => {
      const featureStub = {
        getStyle: jest.fn(() => ({
          getStroke: jest.fn(() => ({
            getColor: jest.fn(() => 'gray'),
          })),
          getText: jest.fn(() => ({
            getText: jest.fn(() => 'halp me'),
          })),
        })),
        get: jest.fn(() => '[2,2,2,2,2,2,2,2]'),
        setStyle: jest.fn(),
      } as any;

      beforeEach(() => {
        component.showLabels = true;
        component['labelsLayer'] = {
          ...component['labelsLayer'],
          getSource: (): any => ({
            clear: jest.fn(),
            forEachFeature: jest.fn(cb => cb(featureStub)),
          }),
        } as any;

        component['highlightBoundingBox']('[1,1,1,1,1,1,1,1]');
      });

      it('should set turnOffHighlight style', () =>
        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          turnOffHighlight('gray', true, 'halp me')
        ));
    });
  });
});
