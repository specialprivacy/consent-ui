import { Component, OnInit, ElementRef } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { range, histogram, max } from 'd3-array';
import { format } from 'd3-format';
import { randomBates } from 'd3-random';
import { axisBottom } from 'd3-axis';

@Component({
  selector: 'cr-app-bubbles',
  templateUrl: './bubbles.component.html',
  styleUrls: ['./bubbles.component.css']
})
export class BubblesComponent implements OnInit {

  el: HTMLElement;

  constructor(private elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.drawHistogram();
  }

  drawHistogram() {
    const data = range(1000).map(randomBates(10));

    const formatCount = format(',.0f');

    const hist = select(this.el).select('#hist');
    const margin = { top: 10, right: 30, bottom: 30, left: 30 };
    const width = +hist.attr('width') - margin.left - margin.right;
    const height = +hist.attr('height') - margin.top - margin.bottom;
    const g = hist
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = scaleLinear<number>()
      .rangeRound([0, width]);

    const generator = histogram<number>()
      .domain(d => x.domain())
      .thresholds(x.ticks(20));

    const bins = generator(data);

    const y = scaleLinear<number>()
      .domain([0, max(bins, d => d.length)])
      .range([height, 0]);

    const bar = g.selectAll('.bar')
      .data(bins)
      .enter().append('g')
      .attr('class', 'bar')
      .attr('transform', d => {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      });

    const barWidth = x(bins[0].x1) - x(bins[0].x0) - 1;

    bar.append('rect')
      .attr('x', 1)
      .attr('width', barWidth)
      .attr('height', d => height - y(d.length));

    const textLoc = (x(bins[0].x1) - x(bins[0].x0)) / 2;

    bar.append('text')
      .attr('dy', '.75em')
      .attr('y', 6)
      .attr('x', textLoc)
      .attr('text-anchor', 'middle')
      .text(d => formatCount(d.length));

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisBottom(x));
  }

}
