import { LabelColor, LabelValue, UnindexedLine } from '@ui-coe/avidcapture/shared/types';
import { Feature } from 'ol';
import { Geometry, Point, Polygon } from 'ol/geom';

import { AssociationColors } from './association-colors';

export const indexerHelper = {
  getFeaturesBoundingBoxes(features: Feature<Geometry>[]): number[] {
    const boundingTop = [];
    const boundingLeft = [];
    const boundingRight = [];
    const boundingBottom = [];
    for (const feature of features) {
      const boundingBox = JSON.parse(feature.getId().toString());
      boundingLeft.push(boundingBox[0]);
      boundingTop.push(boundingBox[1]);
      boundingRight.push(boundingBox[2]);
      boundingTop.push(boundingBox[3]);
      boundingRight.push(boundingBox[4]);
      boundingBottom.push(boundingBox[5]);
      boundingLeft.push(boundingBox[6]);
      boundingBottom.push(boundingBox[7]);
    }
    const leftValue = boundingLeft.reduce((a, b) => Math.min(a, b));
    const topValue = boundingTop.reduce((a, b) => Math.min(a, b));
    const rightValue = boundingRight.reduce((a, b) => Math.max(a, b));
    const bottomValue = boundingBottom.reduce((a, b) => Math.max(a, b));

    return [
      leftValue,
      topValue,
      rightValue,
      topValue,
      rightValue,
      bottomValue,
      leftValue,
      bottomValue,
    ];
  },

  getRectangleSelectionFeature(features: Feature<Geometry>[]): Feature<Geometry> {
    let x1 = Infinity;
    let x2 = 0;
    let y1 = Infinity;
    let y2 = 0;
    let rectangleCoordinates: any[] = [];

    features.forEach((feature: Feature<Point>) => {
      const xyArr: any = feature.getGeometry().getCoordinates()[0];

      xyArr.forEach((coordinate: number[]) => {
        x1 = x1 < coordinate[0] ? x1 : coordinate[0];
        y1 = y1 < coordinate[1] ? y1 : coordinate[1];

        x2 = x2 > coordinate[0] ? x2 : coordinate[0];
        y2 = y2 > coordinate[1] ? y2 : coordinate[1];
      });
    });

    const margin = 5;
    x1 = x1 - margin;
    x2 = x2 + margin;
    y1 = y1 - margin;
    y2 = y2 + margin;

    rectangleCoordinates = [
      [x1, y2],
      [x1, y1],
      [x2, y1],
      [x2, y2],
    ];

    const rectangle = new Feature({
      geometry: new Polygon([rectangleCoordinates]),
    });

    rectangle.setProperties({
      id: `ID-${Math.random()}`,
      text: 'Text Selected',
    });

    return rectangle;
  },

  convertToUnindexedFeatures(lines: UnindexedLine[], imageExtent: number[]): Feature<Geometry>[] {
    const features: Feature<Geometry>[] = [];
    let order = 0;

    for (const line of lines) {
      for (const word of line.words) {
        const coordinates = [];
        order++;
        const imageHeight = imageExtent[3] - imageExtent[1];
        for (let i = 0; i < word.boundingBox.length; i += 2) {
          coordinates.push([
            Math.round(this.getPointLocation(word.boundingBox[i], 'width')),
            Math.round(imageHeight - this.getPointLocation(word.boundingBox[i + 1], 'height')),
            /* Note that coordinates are in the following format */
            /* [0.4585, 0.2119, 1.4527, 0.1988, 1.4502, 0.4965, 0.4666, 0.4965] */
            /* 8 numbers represent 4 pairs of (x,y) coordinates of the bounding box corners in the following order:*/
            /* top-left, top-right, bottom-right, bottom-left */
            /* measure is inches*/
            /* must subtract as Y value starts from the bottom (i.e. origin of coordinates is bottom left) */
          ]);
        }

        const feature = new Feature({
          geometry: new Polygon([coordinates]),
        });
        const featureId = JSON.stringify(word.boundingBox);
        feature.setProperties({
          id: featureId,
          text: word.value,
          highlighted: false,
          isOcrProposal: false,
          order,
        });
        feature.setId(featureId);
        features.push(feature);
      }
    }
    return features;
  },

  convertToLabelFeature(name: string, value: LabelValue, imageExtent: number[]): Feature<Geometry> {
    const coordinates = [];
    const margin = 3; // margin set to label features
    const imageHeight = imageExtent[3] - imageExtent[1];
    for (let i = 0; i < value.boundingBox.length; i += 2) {
      coordinates.push([
        Math.round(this.getPointLocation(value.boundingBox[i])),
        Math.round(imageHeight - this.getPointLocation(value.boundingBox[i + 1])),
      ]);
    }

    const feature = new Feature({
      geometry: new Polygon([this.getBoundingBoxWithMargin(coordinates, margin)]),
    });
    const featureId = `label-feature-${name.toString().trim()}`;
    feature.setProperties({
      id: featureId,
      text: value.text,
      highlighted: false,
      isOcrProposal: false,
    });
    feature.setId(featureId);
    return feature;
  },

  getBoundingBoxWithMargin(xyArr: number[][], margin: number): number[][] {
    let x1 = Infinity;
    let x2 = 0;
    let y1 = Infinity;
    let y2 = 0;
    const result: number[][] = [];

    xyArr.forEach((coordinate: number[]) => {
      x1 = x1 < coordinate[0] ? x1 : coordinate[0];
      y1 = y1 < coordinate[1] ? y1 : coordinate[1];

      x2 = x2 > coordinate[0] ? x2 : coordinate[0];
      y2 = y2 > coordinate[1] ? y2 : coordinate[1];
    });

    x1 = x1 - margin;
    x2 = x2 + margin;
    y1 = y1 - margin;
    y2 = y2 + margin;

    result.push([x1, y2], [x1, y1], [x2, y1], [x2, y2]);

    return result;
  },

  getLabelColor(labelName: string, labelColors: LabelColor[], fields: string[]): string {
    const labelColor = labelColors.find(lc => lc.labelName === labelName);

    const color =
      labelColor && fields.includes(labelName) ? labelColor.color : AssociationColors.noColor;
    // removing gray outlined boxes for now
    // : AssociationColors.unmatchedColor;

    return color;
  },

  getPointLocation(value: number): number {
    return value * 72 * 2;
    /* 72 is Dot Per Inch of scanned PDF, 2 is the zoom/scaling */
  },
};
