import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';
import { TranslateService } from '@ngx-translate/core';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');

@Component({
  selector: 'app-contract-by-signing-date-publication-date-chart',
  templateUrl: './contract-by-signing-date-publication-date-chart.component.html',
  styleUrls: ['./contract-by-signing-date-publication-date-chart.component.css']
})
export class ContractBySigningDatePublicationDateChartComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chart: Chart;
  years;
  year: string;
  lang: string;
  constructor(public dataService: DataService, public translate: TranslateService) {
    this.year = '2018';
    this.dataService.getContractYears(2017)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.years = res;
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

  render() {
    this.dataService.getContractSigningDateAndPublicationDateForChart(this.year)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        // Translation of data in res
        if (this.lang === 'en' || this.lang === 'sr') {
          res.map((row, i) => {
            row.name = translateVis[this.lang][row.name];
          });
        }
        const data = this.formatData(res);
        this.chart = new Chart({
          chart: {
            type: 'spline'
          },
          title: {
            text: translateVis[this.lang]['contractBySigningDatePublicationDateChart']
          },
          xAxis: {
            categories: data.activityTitles
          },
          yAxis: {
            type: 'datetime',
            title: {
              text: ''
            }
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>{point.x} - ',
            pointFormat: ` {point.y:%d.%m.%Y}`
          },
          series: [{
            name: translateVis[this.lang]['publicationDate'],
            data: data.signingDates
          }, {
            name: translateVis[this.lang]['signingDate'],
            data: data.publicationDatesOfGivenContracts
          }]
        });
      });
  }

  formatData(contracts) {
    const dataToReturn = {
      signingDates: [],
      publicationDatesOfGivenContracts: [],
      activityTitles: []
    };
    for (const conctract of contracts) {
      const signingDate = new Date(conctract.signingDate);
      const publicationDateOfGivenContract = new Date(conctract.publicationDateOfGivenContract);
      dataToReturn.signingDates.push(Date.parse(signingDate.toDateString()));
      dataToReturn.publicationDatesOfGivenContracts.push(Date.parse(publicationDateOfGivenContract.toDateString()));
      dataToReturn.activityTitles.push(conctract.activityTitle);
    }
    return dataToReturn;
  }

}
