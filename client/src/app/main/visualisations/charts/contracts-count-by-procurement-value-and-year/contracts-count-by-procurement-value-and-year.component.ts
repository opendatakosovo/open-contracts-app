import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { TranslateService } from '@ngx-translate/core';
import { compareValues } from '../../../../utils/sortArrayByValues';


@Component({
  selector: 'app-contracts-count-by-procurement-value-and-year',
  templateUrl: './contracts-count-by-procurement-value-and-year.component.html',
  styleUrls: ['./contracts-count-by-procurement-value-and-year.component.css']
})
export class ContractsCountByProcurementValueAndYearComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chartt: Chart;
  category = 'procedure';
  years;
  colors: string[];
  constructor(public dataService: DataService, public translate: TranslateService) {
    this.colors = ['#4d8691', '#5899a6',
      '#6fc0d0',
      '#63acbb',
      '#6fc0d0',
      '#7dc6d4',
      '#8bccd9'
      ];
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
            text: 'Numri i kontratave në bazë të procedurës të prokurimit'
          },
          xAxis: {
            type: 'category'
          },
          legend: {
            enabled: false
          },
          colors: this.colors,
          plotOptions: {
            bar: {
              colorByPoint: true
            }
          },
          yAxis: {
            title: {
              text: 'Numri i kontratave'
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
