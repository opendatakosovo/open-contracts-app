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
  colors = ['#32a6bd',
    '#2d95aa',
    '#288497',
    '#237484',
    '#1e6371',
    '#19535e',
    '#14424b',
    '#0f3138'];
  colorIterator = 0;

  constructor(public dataService: DataService) {
    this.dataService.getDirectoratesWithMostContracts()
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        res.forEach((directory, i) => {
          i = i + 1;
          if (i > this.colors.length) {
            this.colorIterator = 0;
          }
          directory.color = this.colors[this.colorIterator++];
        });
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
          yAxis: {
            title: {
              text: 'Numri'
            },
            max: 250
          },
          plotOptions: {
            bar: {
              pointWidth: 15,
            },
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
