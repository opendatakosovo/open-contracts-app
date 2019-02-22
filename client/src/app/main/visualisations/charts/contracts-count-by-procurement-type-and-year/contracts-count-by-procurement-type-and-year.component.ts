import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { TranslateService } from '@ngx-translate/core';
import { trigger, animate, transition, style, state } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { PageScrollConfig, PageScrollInstance, PageScrollService } from 'ngx-page-scroll';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
@Component({
  selector: 'app-contracts-count-by-procurement-type-and-year',
  templateUrl: './contracts-count-by-procurement-type-and-year.component.html',
  styleUrls: ['./contracts-count-by-procurement-type-and-year.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, display: 'block' })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('hidden => shown', animate('100ms ease-in')),
      transition('shown => hidden', animate('100ms ease-out'))
    ])
  ]
})
export class ContractsCountByProcurementTypeAndYearComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chartt: Chart;
  category = 'type';
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
          if (row.name === 'services') {
            row.name = 'Shërbime';
          }
          if (row.name === 'goods') {
            row.name = 'Furnizim';
          }
          if (row.name === 'consultingServices') {
            row.name = 'Shërbime këshillimi';
          }
          if (row.name === 'designContest') {
            row.name = 'Konkurs projektimi';
          }
          if (row.name === 'works') {
            row.name = 'Punë';
          }
          if (row.name === 'concessionWorks') {
            row.name = 'Punë me koncesion';
          }
          if (row.name === 'immovableProperty') {
            row.name = 'Pronë e palujtshme';
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
                  if (name === 'Furnizim' || name === 'Snabdevanje' || name === 'Supply') {
                    name = 'goods';
                  } else if (name === 'Shërbime' || name === 'Services' || name === 'Usluge') {
                    name = 'services';
                  } else if (name === 'Shërbime keshillimi' || name === 'Savjetovališta' || name === 'Counseling services') {
                    name = 'consultingServices';
                  } else if (name === 'Konkurs projektimi' || name === 'Design contest' || name === 'Konkurs za dizajn') {
                    name = 'designContest';
                  } else if (name === 'Punë' || name === 'Rad' || name === 'Job') {
                    name = 'works';
                  } else if (name === 'Punë me koncesion' || name === 'Concession work' || name === 'Koncesioni rad') {
                    name = 'concessionWorks';
                  } else if (name === 'Prone e palujtshme' || name === 'Nepokretna imovina' || name === 'Immovable property') {
                    name = 'immovableProperty';
                  }
                  this.dataService.getContractsByProcurementType(name)
                    .takeUntil(this.unsubscribeAll)
                    .subscribe(contract => {
                      this.rows = contract;
                      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#typeProcurementTable');
                      this.pageScrollService.start(pageScrollInstance);
                    });
                }
              }
            }
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
