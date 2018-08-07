import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-directorates-chart',
  templateUrl: './directorates-chart.component.html',
  styleUrls: ['./directorates-chart.component.css']
})
export class DirectoratesChartComponent implements OnInit {
  chart: Chart;
  colors = ['#042a2b', '#5eb1bf', '#cdedf6', '#ef7b45', '#87a330', '#c17b74', '#7e6b8f', '#96e6b3', '#da3e52', '#068d9d'];
  colorIterator = 0;

  constructor(public dataService: DataService) {
    this.dataService.getDirectoratesWithMostContracts().subscribe(res => {
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
          text: 'Drejtoritë me më shumëti kontrata '
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
          pointFormat: '<span style="color:{series.color}">Nr kontratave: {point.y}</span><br/>'
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
