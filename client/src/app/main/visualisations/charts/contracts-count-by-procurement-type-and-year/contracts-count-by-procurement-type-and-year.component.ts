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
  colors: string[];
  constructor(public dataService: DataService, public translate: TranslateService) {
    this.render('any');
    this.colors = ['#48aebd',
      '#50c2d2',
      '#61c8d6',
      '#72cedb',
      '#84d4df', '#96dae4'];
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

        this.chartt = new Chart({
          chart: {
            type: 'pie'
          },
          colors: this.colors,
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
            name: 'Numri i kontratave',
            data: res
          }]
        });
      });
  }
}
