import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';
import { FnParam } from '../../../../../../node_modules/@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-contracts-count-by-years-chart',
  templateUrl: './contracts-count-by-years-chart.component.html',
  styleUrls: ['./contracts-count-by-years-chart.component.css']
})
export class ContractsCountByYearsChartComponent implements OnInit {
  data;
  formattedData: any[];
  chart: Chart;

  constructor(public dataService: DataService, ) {
    this.dataService.getContractsCountByYears().subscribe(res => {
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
