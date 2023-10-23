/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartLineSetUp, ChartSize } from '@ui-coe/avidcapture/shared/types';
import * as d3 from 'd3';
import { DateTime } from 'luxon';

@Component({
  selector: 'xdc-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnChanges {
  @Input() dataReport: any[] = [];
  @Input() chartSize: ChartSize;
  @Input() chartSetUp: ChartLineSetUp = {
    chartReportName: '',
    axyXLabel: '',
    axyYLabel: '',
    axyXName: '',
    axyYName: '',
  };

  private svg;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataReport?.currentValue && changes.dataReport?.previousValue != null) {
      this.formatDates();
      this.render();
    }

    if (changes.chartSize?.currentValue && changes.chartSize?.previousValue != null) {
      this.render();
    }
  }

  private render(): void {
    this.svg = d3.select(`#${this.chartSetUp.chartReportName}`).selectAll('svg').remove();
    this.svg.selectAll('*').remove();
    this.createSvg();
    this.dateChart();
  }

  private formatDates(): void {
    const parseTime = d3.timeParse('%b %d, %Y');

    this.dataReport.forEach(d => {
      d[this.chartSetUp.axyXLabel] = DateTime.fromMillis(
        Number(d[this.chartSetUp.axyXLabel]) * 1000
      )
        .toUTC()
        .toFormat('DD');

      d[this.chartSetUp.axyXLabel] = parseTime(d[this.chartSetUp.axyXLabel]);
    });
  }

  private createSvg(): void {
    this.svg = d3
      .select(`#${this.chartSetUp.chartReportName}`)
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

  private dateChart(): void {
    const width = this.chartSize.width - this.chartSize.margin.left - this.chartSize.margin.right;
    const height = this.chartSize.height - this.chartSize.margin.top - this.chartSize.margin.bottom;

    // Define time type  of axy X
    const x = d3.scaleTime().range([5, width]);
    // Extent date value
    x.domain(
      d3.extent(this.dataReport, d => {
        return d[this.chartSetUp.axyXLabel];
      }) as Iterable<Date | number>
    );

    // Define linear type of axy y
    const arrayCounts = this.dataReport.map(d => {
      return d[this.chartSetUp.axyYLabel];
    });
    const y = d3.scaleLinear().range([height, 0]);
    // MIN & Max value on Y axy
    y.domain([0, Math.max(...arrayCounts) + 5]);

    const valueline = d3
      .line()
      .x(d => {
        return x(d[this.chartSetUp.axyXLabel]);
      })
      .y(d => {
        return y(d[this.chartSetUp.axyYLabel]);
      })
      .curve(d3.curveMonotoneX);

    this.svg
      .append('path')
      .data([this.dataReport])
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '3')
      .attr('d', valueline);

    // Animation

    if (this.svg.select('.line').node().getTotalLength === undefined) {
      this.svg.select('.line').node().getTotalLength = (): number => 1;
    }
    const totalLength = this.svg.select('.line').node().getTotalLength();

    this.svg
      .select('.line')
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    const xAxis_woy = d3
      .axisBottom(x)
      .tickFormat(d3.timeFormat('%m-%d-%y'))
      .tickValues(this.dataReport.map(d => d[this.chartSetUp.axyXLabel]));

    this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis_woy)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-55)');

    //  d3 the Y Axis
    this.svg.append('g').call(d3.axisLeft(y));

    // d3 the DOT
    this.svg
      .selectAll('.dot')
      .data(this.dataReport)
      .enter()
      .append('circle') // Uses the enter().append() method
      .attr('class', 'dot') // Assign a class for styling
      .attr('fill', '#677795')
      .attr('stroke', '#fff')
      .attr('cx', d => {
        return x(d[this.chartSetUp.axyXLabel]);
      })
      .attr('cy', d => {
        return y(d[this.chartSetUp.axyYLabel]);
      })
      .attr('r', 5);

    // Dots on the report
    this.svg
      .selectAll('.text')
      .data(this.dataReport)
      .enter()
      .append('text') // Uses the enter().append() method
      .attr('class', 'label') // Assign a class for styling
      .attr('x', d => {
        return x(d[this.chartSetUp.axyXLabel]);
      })
      .attr('y', d => {
        return y(d[this.chartSetUp.axyYLabel]);
      })
      .attr('dy', '-5')
      .text(d => {
        return d[this.chartSetUp.axyYLabel];
      });

    this.svg
      .append('text')
      .attr('x', this.chartSize.width / 2)
      .attr('y', -10)
      .text(this.chartSetUp.axyXName);
  }
}
