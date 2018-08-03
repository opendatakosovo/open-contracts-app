import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';


@Component({
  selector: 'app-contracts-count-by-years-chart',
  templateUrl: './contracts-count-by-years-chart.component.html',
  styleUrls: ['./contracts-count-by-years-chart.component.css']
})
export class ContractsCountByYearsChartComponent implements OnInit {
  data;
  formattedData: any[];
  chart: Chart;
  colors = ['#042a2b', '#5eb1bf', '#cdedf6', '#ef7b45', '#87a330', '#c17b74', '#7e6b8f', '#96e6b3', '#da3e52', '#068d9d'];
  colorIterator = 0;

  constructor(public dataService: DataService, ) {
    this.dataService.getContractsCountByYears().subscribe(res => {
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
            text: 'Kontratat'
          }
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
