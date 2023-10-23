import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartLineSetUp, ChartSize } from '@ui-coe/avidcapture/shared/types';
import * as d3 from 'd3';

@Component({
  selector: 'xdc-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss'],
})
export class HorizontalBarChartComponent implements OnChanges {
  @Input() dataReport: any;
  @Input() chartSize: ChartSize;
  @Input() chartSetup: ChartLineSetUp = {
    chartReportName: '',
    axyXLabel: '',
    axyYLabel: '',
    axyXName: '',
    axyYName: '',
  };
  svg;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataReport?.currentValue) {
      this.svg = d3.select(`#${this.chartSetup.chartReportName}`).selectAll('svg').remove();
      this.svg.selectAll('*').remove();
      this.createSvg();
      this.loadBarChart();
    }

    if (changes.chartSize?.currentValue && changes.chartSize?.previousValue != null) {
      this.resize();
    }
  }

  private resize(): void {
    this.svg = d3.select(`#${this.chartSetup.chartReportName}`).selectAll('svg').remove();
    this.svg.selectAll('*').remove();
    this.createSvg();
    this.loadBarChart();
  }

  getReport(): void {
    const csvData = this.objectToCsv(this.dataReport);
    this.download(csvData);
  }

  private createSvg(): void {
    this.svg = d3
      .select(`#${this.chartSetup.chartReportName}`)
      .append('svg')
      .attr(
        'width',
        this.chartSize.width + this.chartSize.margin.left + this.chartSize.margin.right
      )
      .attr(
        'height',
        this.chartSize.height + this.chartSize.margin.top + this.chartSize.margin.bottom
      )
      .append('g')
      .attr('transform', `translate(${this.chartSize.margin.left},${this.chartSize.margin.top})`);
  }

  private loadBarChart(): void {
    const width = this.chartSize.width - this.chartSize.margin.left - this.chartSize.margin.right;
    const height = this.chartSize.height - this.chartSize.margin.top - this.chartSize.margin.bottom;

    // Add X axis
    const x = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, Number(d3.max(this.dataReport, d => d[this.chartSetup.axyXLabel]))]);

    // Add Y axis
    const y = d3.scaleBand().range([0, height]).padding(0.5);
    y.domain(this.dataReport.map(d => d[this.chartSetup.axyYLabel]));

    const yAxisLabel = d3.axisRight(y).tickSize(0);

    // Add rectangles for bar chart
    const bars = this.svg.selectAll('.bar').data(this.dataReport).enter().append('g');

    bars
      .append('rect')
      .attr('fill', '#0574b0')
      .attr('x', x(0))
      .attr('y', d => y(d[this.chartSetup.axyYLabel]))
      .attr('height', y.bandwidth())
      .attr('width', 0)
      .transition()
      .duration(1500)
      .delay((d, i) => i * 250)
      .attr('width', d => x(d[this.chartSetup.axyXLabel]));

    bars
      .append('text')
      .attr('font-size', '13px')
      .attr('y', d => y(d[this.chartSetup.axyYLabel]) + y.bandwidth() / 2 + 4)
      .attr('x', d => x(d[this.chartSetup.axyXLabel]) + 3)
      .text(d => d[this.chartSetup.axyXLabel]);

    // Add y axis label above each bar
    this.svg
      .append('g')
      .call(yAxisLabel)
      .selectAll('text')
      .attr('font-size', '14px')
      .attr('dy', '-1.5em');

    // hide y axis bar
    this.svg.selectAll('.domain').attr('display', 'none');
  }

  private objectToCsv(data: any): any {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = String(row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  }

  private download(data: any): void {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('d3en', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${this.chartSetup.chartReportName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
