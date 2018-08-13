import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';


@Component({
  selector: 'app-contracts-count-by-years-chart',
  templateUrl: './contracts-count-by-years-chart.component.html',
  styleUrls: ['./contracts-count-by-years-chart.component.css']
})
export class ContractsCountByYearsChartComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chart: Chart;
  colors = ['#32a6bd',
    '#46aec3',
    '#5ab7ca',
    '#6fc0d0',
    '#84c9d7',
    '#98d2de',
    '#addbe4',
    '#c1e4eb',
    '#d6edf1',
    '#eaf6f8'];
  colorIterator = 0;

  constructor(public dataService: DataService) {
    this.dataService.getContractsCountByYears()
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        res.forEach((data, i) => {
          i = i + 1;
          if (i > this.colors.length) {
            this.colorIterator = 0;
          }
          data.color = this.colors[this.colorIterator++];
        });
        this.chart = new Chart({
          chart: {
            type: 'column'
          },
          title: {
            text: 'Numri i kontratave ndër vite'
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            title: {
              text: 'Numri'
            }
          },
          tooltip: {
            pointFormat: '<span style="color:{series.color}">Numri i kontratave: {point.y}</span><br/>'
          },
          legend: {
            enabled: false
          },
          series: [{
            name: 'Vitet',
            data: res
          }]
        });
      });
  }

  ngOnInit() {
  }
}
