import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';
import { TranslateService } from '@ngx-translate/core';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
@Component({
  selector: 'app-contract-by-year-with-predicted-value-total-amount',
  templateUrl: './contract-by-year-with-predicted-value-total-amount.component.html',
  styleUrls: ['./contract-by-year-with-predicted-value-total-amount.component.css']
})
export class ContractByYearWithPredictedValueTotalAmountComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chart: Chart;
  years;
  year: string;
  lang: string;
  constructor(public dataService: DataService, public translate: TranslateService) {
    this.year = '2018';
    this.dataService.getContractYears(2009)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.years = res;
      });
  }

  onChange(event) {
    this.year = event.target.value;
    this.translate.onLangChange
      .takeUntil(this.unsubscribeAll)
      .subscribe(langObj => {
        this.lang = langObj.lang;
        this.render();
      });
    this.render();
  }

  render() {
    this.dataService.getContractByYearWithPredictedValueAndTotalAmount(this.year)
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
            type: 'line'
          },
          title: {
            text: translateVis[this.lang]['contractByYearWithPredictedValueTotalAmount']
          },
          xAxis: {
            categories: data.activityTitles
          },
          yAxis: {
            title: {
              text: translateVis[this.lang]['values'],
            },
            labels: {
              formatter: function () {
                return `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(this.value)}`;
              }
            }
          },
          series: [{
            name: translateVis[this.lang]['predictedValue'],
            data: data.predictedValues
          }, {
            name: translateVis[this.lang]['totalValueOfContract'],
            data: data.totalAmountValues
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

  public formatData(contracts) {
    const dataToReturn = {
      activityTitles: [],
      predictedValues: [],
      totalAmountValues: []
    };
    for (const contract of contracts) {
      dataToReturn.activityTitles.push(contract.activityTitle);
      dataToReturn.predictedValues.push(parseFloat(contract.predictedValue.replace(',', '')));
      dataToReturn.totalAmountValues.push(parseFloat(contract.totalAmountOfContractsIncludingTaxes.replace(',', '')));
    }
    return dataToReturn;
  }

}
