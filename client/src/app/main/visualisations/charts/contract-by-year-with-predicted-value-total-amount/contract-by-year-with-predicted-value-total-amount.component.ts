import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-contract-by-year-with-predicted-value-total-amount',
  templateUrl: './contract-by-year-with-predicted-value-total-amount.component.html',
  styleUrls: ['./contract-by-year-with-predicted-value-total-amount.component.css']
})
export class ContractByYearWithPredictedValueTotalAmountComponent implements OnInit {
  chart: Chart;
  constructor(public dataService: DataService) {
    this.dataService.getContractByYearWithPredictedValueAndTotalAmount(2018).subscribe(res => {
      const data = this.formatData(res);
      console.log(data);
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
