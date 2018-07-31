import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { allSettled } from '../../../../../../node_modules/@types/q';

@Component({
  selector: 'app-top-ten-contractors-chart',
  templateUrl: './top-ten-contractors-chart.component.html',
  styleUrls: ['./top-ten-contractors-chart.component.css']
})
export class TopTenContractorsChartComponent implements OnInit {
  chartt;
  constructor(public dataService: DataService) {
    this.dataService.getTopTenContractors().subscribe(res => {
      this.chartt = new Chart({
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Top 10 kompanitë'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: 'Kontratat'
          }
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            events: {
              click: e => {
                const name = e.point.name;
                this.dataService.getContractsByName(name).subscribe(res => {
                  console.log(res);
                });
              }
            }
          }
        },
        series: [{
          name: 'Kontratat',
          data: res
        }]
      });
    });
  }

  ngOnInit() {
  }

}
