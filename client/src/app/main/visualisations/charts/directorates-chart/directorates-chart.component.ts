import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';
import { trigger, animate, transition, style, state } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
import { PageScrollConfig, PageScrollInstance, PageScrollService } from 'ngx-page-scroll';
@Component({
  selector: 'app-directorates-chart',
  templateUrl: './directorates-chart.component.html',
  styleUrls: ['./directorates-chart.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1, display: 'block' })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('hidden => shown', animate('100ms ease-in')),
      transition('shown => hidden', animate('100ms ease-out'))
    ])
  ]
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
  years;
  year: string;
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
    this.dataService.getDirectoratesWithMostContracts(this.year)
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
                  if (name === 'Administracija' || name === 'Administration') {
                    name = 'Administratë';
                  } else if (name === 'Education' || name === 'Obrazovanje') {
                    name = 'Arsim';
                  } else if (name === 'Infrastruktura' || name === 'Infrastructure') {
                    name = 'Infrastrukturë';
                  } else if (name === 'Investment' || name === 'Investicije') {
                    name = 'Investime';
                  } else if (name === 'Kultura' || name === 'Culture') {
                    name = 'Kulturë';
                  } else if (name === 'Javne Službe' || name === 'Public Services') {
                    name = 'Shërbime Publike';
                  } else if (name === 'Health' || name === 'Zdravlje') {
                    name = 'Shëndetësi';
                  } else if (name === 'Katastar' || name === 'Cadastre') {
                    name = 'Kadastrës';
                  } else if (name === 'Social Welfare' || name === 'Socijalna Zaštita') {
                    name = 'Mirëqenia Sociale';
                  } else if (name === 'Poljoprivreda' || name === 'Agriculture') {
                    name = 'Bujqësisë';
                  } else if (name === 'Finances' || name === 'Finansije') {
                    name = 'Financave';
                  } else if (name === 'Imovina' || name === 'Property') {
                    name = 'Prona';
                  } else if (name === 'Urbanism' || name === 'Urbanizam') {
                    name = 'Urbanizmi';
                  } else if (name === 'Inspection' || name === 'Inspekcija') {
                    name = 'Inspeksioni';
                  } else if (name === 'Planiranje' || name === 'Planning') {
                    name = 'Planifikimi';
                  } else if (name === 'Parks' || name === 'Parkovi') {
                    name = 'Parqeve';
                  } else if (name === 'Ekonomija' || name === 'Economics') {
                    name = 'Ekonomia';
                  } else if (name === 'Undefined' || name === 'Nedefinisan') {
                    name = 'E pacaktuar';
                  }

                  this.dataService.getContractsByDirectorate(name)
                    .takeUntil(this.unsubscribeAll)
                    .subscribe(contract => {
                      this.rows = contract;
                      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#directorateTable');
                      this.pageScrollService.start(pageScrollInstance);
                    });
                }
              }
            },
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
