import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { TranslateService } from '@ngx-translate/core';
import { compareValues } from '../../../../utils/sortArrayByValues';
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
  constructor(public dataService: DataService, public translate: TranslateService) {
    this.colors = ['#cdedf6', '#5eb1bf', '#042a2b', '#ef7b45', '#87a330', '#c17b74', '#7e6b8f', '#96e6b3', '#da3e52', '#068d9d'];
    this.render('any');
    this.dataService.getContractYears(2009)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.years = res;
      });
  }

  ngOnInit() {
  }
  onChange(event) {
    const year = event.target.value;
    this.render(year);
  }

  render(year) {
    this.dataService.getContractsCountByProcurementCategoryAndYear(this.category, year)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        const undefinedObj = { name: 'Të pacaktuara', y: 0 };
        const toBeRemoved = [];
        res.map((row, i) => {
          if (row.name === '') {
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === 'n/a') {
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === 'N/A') {
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
          if (row.name === null) {
            undefinedObj.y += row.y;
            toBeRemoved.push(i);
          }
        });
        res.push(undefinedObj);

        for (let i = res.length; i >= 0; i--) {
          for (const index of toBeRemoved) {
            if (index === Number(i)) {
              res.splice(index, 1);
            }
          }
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
            text: 'Numri i kontratave në bazë të vlerës të prokurimit'
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
