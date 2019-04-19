import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { TranslateService } from '@ngx-translate/core';
import { compareValues } from '../../../../utils/sortArrayByValues';
import { trigger, animate, transition, style, state } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { PageScrollConfig, PageScrollInstance, PageScrollService } from 'ngx-page-scroll';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
@Component({
  selector: 'app-contracts-count-by-procurement-procedure-and-year',
  templateUrl: './contracts-count-by-procurement-procedure-and-year.component.html',
  styleUrls: ['./contracts-count-by-procurement-procedure-and-year.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, display: 'block' })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('hidden => shown', animate('100ms ease-in')),
      transition('shown => hidden', animate('100ms ease-out'))
    ])
  ]
})
export class ContractsCountByProcurementProcedureAndYearComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chartt: Chart;
  category = 'value';
  years;
  colors: string[];
  year: string;
  lang: string;
  visibilityState = 'hidden';
  clicked = false;
  button = false;
  oeName = '';
  rows;
  messages = {
    emptyMessage: `
    <div>
        <i class="fa fa-spinner fa-spin"></i>
        <p>Duke shfaqur kontratat</p>
    </div>
  `
  };
  constructor(public dataService: DataService, public translate: TranslateService, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) {
    PageScrollConfig.defaultScrollOffset = 115;
    this.colors = ['#5e9ebd', '#6ea7c3', '#7eb1ca', '#8ebbd0', '#9ec4d7', '#aecede'];
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
    this.render();
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

  toggle(event) {
    if (this.visibilityState === 'hidden') {
      this.button = false;
      this.visibilityState = 'shown';

    } else {
      event.target.html = '';
      this.visibilityState = 'hidden';
      this.button = true;
    }
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
          if (row.name === 'bigValue') {
            row.name = 'Vlerë e madhe';
          }
          if (row.name === 'mediumValue') {
            row.name = 'Vlerë e mesme';
          }
          if (row.name === 'smallValue') {
            row.name = 'Vlerë e vogël';
          }
          if (row.name === 'minimalValue') {
            row.name = 'Vlerë minimale';
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

        res.sort(compareValues('y', 'desc'));
        let maxValue = 0;
        for (const row of res) {
          if (row.y > maxValue) {
            maxValue = row.y;
          }
        }
        this.chartt = new Chart({
          chart: {
            type: 'column'
          },
          title: {
            text: translateVis[this.lang]['contractByProcurementValue']
          },
          xAxis: {
            type: 'category'
          },
          legend: {
            enabled: false
          },
          colors: this.colors,
          plotOptions: {
            series: {
              cursor: 'pointer',
              events: {
                click: e => {
                  this.visibilityState = 'shown';
                  this.clicked = true;
                  this.button = false;
                  let name = e.point.name;
                  this.oeName = e.point.name;
                  this.rows = [];
                  if (name === 'Vlerë e madhe' || name === 'Big value' || name === 'Velika vrednost') {
                    name = 'bigValue';
                  } else if (name === 'Vlerë e mesme' || name === 'Medium value' || name === 'Srednja vrednost') {
                    name = 'mediumValue';
                  } else if (name === 'Vlerë e vogël' || name === 'Mala vrednost' || name === 'Small value') {
                    name = 'smallValue';
                  } else if (name === 'Vlerë minimale' || name === 'Minimum value' || name === 'Minimalna vrednost') {
                    name = 'minimalValue';
                  }
                  this.dataService.getContractsByProcurementValue(name, this.year)
                    .takeUntil(this.unsubscribeAll)
                    .subscribe(contract => {
                      this.rows = contract;
                      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#valueProcurementTable');
                      this.pageScrollService.start(pageScrollInstance);
                    });
                }
              }
            },
            column: {
              colorByPoint: true
            }
          },
          yAxis: {
            title: {
              text: translateVis[this.lang]['contracts']
            },
            max: maxValue
          },
          series: [{
            name: translateVis[this.lang]['numberOfContracts'],
            data: res
          }]
        });
      });
  }
}
