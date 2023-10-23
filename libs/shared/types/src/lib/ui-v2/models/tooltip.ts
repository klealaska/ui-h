import {
  PointerPosition,
  TooltipPosition,
  TooltipStyle,
  originX,
  originY,
  overlayX,
  overlayY,
} from '../types';

export interface Position {
  originX: originX;
  originY: originY;
  overlayX: overlayX;
  overlayY: overlayY;
  offsetY: number;
  offsetX: number;
}

export interface tooltip {
  tooltipText: string;
  tooltipImage?: string;
  tooltipStyle?: TooltipStyle;
  tooltipPosition?: TooltipPosition;
  pointerPosition?: PointerPosition;
  dynamicOverflow?: boolean;
}
