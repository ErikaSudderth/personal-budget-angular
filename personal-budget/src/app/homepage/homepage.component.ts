import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { DataService, BudgetResponse } from '../data.service';

interface DataSource {
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
  labels: string[];
}

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  public dataSource: DataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#00FF00',
          '#800080',
          '#FFA500',
        ],
      },
    ],
    labels: [],
  };

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.fetchDataFromBackend().subscribe((res: BudgetResponse) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    });
    // this.http.get('http://localhost:3000/budget').subscribe((res: any) => {
    //   console.log(res.myBudget);
    //   for (var i = 0; i < res.myBudget.length; i++) {
    //     this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
    //     this.dataSource.labels[i] = res.myBudget[i].title;
    //   }
    //   this.createChart();
    // });
  }

  createChart() {
    // var ctx = this.renderer
    //   .selectRootElement('#myChart', true)
    //   .getContext('2d');
    var ctx = this.renderer.selectRootElement('#myChart', true);
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
    });
  }
}
