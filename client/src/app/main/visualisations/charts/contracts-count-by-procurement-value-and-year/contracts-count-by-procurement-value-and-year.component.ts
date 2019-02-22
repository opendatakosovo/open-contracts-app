import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { trigger, animate, transition, style, state } from '@angular/animations';
import { DataService } from '../../../../service/data.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { compareValues } from '../../../../utils/sortArrayByValues';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
import { PageScrollConfig, PageScrollInstance, PageScrollService } from 'ngx-page-scroll';

@Component({
  selector: 'app-contracts-count-by-procurement-value-and-year',
  templateUrl: './contracts-count-by-procurement-value-and-year.component.html',
  styleUrls: ['./contracts-count-by-procurement-value-and-year.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, display: 'block' })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('hidden => shown', animate('100ms ease-in')),
      transition('shown => hidden', animate('100ms ease-out'))
    ])
  ]
})
export class ContractsCountByProcurementValueAndYearComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chartt: Chart;
  category = 'procedure';
  years;
  colors: string[];
  year: string;
  lang: string;
  colorIterator = 0;
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
    this.colors = ['#4d8691', '#5899a6',
      '#6fc0d0',
      '#63acbb',
      '#6fc0d0',
      '#7dc6d4',
      '#8bccd9'
    ];
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
          if (row.name === 'openProcedure') {
            row.name = 'Procedura e hapur';
          }
          if (row.name === 'limitedProcedure') {
            row.name = 'Procedura e kufizuar';
          }
          if (row.name === 'designContest') {
            row.name = 'Konkurs projektimi';
          }
          if (row.name === 'negociatedProcedureAfterAwardNotice') {
            row.name = 'Procedura e negociuar pas publikimit të njoftimit të kontratës';
          }
          if (row.name === 'negociatedProcedureWithoutAwardNotice') {
            row.name = 'Procedura e negociuar pa publikim të njoftimit të kontratës';
          }
          if (row.name === 'quotationValueProcedure') {
            row.name = 'Procedura e kuotimit të Çmimeve';
          }
          if (row.name === 'minimalValueProcedure') {
            row.name = 'Procedura e vlerës minimale';
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
            type: 'bar',
          },
          title: {
            text: translateVis[this.lang]['contractByProcurementProcedure']
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
                  if (name === 'Procedura e hapur' || name === 'Open procedure' || name === 'Otvorena procedura') {
                    name = 'openProcedure';
                  } else if (name === 'Procedura e kufizuar' || name === 'Restricted procedure' || name === 'Ograničen postupak') {
                    name = 'limitedProcedure';
                  } else if (name === 'Konkurs projektimi' || name === 'Design contest' || name === 'Konkurs za dizajn') {
                    name = 'designContest';
                  } else if (name === 'Procedura e negociuar pas publikimit të njoftimit të kontratës' || name === 'Negotiated procedure after the publication of the contract notice' || name === 'Pregovarački postupak nakon objavljivanja obaveštenja o ugovoru') {
                    name = 'negociatedProcedureAfterAwardNotice';
                  } else if (name === 'Procedura e negociuar pa publikim të njoftimit të kontratës' || name === 'Negotiated procedure without publication of the contract notice' || name === 'Pregovarački postupak bez objavljivanja obaveštenja o ugovoru') {
                    name = 'negociatedProcedureWithoutAwardNotice';
                  } else if (name === 'Procedura e kuotimit të Çmimeve' || name === 'Pricing quotation procedure' || name === 'Procedura kotiranja cena') {
                    name = 'quotationValueProcedure';
                  } else if (name === 'Procedura e vlerës minimale' || name === 'Minimal value procedure' || name === 'Procedura minimalne vrednosti') {
                    name = 'minimalValueProcedure';
                  }
                  this.dataService.getContractsByProcurementCategory(name)
                    .takeUntil(this.unsubscribeAll)
                    .subscribe(contract => {
                      this.rows = contract;
                      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#procedureProcurementTable');
                      this.pageScrollService.start(pageScrollInstance);
                    });
                }
              }
            },
            bar: {
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
