/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartPieSetUp, ChartSize } from '@ui-coe/avidcapture/shared/types';
import * as d3 from 'd3';

@Component({
  selector: 'xdc-half-pie-chart',
  templateUrl: './half-pie-chart.component.html',
  styleUrls: ['./half-pie-chart.component.scss'],
})
export class HalfPieChartComponent implements OnChanges {
  @Input() dataReport: any = [];
  @Input() mainValue: string;
  @Input() chartSize: ChartSize;
  @Input() chartSetUp: ChartPieSetUp = {
    chartReportName: '',
    pieceCountName: '',
    pieceLabelName: '',
  };

  private radius: number;
  private colors;
  private svg;

  constructor(private cd: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.cd.detectChanges();
    if (changes.mainValue?.currentValue) {
      this.radius = Math.min(this.chartSize.width, this.chartSize.height) / 2;
      this.svg = d3.select(`#${this.chartSetUp.chartReportName}`).selectAll('svg').remove();
      this.svg.selectAll('*').remove();
      this.createSvg();
      this.createColors();
      this.loadHalfPie();
    }

    if (changes.chartSize?.currentValue && changes.chartSize?.previousValue != null) {
      this.resize();
    }
  }

  private resize(): void {
    this.radius = Math.min(this.chartSize.width, this.chartSize.height) / 2;
    this.svg = d3.select(`#${this.chartSetUp.chartReportName}`).selectAll('svg').remove();
    this.svg.selectAll('*').remove();
    this.createSvg();
    this.loadHalfPie();
  }

  private createSvg(): void {
    this.svg = d3
      .select(`#${this.chartSetUp.chartReportName}`)
      .append('svg')
      .attr('width', this.chartSize.width)
      .attr('height', this.chartSize.height)
      .append('g')
      .attr(
        'transform',
        `translate( ${this.chartSize.width / 2} , ${this.chartSize.height / 1.5})`
      );
  }

  private createColors(): void {
    const colorScheme = d3.schemeRdYlGn[this.dataReport.length];
    this.colors = d3.scaleOrdinal().range(colorScheme);
  }

  private loadHalfPie(): void {
    const labelr = this.radius - 5;

    const arc = d3
      .arc<any>()
      .innerRadius(79)
      .outerRadius(this.radius + 25);

    const pie = d3
      .pie<any>()
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180))
      .padAngle(0.02)
      .value((d: any) => d[this.chartSetUp.pieceCountName]);

    const arcs = this.svg
      .selectAll('g.slice')
      .data(pie(this.dataReport))
      .enter()
      .append('g')
      .attr('class', 'slice');

    arcs
      .append('path')
      .attr('fill', (d, i) => {
        return this.colors(i);
      })
      .attr('d', arc)
      .transition()
      .duration((d, i) => i * 700)
      .attrTween('d', d => {
        const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return (t: number): string => {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    arcs
      .append('text')
      .attr('class', 'labels')
      .attr('transform', d => {
        const c = arc.centroid(d),
          xp = c[0],
          yp = c[1],
          hp = Math.sqrt(xp * xp + yp * yp);

        return `translate(${(xp / hp) * labelr},${(yp / hp) * (labelr - 20)} )`;
      })
      .attr('text-anchor', 'middle')
      .text(d => d.data[this.chartSetUp.pieceLabelName])
      .style('font-size', 20);

    this.loadNeedle();

    this.svg
      .append('text')
      .text(() => `${this.mainValue}%`)
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .style('font-size', 45);
  }

  private loadNeedle(): void {
    const rotate = (180 / 100) * parseInt(this.mainValue);
    const needleLength = this.radius - this.radius * 0.07;
    const needleRadius = 10;
    this.svg
      .append('circle')
      .attr('class', 'needle-center')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 10)
      .style('fill', '#87AECE');

    this.svg
      .append('path')
      .attr('class', 'needle')
      .attr('id', 'client-needle')
      .style('fill', '#87AECE')
      .attr('d', this.recalcPointerPos(0, needleLength, needleRadius))
      .transition()
      .ease(d3.easeElasticOut)
      .duration(6000)
      .attr('transform', `translate(0,0) rotate(${rotate})`);
  }

  private recalcPointerPos(perc, needleLength, needleRadius): string {
    const centerX = 0;
    const thetaRad = this.percToRad(perc / 2);
    const centerY = 0;
    const topX = centerX - needleLength * Math.cos(thetaRad);
    const topY = centerY - needleLength * Math.sin(thetaRad);
    const leftX = centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2);
    const leftY = centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2);
    const rightX = centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2);
    const rightY = centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2);
    return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY;
  }

  private percToRad(perc): any {
    return this.degToRad(this.percToDeg(perc));
  }
  private degToRad(deg): any {
    return (deg * Math.PI) / 180;
  }

  private percToDeg(perc): any {
    return perc * 360;
  }

  getReport(): void {
    const csvData = this.objectToCsv(this.dataReport);
    this.download(csvData);
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
