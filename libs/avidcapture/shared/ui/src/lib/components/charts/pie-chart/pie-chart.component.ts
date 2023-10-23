/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartPieSetUp, ChartSize } from '@ui-coe/avidcapture/shared/types';
import * as d3 from 'd3';

@Component({
  selector: 'xdc-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnChanges {
  @Input() dataReport: any = [];
  @Input() chartSize: ChartSize;
  @Input() chartSetUp: ChartPieSetUp = {
    chartReportName: '',
    pieceCountName: '',
    pieceLabelName: '',
  };

  private radius: number;
  private colors;
  private svg;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataReport) {
      this.radius = Math.min(this.chartSize.width, this.chartSize.height) / 2 - 2;
      this.svg = d3.select(`#${this.chartSetUp.chartReportName}`).selectAll('svg').remove();
      this.svg.selectAll('*').remove();
      this.createSvg();
      this.createColors();
      this.loadPieChart();
    }

    if (changes.chartSize?.currentValue && changes.chartSize?.previousValue != null) {
      this.resize();
    }
  }

  getReport(): void {
    const csvData = this.objectToCsv(this.dataReport);
    this.download(csvData);
  }

  private resize(): void {
    this.radius = Math.min(this.chartSize.width, this.chartSize.height) / 2 - 2;
    this.svg = d3.select(`#${this.chartSetUp.chartReportName}`).selectAll('svg').remove();
    this.svg.selectAll('*').remove();
    this.createSvg();
    this.loadPieChart();
  }

  private createSvg(): void {
    this.svg = d3
      .select(`#${this.chartSetUp.chartReportName}`)
      .append('svg')
      .attr('width', this.chartSize.width)
      .attr('height', this.chartSize.height)
      .append('g')
      .attr('transform', `translate( ${this.chartSize.width / 3} , ${this.chartSize.height / 2})`);
  }

  private createColors(): void {
    if (this.dataReport.length === 1) {
      this.colors = d3.scaleOrdinal(['#0574b0']);
    } else {
      let colorScheme = d3.schemeBlues[this.dataReport.length];
      colorScheme = d3.quantize(t => d3.interpolateBlues(t * 0.8 + 0.1), this.dataReport.length);
      this.colors = d3.scaleOrdinal(colorScheme);
    }
  }

  private loadPieChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d[this.chartSetUp.pieceCountName]));
    const arc = d3.arc().innerRadius(0).outerRadius(this.radius);

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr(
        'style',
        `position: absolute;
        background-color:white;
        border:1px solid;
        border-radius:10px;
        padding:10px;
        display:none;`
      );

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.dataReport))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => this.colors(i))
      .attr('stroke', '#fff')
      .style('stroke-width', '1.5px')
      .on('mousemove', (event, d) => {
        tooltip.text(
          `${d.data[this.chartSetUp.pieceLabelName]} - ${d.data[this.chartSetUp.pieceCountName]}`
        );

        tooltip.style('left', `${(event.pageX as number) + 10}px`);
        tooltip.style('top', `${(event.pageY as number) - 25}px`);
        tooltip.style('display', 'inline-block');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      })
      .transition()
      .duration(1000)
      .attrTween('d', d => {
        const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return (t: number): string => {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    this.generatePieLegend(pie);
  }

  private generatePieLegend(pie: any): void {
    const legendX = this.radius + 10;
    const legend = this.svg
      .selectAll('.legend')
      .data(pie(this.dataReport))
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${legendX},${i * 21 * -1})`);

    legend
      .append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', (d, i) => this.colors(i));

    legend
      .append('text')
      .text(
        d => `${d.data[this.chartSetUp.pieceLabelName]} - ${d.data[this.chartSetUp.pieceCountName]}`
      )
      .style('font-size', 16)
      .attr('y', 15)
      .attr('x', 30);
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
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${this.chartSetUp.chartReportName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
