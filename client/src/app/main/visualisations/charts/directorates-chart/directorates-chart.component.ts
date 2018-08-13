import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-directorates-chart',
  templateUrl: './directorates-chart.component.html',
  styleUrls: ['./directorates-chart.component.css']
})
export class DirectoratesChartComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chart: Chart;
  colors = [
    '#1e6371',
    '#237484',
    '#288497',
    '#2d95aa',
    '#32a6bd',
    '#46aec3',
    '#5ab7ca',
    '#6fc0d0',
    '#84c9d7',
    '#98d2de'
  ];
  colorIterator = 0;

  constructor(public dataService: DataService) {
    this.dataService.getDirectoratesWithMostContracts()
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {

        const data = res;
        this.chart = new Chart({
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Numri i kontratave në bazë të drejtorive'
          },
          xAxis: {
            type: 'category',
          },
          legend: {
            enabled: false
          },
          colors: this.colors,
          plotOptions: {
            bar: {
              colorByPoint: true,
              pointWidth: 15,
            }
          },
          yAxis: {
            title: {
              text: 'Numri'
            },
            max: 250
          },
          tooltip: {
            pointFormat: '<span style="color:{series.color}">Numri i kontratave: {point.y}</span><br/>'
          },
          series: [{
            name: 'Drejtoritë',
            data: data
          }]
        });
      });
  }

  ngOnInit() {
  }

}
