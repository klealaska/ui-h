import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';

// Styles for Highlighting in Text Region

export const textHighlight = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 251, 204, .5)',
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(255, 251, 204, .5)',
  }),
});

export const textHighlightOff = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 251, 204, 0)',
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(255, 251, 204, 0)',
  }),
});

export const textHighlightCurrentlySelected = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 255, 0, .5)',
    width: 3,
  }),
  fill: new Fill({
    color: 'rgba(255, 251, 0, .5)',
  }),
});

export const textHighlightSelected = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 251, 102, .5)',
    width: 3,
  }),
  fill: new Fill({
    color: 'rgba(255, 251, 102, .5)',
  }),
});

export const rectangleSelectionStyle = new Style({
  stroke: new Stroke({
    color: '#333',
    width: 1,
    lineDash: [5, 2],
  }),
});

// Styles for Associations

export function labelHeaderStyleNoLabel(label: string, color: string, width = 2): Style {
  return new Style({
    stroke: new Stroke({
      color,
      width,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.1)',
    }),
    text: new Text({
      textAlign: 'center',
      textBaseline: 'middle',
      // textPlacement: 'line',
      font: '1em Roboto,sans-serif',
      overflow: true,
      offsetY: -0.107,
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0)',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0)',
        width: 3,
      }),
      text: label,
    }),
  });
}

export function labelHeaderStyle(label: string, color: string, width = 2): Style {
  return new Style({
    stroke: new Stroke({
      color,
      width,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.1)',
    }),
    text: new Text({
      textAlign: 'center',
      textBaseline: 'middle',
      // textPlacement: 'line',
      font: '1em Roboto,sans-serif',
      overflow: true,
      offsetY: -0.107,
      fill: new Fill({
        color,
      }),
      stroke: new Stroke({
        color: color === 'rgba(255, 255, 255, 0)' ? 'transparent' : '#FFF',
        width: 3,
      }),
      text: label,
    }),
  });
}

export function turnOnHighlight(color: string, showLabels: boolean, label: string): Style {
  const width = 3;

  if (showLabels) {
    return labelHeaderStyle(label, color, width);
  } else {
    return labelHeaderStyleNoLabel(label, color, width);
  }
}

export function turnOffHighlight(color: string, showLabels: boolean, label: string): Style {
  if (showLabels) {
    return labelHeaderStyle(label, color);
  } else {
    return labelHeaderStyleNoLabel(label, color);
  }
}
