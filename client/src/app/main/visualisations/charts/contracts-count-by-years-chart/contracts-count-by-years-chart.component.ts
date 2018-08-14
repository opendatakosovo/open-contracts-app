import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';
import { compareValues } from '../../../../utils/sortArrayByValues';
import { TranslateService } from '@ngx-translate/core';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
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
  lang: string;

  constructor(public dataService: DataService, public translate: TranslateService) {
  }

  render() {
    this.dataService.getContractsCountByYears()
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        res.sort(compareValues('y', 'desc'));
        this.chart = new Chart({
          chart: {
            type: 'column'
          },
          title: {
            text: translateVis[this.lang]['numberOfContractsOverTheYears']
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            title: {
              text: translateVis[this.lang]['numberOfContracts']
            }
          },
          colors: this.colors,
          plotOptions: {
            column: {
              colorByPoint: true
            }
          },
          legend: {
            enabled: false
          },
          series: [{
            name: translateVis[this.lang]['year'],
            data: res
          }]
        });
      });
  }

  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.translate.onLangChange
      .takeUntil(this.unsubscribeAll)
      .subscribe(langObj => {
        this.lang = langObj.lang;
        this.render();
      });
  }
}
