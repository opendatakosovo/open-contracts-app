import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';
import { TranslateService } from '@ngx-translate/core';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
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
  lang: string;
  constructor(public dataService: DataService, public translate: TranslateService) {
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

  render() {
    this.dataService.getDirectoratesWithMostContracts()
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        // Translation of data in res
        if (this.lang === 'en' || this.lang === 'sr') {
          res.map((row, i) => {
            row.name = translateVis[this.lang][row.name];
          });
        }

        let maxValue = 0;
        for (const row of res) {
          if (row.y > maxValue) {
            maxValue = row.y;
          }
        }
        const data = res;
        this.chart = new Chart({
          chart: {
            type: 'bar'
          },
          title: {
            text: translateVis[this.lang]['numberOfContractsByDirectorate']
          },
          xAxis: {
            type: 'category',
            title: {
              text: translateVis[this.lang]['directorates']
            }
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
              text: translateVis[this.lang]['numberOfContracts']
            },
            max: maxValue
          },
          series: [{
            name: translateVis[this.lang]['numberOfContracts'],
            data: data
          }]
        });
      });
  }

}
