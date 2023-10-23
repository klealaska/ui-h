import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartLineSetUp, ChartSize } from '@ui-coe/avidcapture/shared/types';
import * as d3 from 'd3';

@Component({
  selector: 'xdc-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnChanges {
  @Input() dataReport: any = [];
  @Input() chartSize: ChartSize;
  @Input() chartSetUp: ChartLineSetUp = {
    chartReportName: '',
    axyXLabel: '',
    axyYLabel: '',
    axyXName: '',
    axyYName: '',
  };
  svg;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataReport) {
      this.svg = d3.select(`#${this.chartSetUp.chartReportName}`).selectAll('svg').remove();
      this.svg.selectAll('*').remove();
      this.createSvg();
      this.loadBarChart();
    }

    if (changes.chartSize?.currentValue && changes.chartSize?.previousValue != null) {
      this.resize();
    }
  }

  private resize(): void {
    this.svg = d3.select(`#${this.chartSetUp.chartReportName}`).selectAll('svg').remove();
    this.svg.selectAll('*').remove();
    this.createSvg();
    this.loadBarChart();
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

  private loadBarChart(): void {
    const width = this.chartSize.width - this.chartSize.margin.left - this.chartSize.margin.right;
    const height = this.chartSize.height - this.chartSize.margin.top - this.chartSize.margin.bottom;

    // Set ranges
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the this.dataReport in the domains
    x.domain(
      this.dataReport.map(d => {
        return d[this.chartSetUp.axyXLabel];
      })
    );

    const arrayCounts = this.dataReport.map(d => {
      return d[this.chartSetUp.axyYLabel];
    });

    y.domain([0, Math.max(...arrayCounts) + 5]);

    // Append rectangles for bar chart
    this.svg
      .selectAll('.bar')
      .data(this.dataReport)
      .enter()
      .append('rect')
      .attr('fill', 'steelblue')
      .attr('class', 'bar')
      .attr('x', d => {
        return x(d[this.chartSetUp.axyXLabel]);
      })
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .transition()
      .duration(2000)
      .delay((d, i) => i * 250)
      .attr('y', d => {
        return y(d[this.chartSetUp.axyYLabel]);
      })
      .attr('height', d => {
        return height - y(d[this.chartSetUp.axyYLabel]);
      });

    // Add x axis
    this.svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    // Add y axis
    this.svg.append('g').call(d3.axisLeft(y));
    this.svg
      .selectAll('.text')
      .data(this.dataReport)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('y', height)
      .attr('x', d => {
        return x(d[this.chartSetUp.axyXLabel]);
      })
      .attr('dy', '-5')
      .attr('dx', x.bandwidth() * 0.5)
      .transition()
      .duration(2000)
      .delay((d, i) => i * 250)
      .attr('y', d => {
        return y(d[this.chartSetUp.axyYLabel]);
      })
      .text(d => {
        return d[this.chartSetUp.axyYLabel];
      });

    this.svg.selectAll('text').style('text-anchor', 'middle').attr('font-size', '12px');
    this.svg.selectAll('.label').attr('font-size', '16px');
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
    a.setAttribute('download', `${this.chartSetUp.chartReportName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getReport(): void {
    const csvData = this.objectToCsv(this.dataReport);
    this.download(csvData);
  }
}
