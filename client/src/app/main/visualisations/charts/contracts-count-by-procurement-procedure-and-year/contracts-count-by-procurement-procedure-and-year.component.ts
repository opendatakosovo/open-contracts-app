import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { TranslateService } from '@ngx-translate/core';
import { compareValues } from '../../../../utils/sortArrayByValues';
import { lang } from 'moment';
declare var require: any;
const translateVis = require('../../../../utils/visualisationTranslation.json');
@Component({
  selector: 'app-contracts-count-by-procurement-procedure-and-year',
  templateUrl: './contracts-count-by-procurement-procedure-and-year.component.html',
  styleUrls: ['./contracts-count-by-procurement-procedure-and-year.component.css']
})
export class ContractsCountByProcurementProcedureAndYearComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chartt: Chart;
  category = 'value';
  years;
  colors: string[];
  title: string;
  constructor(public dataService: DataService, public translate: TranslateService) {
    this.colors = ['#5e9ebd', '#6ea7c3', '#7eb1ca', '#8ebbd0', '#9ec4d7', '#aecede'];
    this.render('any');
    this.dataService.getContractYears(2009)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.years = res;
      });
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe(lang => {
        console.log('Changed');
        this.render('any');
    });
  }

  onChange(event) {
    const year = event.target.value;
    this.render(year);
  }

  render(year) {
    this.dataService.getContractsCountByProcurementCategoryAndYear(this.category, year)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        const ln = localStorage.getItem('language');
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
        if (ln === 'en' || ln === 'sr') {
          res.map((row, i) => {
            if (row.name === 'Vlerë e mesme') {
              row.name = 'Medium value';
            } else if (row.name === 'Vlerë e vogël') {
              row.name = 'Small value';
            } else if (row.name === 'Vlerë minimale') {
              row.name = 'Minimal value';
            } else if (row.name === 'Vlerë e madhe') {
              row.name = 'Big value';
            } else if (row.name === 'Të pacaktuara') {
              row.name = 'Undefined';
            }
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
            text: translateVis[ln]['contractByProcurementValue']
          },
          xAxis: {
            type: 'category'
          },
          legend: {
            enabled: false
          },
          colors: this.colors,
          plotOptions: {
            column: {
              colorByPoint: true
            }
          },
          yAxis: {
            title: {
              text: 'Kontratat'
            },
            max: maxValue
          },
          series: [{
            name: 'Numri i kontratave',
            data: res
          }]
        });
      });
  }
}
