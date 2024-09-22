import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { DataService, BudgetItem } from '../data.service';

@Component({
  selector: 'pb-piechart',
  template: `<svg
    width="400"
    height="400"
    aria-label="Budget Pie Chart"
  ></svg>`,
  styles: [
    `
      svg {
        font-family: Arial, sans-serif;
      }
    `,
  ],
})
export class PiechartComponent implements OnInit {
  private data: BudgetItem[] = [];
  private svg: any;
  private width = 400;
  private height = 400;

  constructor(private el: ElementRef, private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.dataService.getBudgetData().subscribe((data: BudgetItem[]) => {
      this.data = data;
      this.createChart();
    });
  }

  private createChart() {
    const radius = Math.min(this.width, this.height) / 2;

    d3.select(this.el.nativeElement).select('svg').selectAll('*').remove();

    this.svg = d3
      .select(this.el.nativeElement)
      .select('svg')
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

    const color = d3
      .scaleOrdinal()
      .range([
        '#98abc5',
        '#8a89a6',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00',
      ]);

    const pie = d3.pie<BudgetItem>().value((d) => d.budget);
    const arc = d3
      .arc<d3.PieArcDatum<BudgetItem>>()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = this.svg
      .selectAll('.arc')
      .data(pie(this.data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .style('fill', (d: d3.PieArcDatum<BudgetItem>, i: number) =>
        color(i.toString())
      );

    arcs
      .append('text')
      .attr(
        'transform',
        (d: d3.PieArcDatum<BudgetItem>) => `translate(${arc.centroid(d)})`
      )
      .attr('dy', '.35em')
      .text((d: d3.PieArcDatum<BudgetItem>) => d.data.title);
  }
}
