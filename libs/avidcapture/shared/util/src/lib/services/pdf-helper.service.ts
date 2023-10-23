import { Inject, Injectable } from '@angular/core';
import {
  CompositeDocument,
  DocumentLabelKeys,
  Environment,
  FieldBase,
  IndexedLabel,
  LabelColor,
} from '@ui-coe/avidcapture/shared/types';
import { Feature, Map, View } from 'ol';
import { platformModifierKeyOnly } from 'ol/events/condition';
import { getCenter } from 'ol/extent';
import { Geometry } from 'ol/geom';
import { defaults, DragPan, MouseWheelZoom } from 'ol/interaction';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';

import {
  AssociationColors,
  indexerHelper,
  labelHeaderStyle,
  labelHeaderStyleNoLabel,
} from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class PdfHelperService {
  constructor(@Inject('environment') private environment: Environment) {}

  initializeMap(): Map {
    return new Map({
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
    });
  }

  createImageLayer(source: Static): ImageLayer<Static> {
    return new ImageLayer({
      source,
      properties: { name: 'imageLayer' },
    });
  }

  createVectorLayer(
    name: string,
    style: Style,
    source: VectorSource<Geometry>
  ): VectorLayer<VectorSource<Geometry>> {
    return new VectorLayer({
      properties: { name },
      style,
      source,
    });
  }

  createMapView(extent: number[]): View {
    return new View({
      projection: this.createProjection(extent),
      extent,
      center: getCenter(extent),
      zoom: 1,
      showFullExtent: true,
      constrainRotation: 4, // Limits rotation to 0, 90, 180, 270
    });
  }

  createProjection(extent: number[]): Projection {
    return new Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent,
    });
  }

  createImageSource(imageUri: string, imageExtent: number[]): Static {
    return new Static({
      url: imageUri,
      projection: this.createProjection(imageExtent),
      imageExtent,
    });
  }

  getAssociatedLabels(
    pageNumber: number,
    compositeData: CompositeDocument,
    fields: FieldBase<string>[],
    labelColors: LabelColor[],
    imageExtent: number[],
    showLabels: boolean,
    isSponsorUser: boolean,
    multipleDisplayThresholdsIsActive: boolean
  ): Feature<Geometry>[] {
    const features: Feature<Geometry>[] = [];
    const filteredLabels = compositeData.indexed.labels.filter(
      l =>
        l.page === pageNumber &&
        l.value.text !== '' &&
        l.label !== DocumentLabelKeys.lookupLabels.SupplierAddress &&
        l.label !== DocumentLabelKeys.lookupLabels.ShipToAddress
    );
    const fieldKeys = fields.map(field => field.key);

    if (filteredLabels.length === 0) {
      return features;
    }

    filteredLabels.forEach(label => {
      const feature = indexerHelper.convertToLabelFeature(label.label, label.value, imageExtent);
      const color = indexerHelper.getLabelColor(label.label, labelColors, fieldKeys);

      feature.set('labeled', true);

      if (
        !this.canDisplayBoundingBox(
          compositeData.indexed.labels,
          label,
          fields,
          isSponsorUser,
          multipleDisplayThresholdsIsActive
        )
      ) {
        feature.setStyle(labelHeaderStyleNoLabel(label.label, AssociationColors.noColor));
      } else if (showLabels) {
        feature.setStyle(labelHeaderStyle(label.label, color));
      } else {
        feature.setStyle(labelHeaderStyleNoLabel(label.label, color));
      }
      features.push(feature);
    });

    return features;
  }

  isModernBrowser(): boolean {
    return navigator.userAgent.match(/chrome|chromium|crios|firefox|fxios|safari|opr|edg/i)
      ? true
      : false;
  }

  private canDisplayBoundingBox(
    labels: IndexedLabel[],
    label: IndexedLabel,
    fields: FieldBase<string>[],
    isSponsorUser: boolean,
    multipleDisplayThresholdsIsActive: boolean
  ): boolean {
    const canDisplayPredictedValues =
      Boolean(
        Number(
          labels.find(lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues)
            ?.value.text
        )
      ) ?? false;

    const field = fields.find(fld => fld.key === label.label);
    const displayThreshold = field?.displayThreshold.view * 0.01;
    const readonlyThreshold = field?.displayThreshold.readonly * 0.01;

    return (isSponsorUser &&
      label.value.confidence >= displayThreshold &&
      (multipleDisplayThresholdsIsActive || canDisplayPredictedValues
        ? label.value.confidence < readonlyThreshold
        : true)) ||
      label.value.confidence === 1
      ? true
      : false;

    return (isSponsorUser &&
      label.value.confidence >= displayThreshold &&
      (multipleDisplayThresholdsIsActive ? label.value.confidence < readonlyThreshold : true)) ||
      label.value.confidence === 1
      ? true
      : false;
  }
}
