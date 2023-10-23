import { LabelColor, LabelValue, UnindexedLine } from '@ui-coe/avidcapture/shared/types';

import { AssociationColors } from './association-colors';
import { indexerHelper } from './indexing-helper';

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
      getCoordinates: (): any => [
        [
          [1, 2],
          [3, 4],
          [1, 5],
          [5, 3],
        ],
      ],
    }),
  },

  {
    values_: {
      text: 'mockTest2',
      labeled: false,
    },
    getId: (): string => '2222222',
    setStyle(): void {
      return;
    },
    getGeometry: (): any => ({
      getCoordinates: (): any => [
        [
          [2, 3],
          [4, 5],
          [4, 6],
          [6, 3],
          [1, 5],
        ],
      ],
    }),
  },
] as any;

function createMockedLines(): UnindexedLine[] {
  const lines: UnindexedLine[] = [];

  for (let i = 0; i < 10; i++) {
    const line: UnindexedLine = {
      number: i,
      words: [],
    };

    for (let j = 0; j < 5; j++) {
      line.words.push({ boundingBox: [] } as any);
    }

    lines.push(line);
  }

  return lines;
}

describe('IndexerHelper', () => {
  describe('getFeaturesBoundingBoxes()', () => {
    it('should get bounding boxes for selected features', () => {
      const boundingBoxValues = indexerHelper.getFeaturesBoundingBoxes(featureStub);

      // get correct bounding box format
      expect(boundingBoxValues.length).toBe(8);
    });
  });

  describe('getRectangleSelectionFeature()', () => {
    it('should get draw selection rectanlge feature', () => {
      const rectangleFeature = indexerHelper.getRectangleSelectionFeature(featureStub);
      const coordinates = (rectangleFeature.getGeometry() as any).flatCoordinates;

      // get correct rectangle geometry format
      expect(coordinates.length).toBe(8);
    });
  });

  describe('convertToUnindexedFeatures()', () => {
    it('should get features from document unindexed lines', () => {
      const linesStub = createMockedLines();

      const features = indexerHelper.convertToUnindexedFeatures(linesStub, [0, 0, 1, 2]);
      const feature = features[0];

      expect(features.length).toBe(50);

      // create correct openlayers feature format
      expect(feature.getId).toBeDefined();
      expect(feature.getGeometry).toBeDefined();
    });
  });

  describe('convertToLabelFeature()', () => {
    it('should convert label to an openlayers feature', () => {
      const labelStub: LabelValue = {
        text: 'test',
        confidence: 10,
        boundingBox: [1, 2, 3, 4, 5, 6],
        required: false,
        verificationState: '',
        incomplete: false,
        incompleteReason: '',
        type: '',
      };
      const labelFeature = indexerHelper.convertToLabelFeature(
        'testlabel',
        labelStub,
        [0, 0, 1, 2]
      );

      expect(labelFeature.getId).toBeDefined();
      expect(labelFeature.getGeometry).toBeDefined();
    });
  });

  describe('getBoundingBoxWithMargin()', () => {
    it('should map new bounding boxes with margin given', () => {
      const xyArr = [
        [-900, 1500],
        [-900, 1400],
        [1000, 1400],
        [1000, 1500],
      ];

      const margin = 5;

      const boundingBoxes = indexerHelper.getBoundingBoxWithMargin(xyArr, margin);

      expect(xyArr[0][0] - margin).toBe(boundingBoxes[0][0]);
      expect(xyArr[0][1] + margin).toBe(boundingBoxes[0][1]);

      expect(xyArr[1][0] - margin).toBe(boundingBoxes[1][0]);
      expect(xyArr[1][1] - margin).toBe(boundingBoxes[1][1]);

      expect(xyArr[2][0] + margin).toBe(boundingBoxes[2][0]);
      expect(xyArr[2][1] - margin).toBe(boundingBoxes[2][1]);

      expect(xyArr[3][0] + margin).toBe(boundingBoxes[3][0]);
      expect(xyArr[3][1] + margin).toBe(boundingBoxes[3][1]);
    });
  });

  describe('getLabelColor()', () => {
    const labelColorsStub: LabelColor[] = [
      {
        labelName: 'test',
        color: 'red',
      },
      {
        labelName: 'mock',
        color: 'blue',
      },
      {
        labelName: 'hello',
        color: 'yellow',
      },
    ];

    describe('when label exists on fields array', () => {
      it('should get color value from labelColors options', () => {
        const color = indexerHelper.getLabelColor('test', labelColorsStub, ['test', 'mock']);
        expect(color).toBe('red');
      });
    });

    describe('when label is not included on fields array', () => {
      it('should get unmatchedColor', () => {
        const color = indexerHelper.getLabelColor('test', labelColorsStub, ['field1', 'fields2']);
        expect(color).toBe(AssociationColors.noColor);
      });
    });
  });

  describe('getPointLocation()', () => {
    it('should calculate point location by a given value', () => {
      const value = 20;
      const result = value * 72 * 2;
      const location = indexerHelper.getPointLocation(value);

      // get correct format
      expect(location).toBe(result);
    });
  });
});
