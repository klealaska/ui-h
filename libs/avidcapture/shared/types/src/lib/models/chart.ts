export interface ChartSize {
  height: number;
  width: number;
  margin: ChartMargin;
}

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartLineSetUp {
  chartReportName: string;
  axyXLabel: string;
  axyYLabel: string;
  axyXName: string;
  axyYName: string;
}

export interface ChartPieSetUp {
  chartReportName: string;
  pieceLabelName: string;
  pieceCountName: string;
}
