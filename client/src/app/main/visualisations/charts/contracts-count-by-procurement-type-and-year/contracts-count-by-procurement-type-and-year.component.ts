import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import { DataService } from '../../../../service/data.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(public dataService: DataService, public translate: TranslateService) {
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
        this.chartt = new Chart({
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Numri i kontratave në bazë të tipit të prokurimit'
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            title: {
              text: 'Kontratat'
            }
          },
          series: [{
            name: 'Kontratat',
            data: res
          }]
        });
      });
  }
}
