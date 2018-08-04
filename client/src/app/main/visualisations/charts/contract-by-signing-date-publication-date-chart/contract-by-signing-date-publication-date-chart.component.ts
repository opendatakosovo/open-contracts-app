import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../service/data.service';
import { Chart } from 'angular-highcharts';


@Component({
  selector: 'app-contract-by-signing-date-publication-date-chart',
  templateUrl: './contract-by-signing-date-publication-date-chart.component.html',
  styleUrls: ['./contract-by-signing-date-publication-date-chart.component.css']
})
export class ContractBySigningDatePublicationDateChartComponent implements OnInit {
  chart: Chart;
  constructor(public dataService: DataService) {
    this.dataService.getContractSigningDateAndPublicationDateForChart(2018).subscribe(res => {
      const data = this.formatData(res);
      console.log(data);
      this.chart = new Chart({
        chart: {
          type: 'spline'
        },
        title: {
          text: 'Krahasimi i datës publikimit të dhënies kontratës me datën të nënshkrimit kontratës'
        },
        xAxis: {
          categories: data.activityTitles
        },
        yAxis: {
          type: 'datetime',
          title: {
            text: ''

          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>{point.x} - ',
          pointFormat: ` {point.y:%d.%m.%Y}`
        },
        series: [{
          name: 'Data publikimit të dhënies kontratës',
          data: data.signingDates
        }, {
          name: 'Data të nënshkrimit kontratës',
          data: data.publicationDatesOfGivenContracts
        }]
      });
    });
  }

  ngOnInit() {
  }

  formatData(contracts) {
    const dataToReturn = {
      signingDates: [],
      publicationDatesOfGivenContracts: [],
      activityTitles: []
    };
    for (const conctract of contracts) {
      const signingDate = new Date(conctract.signingDate);
      const publicationDateOfGivenContract = new Date(conctract.publicationDateOfGivenContract);
      dataToReturn.signingDates.push(Date.parse(signingDate.toDateString()));
      dataToReturn.publicationDatesOfGivenContracts.push(Date.parse(publicationDateOfGivenContract.toDateString()));
      dataToReturn.activityTitles.push(conctract.activityTitle);
    }
    return dataToReturn;
  }

}
