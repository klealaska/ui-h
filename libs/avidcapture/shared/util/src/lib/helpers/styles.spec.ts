import {
  labelHeaderStyleNoLabel,
  labelHeaderStyle,
  turnOnHighlight,
  turnOffHighlight,
} from './styles';

describe('Styles', () => {
  const text = 'testLabel';
  const color = 'FF0000';
  it('should create label Style object for no label features', () => {
    const noLabelStyle = labelHeaderStyleNoLabel(text, color);

    expect(noLabelStyle.getText().getText()).toBe(text);
    expect(noLabelStyle.getStroke().getColor()).toBe(color);
  });

  it('should create label Style object for label features', () => {
    const noLabelStyle = labelHeaderStyle(text, color);

    expect(noLabelStyle.getText().getText()).toBe(text);
    expect(noLabelStyle.getText().getFill().getColor()).toBe(color);
  });

  describe('when rgba is 255, 255, 255, 0', () => {
    it('should create label Style object for label features with transparent stroke', () => {
      const noLabelStyle = labelHeaderStyle(text, 'rgba(255, 255, 255, 0)');

      expect(noLabelStyle.getText().getText()).toBe(text);
      expect(noLabelStyle.getText().getStroke().getColor()).toBe('transparent');
    });
  });

  describe('turnOnHighlight()', () => {
    it('should return a no label Style object when showLabels is set to false', () => {
      const noLabelStyle = turnOnHighlight(color, false, text);

      expect(noLabelStyle.getText().getText()).toBe(text);
      expect(noLabelStyle.getStroke().getColor()).toBe(color);
    });

    it('should return a label Style object when showLabels is set to true', () => {
      const noLabelStyle = turnOnHighlight(color, true, text);

      expect(noLabelStyle.getText().getText()).toBe(text);
      expect(noLabelStyle.getStroke().getColor()).toBe(color);
    });
  });

  describe('turnOffHighlight()', () => {
    it('should return a no label Style object when showLabels is set to false', () => {
      const noLabelStyle = turnOffHighlight(color, false, text);

      expect(noLabelStyle.getText().getText()).toBe(text);
      expect(noLabelStyle.getStroke().getColor()).toBe(color);
    });

    it('should return a label Style object when showLabels is set to false', () => {
      const noLabelStyle = turnOffHighlight(color, true, text);

      expect(noLabelStyle.getText().getText()).toBe(text);
      expect(noLabelStyle.getStroke().getColor()).toBe(color);
    });
  });
});
