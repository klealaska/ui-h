import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  CompositeDocument,
  FieldBase,
  IndexedLabel,
  LabelColor,
} from '@ui-coe/avidcapture/shared/types';
import {
  indexerHelper,
  labelHeaderStyle,
  labelHeaderStyleNoLabel,
  PdfHelperService,
  rectangleSelectionStyle,
  textHighlight,
  textHighlightCurrentlySelected,
  textHighlightOff,
  turnOffHighlight,
  turnOnHighlight,
} from '@ui-coe/avidcapture/shared/util';
import { Feature, MapBrowserEvent } from 'ol';
import { platformModifierKeyOnly } from 'ol/events/condition';
import { Geometry } from 'ol/geom';
import { DragBox } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'xdc-document-canvas',
  templateUrl: './document-canvas.component.html',
  styleUrls: ['./document-canvas.component.scss'],
})
export class DocumentCanvasComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() loadedPdf: PDFDocumentProxy;
  @Input() pageNumber = 1;
  @Input() currentPage = 1;
  @Input() fields: FieldBase<string>[];
  @Input() compositeData: CompositeDocument;
  @Input() labelColors: LabelColor[];
  @Input() showLabels = false;
  @Input() rotateLeft: number;
  @Input() rotateRight: number;
  @Input() zoomIn: number;
  @Input() zoomOut: number;
  @Input() boundingBoxToHighlight = '';
  @Input() isArchive = false;
  @Input() isReadOnlyMode = false;
  @Input() maxUnindexedPages = 1;
  @Input() isSponsorUser = false;
  @Input() disableHighlight = false;
  @Input() multipleDisplayThresholdsIsActive = false;
  @Output() selectedItemsChanged = new EventEmitter<IndexedLabel>();
  @Output() updatePageNumber = new EventEmitter<number>();
  @Output() highlightField = new EventEmitter<string>();
  @Output() visibilityChange = new EventEmitter<number>();

  @ViewChild('olDiv', { static: true }) olDiv: ElementRef;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  map: any;
  boundingBoxNameMapper = new Map<string, string>();
  isLandscapePDF = false;
  selectedFeatures: Feature<Geometry>[] = [];
  textLayer: VectorLayer<VectorSource<Geometry>>;
  selectorLayer: VectorLayer<VectorSource<Geometry>>;
  height = 0;
  width = 0;

  private imageExtent = [0, 0, 1292, 1674]; // Should match Canvas size
  private ctx: CanvasRenderingContext2D;
  private defaultScale = 2; // Scale of Canvas to OpenLayers div, set to 2 for better quality of PDF
  private dragBox: DragBox;
  private labelsLayer: VectorLayer<VectorSource<Geometry>>;
  private fitZoomOut = false;
  private countZoomOut = 1;
  private hoveredItem: Feature<Geometry> = null;
  private latestHoveredBox: Feature<Geometry> = null;
  private hoveredBoxColor: string = null;
  private hoveredLabelName = '';

  constructor(private pdfHelperService: PdfHelperService) {}

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (this.pageNumber > this.maxUnindexedPages) {
      this.isReadOnlyMode = true;
    }
  }

  ngAfterViewInit(): void {
    this.loadPage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.compositeData?.currentValue && changes.compositeData.previousValue != undefined) {
      this.clearTextSelected();
      if (this.loadedPdf) {
        this.updateAssociatedLabels();
      }
    }

    if (
      changes.rotateLeft?.currentValue &&
      changes.rotateLeft.previousValue != undefined &&
      this.pageNumber === this.currentPage
    ) {
      this.rotatePageLeft();
    }

    if (
      changes.rotateRight?.currentValue &&
      changes.rotateRight.previousValue != undefined &&
      this.pageNumber === this.currentPage
    ) {
      this.rotatePageRight();
    }

    if (
      changes.zoomIn?.currentValue &&
      changes.zoomIn.previousValue != undefined &&
      this.pageNumber === this.currentPage
    ) {
      this.zoomPageIn();
    }

    if (
      changes.zoomOut?.currentValue &&
      changes.zoomOut.previousValue != undefined &&
      this.pageNumber === this.currentPage
    ) {
      this.zoomPageOut();
    }

    if (changes.showLabels && changes.showLabels.previousValue != undefined) {
      this.showHideLabels();
    }

    if (changes.boundingBoxToHighlight) {
      this.highlightBoundingBox(changes.boundingBoxToHighlight.currentValue);
    }

    if (changes.disableHighlight && this.map) {
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') == 'textLayer') {
          this.map.removeLayer(layer);
          this.loadUnindexedText();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.textLayer?.getSource()?.clear();
    this.selectorLayer?.getSource()?.clear();
    this.labelsLayer?.getSource()?.clear();

    this.textLayer?.setSource(undefined);
    this.selectorLayer?.setSource(undefined);
    this.labelsLayer?.setSource(undefined);

    this.map?.removeLayer(this.textLayer);
    this.map?.removeLayer(this.selectorLayer);
    this.map?.removeLayer(this.labelsLayer);

    // removing image layer
    this.map?.getLayers().forEach(l => {
      this.map.removeLayer(l);
    });

    this.map?.setTarget(undefined);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.width < 700) {
      this.width = 700;
    }

    let height = Math.round((this.width / 8.5) * 11) - (this.isLandscapePDF ? 545 : 0);

    if (this.fitZoomOut) {
      height = height / this.countZoomOut;
    } else if (!this.fitZoomOut && this.countZoomOut > 1) {
      height = height / this.countZoomOut;
    }

    this.olDiv.nativeElement.style.width = `${this.width}px`;
    this.olDiv.nativeElement.style.height = `${height}px`;
    this.map?.setSize([this.width, height]);

    // Set Timeout to give a delay for setSize to take effect
    setTimeout(() => {
      if (this.isLandscapePDF || !this.fitZoomOut) {
        this.map?.getView().setZoom(0.5);
      }
    }, 10);
  }

  zoomPageOut(): void {
    if (this.isReadOnlyMode && this.defaultScale > 1) {
      this.defaultScale = this.defaultScale - 0.25;
      this.rerenderPage();
    } else {
      const currentMapView = this.map.getView();
      const currentZoom = currentMapView.getZoom();
      if (
        (currentZoom <= 2.6 && !this.isLandscapePDF) ||
        (this.countZoomOut === 1 && !this.isLandscapePDF && currentZoom <= 1.9)
      ) {
        this.fitZoomOut = true;
        this.countZoomOut += 0.1;
        window.dispatchEvent(new Event('resize'));
        this.fitZoomOut = false;
        return;
      }
      this.map.getView().setZoom(currentZoom / 1.1);
    }
  }

  zoomPageIn(): void {
    if (this.isReadOnlyMode) {
      this.defaultScale = this.defaultScale + 0.25;
      this.rerenderPage();
    } else {
      const currentMapView = this.map.getView();
      const currentZoom = currentMapView.getZoom();
      if (currentZoom <= 2.5 && !this.isLandscapePDF && this.countZoomOut > 1.1) {
        this.fitZoomOut = false;
        this.countZoomOut -= 0.1;
        window.dispatchEvent(new Event('resize'));
        return;
      }
      this.map.getView().setZoom(currentZoom * 1.1);
    }
  }

  rotatePageLeft(): void {
    const currentMapView = this.map.getView();
    let rotation = currentMapView.getRotation();
    rotation = rotation - 90;
    currentMapView.setRotation(rotation);
  }

  rotatePageRight(): void {
    const currentMapView = this.map.getView();
    let rotation: number = currentMapView.getRotation();
    rotation = rotation + 90;
    currentMapView.setRotation(rotation);
  }

  private loadPage(): void {
    this.loadPdfPage()
      .then(() => {
        if (this.isReadOnlyMode) {
          this.olDiv.nativeElement.style.display = 'none';
          return;
        }

        if (this.isArchive) {
          this.loadArchivedLayers();
        } else {
          this.loadIndexingLayers();
        }
        this.canvas.nativeElement.style.display = 'none';
      })
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });
  }

  private async loadPdfPage(): Promise<void> {
    const pdfPage = await this.loadedPdf.getPage(this.pageNumber);
    const rotate = pdfPage._pageInfo?.rotate;
    const [x, y, w, h] = pdfPage._pageInfo.view;

    // Attempting to have clearcut logic to auto determine landscape pdfs
    if ((rotate === 0 && w > h) || (rotate === 90 && h > w)) {
      this.isLandscapePDF = true;
      this.defaultScale = this.isReadOnlyMode ? 1.5 : 2;
    }
    const viewport = pdfPage.getViewport({ scale: this.defaultScale });

    this.canvas.nativeElement.height = viewport.height;
    this.canvas.nativeElement.width = viewport.width;
    this.imageExtent = [0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height];
    this.width = document.getElementById('docViewer')?.clientWidth;

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: this.ctx,
      viewport,
    };
    await pdfPage.render(renderContext).promise;

    if (!this.isReadOnlyMode) {
      this.map = this.pdfHelperService.initializeMap();
      this.map.setTarget(`olDiv-${this.pageNumber}`);
      this.map.on('pointerdown', this.handlePointerDown);
      this.map.on(
        'pointermove',
        this.isArchive ? this.handlePointerMoveArchive : this.handlePointerMove
      );

      // Export the canvas (which contains the PDF) to a base 64 image URL for loading into OpenLayers
      const imageUri = this.pdfHelperService.isModernBrowser()
        ? this.canvas.nativeElement.toDataURL('image/webp', 1)
        : this.canvas.nativeElement.toDataURL('image/jpeg', 1);

      this.loadImageIntoOpenLayers(imageUri);
    }
  }

  private async rerenderPage(): Promise<void> {
    const pdfPage = await this.loadedPdf.getPage(this.pageNumber);
    const viewport = pdfPage.getViewport({ scale: this.defaultScale });

    this.canvas.nativeElement.height = viewport.height;
    this.canvas.nativeElement.width = viewport.width;
    this.imageExtent = [0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height];
    this.width = document.getElementById('docViewer')?.clientWidth;

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: this.ctx,
      viewport,
    };
    await pdfPage.render(renderContext).promise;
  }

  //#region OpenLayers Setup
  private loadImageIntoOpenLayers(imageUri: string): void {
    const imageLayer = this.pdfHelperService.createImageLayer(
      this.pdfHelperService.createImageSource(imageUri, this.imageExtent)
    );
    const mapView = this.pdfHelperService.createMapView(this.imageExtent);

    this.map.addLayer(imageLayer);
    this.map.setView(mapView);
    window.dispatchEvent(new Event('resize'));
  }

  private loadArchivedLayers(): void {
    this.loadAssociatedLabels();
  }

  private loadIndexingLayers(): void {
    this.loadUnindexedText();
    this.loadAssociatedLabels();
    this.loadSelectorLayer();
    this.addDragBox();
  }

  private loadUnindexedText(): void {
    this.selectedFeatures = [];
    const filteredText = this.compositeData.unindexed?.pages.filter(
      p => p.number === this.pageNumber
    );

    if (!filteredText || filteredText.length === 0) {
      return;
    }

    const features = indexerHelper.convertToUnindexedFeatures(
      filteredText[0].lines,
      this.imageExtent
    );

    this.textLayer = this.pdfHelperService.createVectorLayer(
      'textLayer',
      this.disableHighlight ? textHighlightOff : textHighlight,
      new VectorSource({ features })
    );

    this.map.addLayer(this.textLayer);
  }

  private loadAssociatedLabels(): void {
    const features = this.pdfHelperService.getAssociatedLabels(
      this.pageNumber,
      this.compositeData,
      this.fields,
      this.labelColors,
      this.imageExtent,
      this.showLabels,
      this.isSponsorUser,
      this.multipleDisplayThresholdsIsActive
    );

    const source = new VectorSource({ features });
    this.labelsLayer = this.pdfHelperService.createVectorLayer(
      'labelsLayer',
      this.disableHighlight ? textHighlightOff : textHighlight,
      source
    );

    this.map.addLayer(this.labelsLayer);
    this.setBoundingBoxNames();
  }

  private loadSelectorLayer(): void {
    this.selectorLayer = this.pdfHelperService.createVectorLayer(
      'selectorLayer',
      rectangleSelectionStyle,
      new VectorSource()
    );

    this.map.addLayer(this.selectorLayer);
  }

  private addDragBox(): void {
    this.dragBox = new DragBox({
      className: 'ol-dragbox',
      condition(event): boolean {
        return !platformModifierKeyOnly(event);
      },
    });

    this.map.addInteraction(this.dragBox);

    this.dragBox.on('boxend', this.selectMultipleItems);
  }

  private updateAssociatedLabels(): void {
    const features = this.pdfHelperService.getAssociatedLabels(
      this.pageNumber,
      this.compositeData,
      this.fields,
      this.labelColors,
      this.imageExtent,
      this.showLabels,
      this.isSponsorUser,
      this.multipleDisplayThresholdsIsActive
    );

    this.labelsLayer?.getSource()?.clear();

    if (features.length === 0) {
      return;
    }

    this.labelsLayer?.getSource()?.addFeatures(features);
    this.setBoundingBoxNames();
  }

  private setBoundingBoxNames(): void {
    this.labelsLayer?.getSource()?.forEachFeature(feature => {
      const featureStyle: Style = feature.getStyle() as Style;
      let labelText = featureStyle.getText().getText() as string;
      const field = this.fields.find(x => x.key === labelText);
      labelText = field ? field.labelDisplayName : labelText;
      this.boundingBoxNameMapper.set(feature?.get('id'), labelText);
    });
  }

  private handlePointerDown = (event: MapBrowserEvent<UIEvent>): void => {
    if (!platformModifierKeyOnly(event)) {
      const eventPixel = this.map.getEventPixel(event.originalEvent);

      if (this.map.hasFeatureAtPixel(eventPixel, this.textLayer.getSource())) {
        this.map.forEachFeatureAtPixel(eventPixel, this.selectFeatureCallback, {
          layerFilter: l => {
            // Filters to only allow selection on the selectable text layer
            return l?.get('name') === 'textLayer';
          },
        });
      } else {
        this.clearTextSelected();
      }
    }
  };

  private selectMultipleItems = (): void => {
    this.selectedFeatures = [];

    const extent = this.dragBox.getGeometry().getExtent();
    const features: Feature<Geometry>[] = [];
    this.textLayer
      .getSource()
      .forEachFeatureIntersectingExtent(extent, (feature: Feature<Geometry>) => {
        features.push(feature);
        this.addFeature(feature);
      });

    this.drawRectangleSelection(features);
  };

  private selectFeatureCallback = (feature: Feature<Geometry>): void => {
    if (this.selectedFeatures.indexOf(feature) === -1 && !feature['values_'].labeled) {
      this.addFeature(feature);
    } else {
      this.selectedFeatures.splice(this.selectedFeatures.indexOf(feature), 1);
      feature.setStyle(this.disableHighlight ? textHighlightOff : textHighlight);
    }

    this.drawRectangleSelection(this.selectedFeatures);
  };

  private clearTextSelected(): void {
    this.selectorLayer?.getSource()?.clear();
    this.selectedFeatures?.forEach(feature => {
      feature?.setStyle(this.disableHighlight ? textHighlightOff : textHighlight);
    });
    this.selectedFeatures = [];
  }

  private addFeature(feature: Feature<Geometry>): void {
    feature.setStyle(textHighlightCurrentlySelected);
    this.selectedFeatures.push(feature);
  }

  private drawRectangleSelection(features: Feature<Geometry>[]): void {
    if (features.length === 0) {
      this.clearTextSelected();
      return;
    }

    const rectangle = indexerHelper.getRectangleSelectionFeature(features);

    this.selectorLayer.getSource().clear();
    this.selectorLayer.getSource().addFeature(rectangle);

    const textSelected = this.selectedFeatures
      .sort((a: Feature<Geometry>, b: Feature<Geometry>) =>
        a['values_'].order > b['values_'].order ? 1 : -1
      )
      .map((feature: Feature<Geometry>) => feature['values_'].text)
      .join(' ');

    const label: IndexedLabel = {
      id: '00000000-0000-0000-0000-000000000000',
      label: '',
      page: this.pageNumber,
      value: {
        text: textSelected,
        confidence: 1,
        boundingBox: indexerHelper.getFeaturesBoundingBoxes(this.selectedFeatures),
        required: false,
        verificationState: 'NotRequired',
        incomplete: false,
        incompleteReason: '',
        type: '',
      },
    };

    this.selectedItemsChanged.emit(label);
  }

  private showHideLabels(): void {
    this.labelsLayer?.getSource()?.forEachFeature(feature => {
      const featureStyle: Style = feature.getStyle() as Style;
      const labelColor: string = featureStyle.getStroke().getColor() as string;
      let labelText = featureStyle.getText().getText() as string;
      const field = this.fields.find(x => x.key === labelText);

      labelText = field ? field.labelDisplayName : labelText;

      if (this.showLabels) {
        feature.setStyle(labelHeaderStyle(labelText, labelColor));
      } else {
        feature.setStyle(labelHeaderStyleNoLabel(labelText, labelColor));
      }
    });
  }

  private handlePointerMove = (event: MapBrowserEvent<UIEvent>): void => {
    if (this.hoveredItem !== null) {
      this.hoveredItem.setStyle(
        turnOffHighlight(this.hoveredBoxColor, this.showLabels, this.hoveredLabelName)
      );
      this.hoveredItem = null;
      this.highlightField.emit(null);
    }

    this.map.forEachFeatureAtPixel(event.pixel, (f: Feature<Geometry>) => {
      if (f?.get('labeled')) {
        this.latestHoveredBox = f;
        this.hoveredItem = f;
        this.hoveredBoxColor = (this.hoveredItem.getStyle() as any).getStroke().getColor();
        this.hoveredLabelName = this.boundingBoxNameMapper?.get(this.hoveredItem?.get('id'));
        this.hoveredItem.setStyle(
          turnOnHighlight(this.hoveredBoxColor, this.showLabels, this.hoveredLabelName)
        );
        this.highlightField.emit(this.hoveredItem?.get('id'));
      } else if (this.latestHoveredBox?.get('text')?.includes(f.get('text'))) {
        this.hoveredItem = this.latestHoveredBox;
        this.hoveredBoxColor = (this.hoveredItem.getStyle() as any).getStroke().getColor();
        this.hoveredLabelName = this.boundingBoxNameMapper?.get(this.hoveredItem?.get('id'));
        this.hoveredItem.setStyle(
          turnOnHighlight(this.hoveredBoxColor, this.showLabels, this.hoveredLabelName)
        );
        this.highlightField.emit(this.hoveredItem?.get('id'));
      }
    });
  };

  private handlePointerMoveArchive = (event: MapBrowserEvent<UIEvent>): void => {
    if (this.hoveredItem !== null) {
      this.hoveredItem.setStyle(
        turnOffHighlight(this.hoveredBoxColor, this.showLabels, this.hoveredLabelName)
      );
      this.hoveredItem = null;
      this.highlightField.emit(null);
    }

    this.map.forEachFeatureAtPixel(event.pixel, (f: Feature<Geometry>) => {
      this.latestHoveredBox = f;
      this.hoveredItem = f;
      this.hoveredBoxColor = (this.hoveredItem.getStyle() as any).getStroke().getColor();
      this.hoveredLabelName = this.boundingBoxNameMapper?.get(this.hoveredItem?.get('id'));
      this.hoveredItem.setStyle(
        turnOnHighlight(this.hoveredBoxColor, this.showLabels, this.hoveredLabelName)
      );
      this.highlightField.emit((this.hoveredItem.getStyle() as any).getText().getText());
    });
  };

  private highlightBoundingBox(boundingBoxId: string): void {
    this.labelsLayer?.getSource()?.forEachFeature(feature => {
      const featureStyle: Style = feature.getStyle() as Style;
      const labelColor: string = featureStyle.getStroke().getColor() as string;
      const featureBoundingBoxId = feature?.get('id');
      const labelName = featureStyle.getText().getText() as string;

      if (featureBoundingBoxId === boundingBoxId) {
        feature.setStyle(turnOnHighlight(labelColor, this.showLabels, labelName));
      } else if (labelName === boundingBoxId || labelName === boundingBoxId.replace(/\s/g, '')) {
        feature.setStyle(turnOnHighlight(labelColor, this.showLabels, labelName));
      } else {
        feature.setStyle(turnOffHighlight(labelColor, this.showLabels, labelName));
      }
    });
  }
  //#endregion
}
