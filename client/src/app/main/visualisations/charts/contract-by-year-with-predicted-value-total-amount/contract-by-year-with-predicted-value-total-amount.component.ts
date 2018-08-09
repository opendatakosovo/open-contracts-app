import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-contract-by-year-with-predicted-value-total-amount',
  templateUrl: './contract-by-year-with-predicted-value-total-amount.component.html',
  styleUrls: ['./contract-by-year-with-predicted-value-total-amount.component.css']
})
export class ContractByYearWithPredictedValueTotalAmountComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  chart: Chart;
  years;
  constructor(public dataService: DataService) {
    this.dataService.getContractYears(2009)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.years = res;
        this.render(this.years[0].year);
      });
  }

  onChange(event) {
    const year = event.target.value;
    this.render(year);
  }

  render(year) {
    this.dataService.getContractByYearWithPredictedValueAndTotalAmount(year)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        const data = this.formatData(res);
        this.chart = new Chart({
          chart: {
            type: 'line'
          },
          title: {
            text: 'Krahasimi i vlerës parashikuar të kontratës me vlerën totale të kontratës me taksa'
          },
          xAxis: {
            categories: data.activityTitles
          },
          yAxis: {
            labels: {
              formatter: function () {
                return `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(this.value)}`;
              }
            }
          },
          series: [{
            name: 'Vlera parashikuar kontratës',
            data: data.predictedValues
          }, {
            name: 'Vlera totale e kontratës me taksa',
            data: data.totalAmountValues
          }]
        });
      });
  }

  ngOnInit() {
  }

  public formatData(contracts) {
    const dataToReturn = {
      activityTitles: [],
      predictedValues: [],
      totalAmountValues: []
    };
    for (const contract of contracts) {
      dataToReturn.activityTitles.push(contract.activityTitle);
      dataToReturn.predictedValues.push(parseFloat(contract.predictedValue.replace(',', '')));
      dataToReturn.totalAmountValues.push(parseFloat(contract.totalAmountOfContractsIncludingTaxes.replace(',', '')));
    }
    return dataToReturn;
  }

}
