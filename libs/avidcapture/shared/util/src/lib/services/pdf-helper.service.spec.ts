import { TestBed } from '@angular/core/testing';
import {
  getCompositeDataStub,
  getFieldBaseStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys } from '@ui-coe/avidcapture/shared/types';
import {
  AssociationColors,
  indexerHelper,
  labelHeaderStyle,
  labelHeaderStyleNoLabel,
  textHighlight,
} from '@ui-coe/avidcapture/shared/util';
import { Map, View } from 'ol';
import { platformModifierKeyOnly } from 'ol/events/condition';
import { getCenter } from 'ol/extent';
import { defaults, DragPan, MouseWheelZoom } from 'ol/interaction';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
jest.mock('ol/source/Vector');

import { PdfHelperService } from './pdf-helper.service';

const imageExtent = [0, 0, 0, 0];

const projectionStub = new Projection({
  code: 'xkcd-image',
  units: 'pixels',
  extent: imageExtent,
});

const environmentStub = {
  lookupDisplayThreshold: '',
  nonLookupDisplayThreshold: '',
};

describe('PdfHelperService', () => {
  let service: PdfHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    });

    service = TestBed.inject(PdfHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeMap()', () => {
    beforeEach(() => {
      service.initializeMap();
    });

    it('should return an openlayers Map', () => {
      expect.objectContaining(
        new Map({
          controls: [],
          interactions: defaults({
            dragPan: false,
            mouseWheelZoom: false,
            doubleClickZoom: false,
          }).extend([
            new DragPan({
              condition(event): boolean {
                return platformModifierKeyOnly(event);
              },
            }),
            new MouseWheelZoom({
              condition: platformModifierKeyOnly,
            }),
          ]),
        })
      );
    });
  });

  describe('createImageLayer()', () => {
    const sourceStub = new VectorSource() as any;

    beforeEach(() => {
      service.createImageLayer(sourceStub);
    });

    it('should return an openlayers ImageLayer', () => {
      expect.objectContaining(
        new ImageLayer({
          source: sourceStub,
          name: 'imageLayer',
        } as any)
      );
    });
  });

  describe('createVectorLayer()', () => {
    const sourceStub = new VectorSource() as any;

    beforeEach(() => {
      service.createVectorLayer('mockLayer', textHighlight, sourceStub);
    });

    it('should return an openlayers VectorLayer', () => {
      expect.objectContaining(
        new VectorLayer({
          name: 'mockLayer',
          style: textHighlight,
          source: sourceStub,
        } as any)
      );
    });
  });

  describe('createMapView()', () => {
    beforeEach(() => {
      service.createMapView(imageExtent);
    });

    it('should return an openlayers View', () => {
      expect.objectContaining(
        new View({
          projection: projectionStub,
          extent: imageExtent,
          center: getCenter(imageExtent),
          zoom: 1,
          showFullExtent: true,
          constrainRotation: 4,
        })
      );
    });
  });

  describe('createProjection()', () => {
    beforeEach(() => {
      service.createProjection(imageExtent);
    });

    it('should return an openlayers Projection', () => {
      expect.objectContaining(projectionStub);
    });
  });

  describe('createImageSource()', () => {
    beforeEach(() => {
      service.createImageSource('', imageExtent);
    });

    it('should return an openlayers Static', () => {
      expect.objectContaining(
        new Static({
          url: '',
          projection: projectionStub,
          imageExtent,
        })
      );
    });
  });

  describe('getAssociatedLabels()', () => {
    describe('when filteredLabels does NOT equal 0 && label confidence is below threshold', () => {
      const featureStub = {
        getStyle: jest.fn(),
        get: jest.fn(() => '[]'),
        set: jest.fn(),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.indexed.labels.pop();
      compositeDataStub.indexed.labels[0].value.confidence = 0.5;
      const fieldsStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType)];

      beforeEach(() => {
        jest.spyOn(indexerHelper, 'convertToLabelFeature').mockImplementation(() => featureStub);
        jest.spyOn(indexerHelper, 'getLabelColor').mockImplementation(() => 'red');
        jest.spyOn(service as any, 'canDisplayBoundingBox').mockImplementation();
        fieldsStub[0].displayThreshold.view = 100;

        service.getAssociatedLabels(
          1,
          compositeDataStub,
          fieldsStub,
          [],
          imageExtent,
          false,
          false,
          false
        );
      });

      it('should call canDisplayBoundingBox fn', () =>
        expect(service['canDisplayBoundingBox']).toHaveBeenNthCalledWith(
          1,
          compositeDataStub.indexed.labels,
          compositeDataStub.indexed.labels[0],
          fieldsStub,
          false,
          false
        ));

      it('should set labelHeaderStyleNoLabel style', () =>
        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          labelHeaderStyleNoLabel(
            DocumentLabelKeys.nonLookupLabels.InvoiceType,
            AssociationColors.noColor
          )
        ));
    });

    describe('when filteredLabels does NOT equal 0 && showLabels is true', () => {
      const featureStub = {
        getStyle: jest.fn(),
        get: jest.fn(() => '[]'),
        set: jest.fn(),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.indexed.labels.pop();
      const fieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];

      beforeEach(() => {
        jest.spyOn(indexerHelper, 'convertToLabelFeature').mockImplementation(() => featureStub);
        jest.spyOn(indexerHelper, 'getLabelColor').mockImplementation(() => 'red');
        jest.spyOn(service as any, 'canDisplayBoundingBox').mockImplementation(() => true);

        service.getAssociatedLabels(
          1,
          compositeDataStub,
          fieldsStub,
          [],
          imageExtent,
          true,
          true,
          true
        );
      });

      it('should set labelHeaderStyleNoLabel style', () =>
        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          labelHeaderStyle(DocumentLabelKeys.nonLookupLabels.InvoiceType, 'red')
        ));
    });

    describe('when filteredLabels does NOT equal 0 && showLabels is false', () => {
      const featureStub = {
        getStyle: jest.fn(),
        get: jest.fn(() => '[]'),
        set: jest.fn(),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.indexed.labels.pop();
      const fieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];

      beforeEach(() => {
        jest.spyOn(indexerHelper, 'convertToLabelFeature').mockImplementation(() => featureStub);
        jest.spyOn(indexerHelper, 'getLabelColor').mockImplementation(() => 'red');
        jest.spyOn(service as any, 'canDisplayBoundingBox').mockImplementation(() => true);

        service.getAssociatedLabels(
          1,
          compositeDataStub,
          fieldsStub,
          [],
          imageExtent,
          false,
          false,
          false
        );
      });

      it('should set labelHeaderStyleNoLabel style', () =>
        expect(featureStub.setStyle).toHaveBeenNthCalledWith(
          1,
          labelHeaderStyleNoLabel(DocumentLabelKeys.nonLookupLabels.InvoiceType, 'red')
        ));
    });

    describe('when filteredLabels equals 0', () => {
      const featureStub = {
        getStyle: jest.fn(),
        get: jest.fn(() => '[]'),
        set: jest.fn(),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.indexed.labels.pop();
      const fieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)];

      beforeEach(() => {
        jest.spyOn(indexerHelper, 'convertToLabelFeature').mockImplementation(() => featureStub);
        jest.spyOn(indexerHelper, 'getLabelColor').mockImplementation(() => 'red');

        service.getAssociatedLabels(
          2,
          compositeDataStub,
          fieldsStub,
          [],
          imageExtent,
          true,
          false,
          false
        );
      });

      it('should NOT set labelHeaderStyleNoLabel style', () =>
        expect(featureStub.setStyle).not.toHaveBeenCalled());
    });

    describe('when label is SupplierAddress', () => {
      const featureStub = {
        getStyle: jest.fn(),
        get: jest.fn(() => '[]'),
        set: jest.fn(),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.indexed.labels.pop();
      const fieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress)];

      beforeEach(() => {
        jest.spyOn(indexerHelper, 'convertToLabelFeature').mockImplementation(() => featureStub);
        jest.spyOn(indexerHelper, 'getLabelColor').mockImplementation(() => 'red');

        service.getAssociatedLabels(
          2,
          compositeDataStub,
          fieldsStub,
          [],
          imageExtent,
          true,
          false,
          false
        );
      });

      it('should NOT set labelHeaderStyleNoLabel style', () =>
        expect(featureStub.setStyle).not.toHaveBeenCalled());
    });

    describe('when label is ShipToAddress', () => {
      const featureStub = {
        getStyle: jest.fn(),
        get: jest.fn(() => '[]'),
        set: jest.fn(),
        setStyle: jest.fn(),
        values_: jest.fn(),
      } as any;
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.indexed.labels.pop();
      const fieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress)];

      beforeEach(() => {
        jest.spyOn(indexerHelper, 'convertToLabelFeature').mockImplementation(() => featureStub);
        jest.spyOn(indexerHelper, 'getLabelColor').mockImplementation(() => 'red');

        service.getAssociatedLabels(
          2,
          compositeDataStub,
          fieldsStub,
          [],
          imageExtent,
          true,
          false,
          false
        );
      });

      it('should NOT set labelHeaderStyleNoLabel style', () =>
        expect(featureStub.setStyle).not.toHaveBeenCalled());
    });
  });

  describe('isModernBrowser()', () => {
    describe('when user is using chrome browser', () => {
      jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementationOnce(() => 'chrome');

      it('should return true', () => expect(service.isModernBrowser()).toBeTruthy());
    });

    describe('when user is using firefox browser', () => {
      jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementationOnce(() => 'firefox');

      it('should return true', () => expect(service.isModernBrowser()).toBeTruthy());
    });

    describe('when user is using safari browser', () => {
      jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementationOnce(() => 'safari');

      it('should return true', () => expect(service.isModernBrowser()).toBeTruthy());
    });

    describe('when user is using opera browser', () => {
      jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementationOnce(() => 'opr');

      it('should return true', () => expect(service.isModernBrowser()).toBeTruthy());
    });

    describe('when user is using edge browser', () => {
      jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementationOnce(() => 'edg');

      it('should return true', () => expect(service.isModernBrowser()).toBeTruthy());
    });

    describe('when user is using internet explorer browser', () => {
      jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementationOnce(() => 'msie');

      it('should return false', () => expect(service.isModernBrowser()).toBeFalsy());
    });
  });

  describe('private canDisplayBoundingBox()', () => {
    describe('when DisplayPredictedValues is ON, is a sponsor user, & confidence is higher than display threshold', () => {
      const labels = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      labels[0].value.text = '1';

      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];

      it('should return true', () => {
        fieldBaseStub[0].displayThreshold.view = 80;
        fieldBaseStub[0].displayThreshold.readonly = 99;
        label.value.confidence = 0.95;
        expect(
          service['canDisplayBoundingBox'](labels, label, fieldBaseStub, true, true)
        ).toBeTruthy();
      });
    });

    describe('when DisplayPredictedValues is ON but is not a sponsor user', () => {
      const labels = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      labels[0].value.text = '1';

      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];

      it('should return false', () => {
        fieldBaseStub[0].displayThreshold.view = 100;
        label.value.confidence = 0.5;
        expect(
          service['canDisplayBoundingBox'](labels, label, fieldBaseStub, false, false)
        ).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues is OFF', () => {
      const labels = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      labels[0].value.text = '0';

      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];

      it('should return false', () => {
        fieldBaseStub[0].displayThreshold.view = 100;
        label.value.confidence = 0.5;
        expect(
          service['canDisplayBoundingBox'](labels, label, fieldBaseStub, false, false)
        ).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues label is OFF but user is a Sponsor User', () => {
      const labels = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      labels[0].value.text = '0';

      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];

      it('should return false', () => {
        fieldBaseStub[0].displayThreshold.view = 100;
        label.value.confidence = 0.5;
        expect(
          service['canDisplayBoundingBox'](labels, label, fieldBaseStub, true, true)
        ).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues label is OFF but label confidence is greater than label threshold', () => {
      const labels = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      labels[0].value.text = '0';

      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];

      it('should return true', () => {
        fieldBaseStub[0].displayThreshold.view = 100;
        label.value.confidence = 1;
        expect(
          service['canDisplayBoundingBox'](labels, label, fieldBaseStub, false, false)
        ).toBeTruthy();
      });
    });

    describe('when DisplayPredictedValues label is OFF && label confidence is less than label threshold', () => {
      const labels = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      labels[0].value.text = '0';

      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];

      it('should return false', () => {
        fieldBaseStub[0].displayThreshold.view = 100;
        label.value.confidence = 0.5;
        expect(
          service['canDisplayBoundingBox'](labels, label, fieldBaseStub, false, false)
        ).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues label is not found && is NOT a Sponsor User && confidence is below threshold', () => {
      const labels = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierAlias)];
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];

      it('should return false', () => {
        fieldBaseStub[0].displayThreshold.view = 100;
        label.value.confidence = 0.5;
        expect(
          service['canDisplayBoundingBox'](labels, label, fieldBaseStub, false, false)
        ).toBeFalsy();
      });
    });
  });
});
