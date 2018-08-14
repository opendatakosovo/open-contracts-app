import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { TranslateService } from '@ngx-translate/core';
import { lang } from 'moment';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
@Component({
  selector: 'app-contracts-count-by-procurement-type-and-year',
  templateUrl: './contracts-count-by-procurement-type-and-year.component.html',
  styleUrls: ['./contracts-count-by-procurement-type-and-year.component.css']
})
export class ContractsCountByProcurementTypeAndYearComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chartt: Chart;
  category = 'type';
  years;
  colors: string[];
  year: string;
  lang: string;
  constructor(public dataService: DataService, public translate: TranslateService) {
    this.colors = ['#48aebd',
      '#50c2d2',
      '#61c8d6',
      '#72cedb',
      '#84d4df', '#96dae4'];
    this.year = 'any';
    this.dataService.getContractYears(2009)
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
    this.dataService.getContractsCountByProcurementCategoryAndYear(this.category, this.year)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        let hasUndefinedData = false;
        const undefinedObj = { name: 'Të pacaktuara', y: 0 };
        const toBeRemoved = [];

        res.map((row, i) => {
          if (row.name === '') {
            hasUndefinedData = true;
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === 'n/a') {
            hasUndefinedData = true;
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === 'N/A') {
            hasUndefinedData = true;
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === null) {
            hasUndefinedData = true;
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
        });

        if (hasUndefinedData) {
          res.push(undefinedObj);

          for (let i = res.length; i >= 0; i--) {
            for (const index of toBeRemoved) {
              if (index === Number(i)) {
                res.splice(index, 1);
              }
            }
          }
        }

        // Translation of data in res
        if (this.lang === 'en' || this.lang === 'sr') {
          res.map((row, i) => {
            row.name = translateVis[this.lang][row.name];
          });
        }

        this.chartt = new Chart({
          chart: {
            type: 'pie'
          },
          colors: this.colors,
          title: {
            text: translateVis[this.lang]['contractByProcurementType']
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            title: {
              text: translateVis[this.lang]['contracts']
            }
          },
          series: [{
            name: translateVis[this.lang]['numberOfContracts'],
            data: res
          }]
        });
      });
  }
}
