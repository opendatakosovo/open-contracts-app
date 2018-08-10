import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../../service/data.service';
import { Contract } from '../../../../models/contract';

@Component({
  selector: 'app-directorates-table',
  templateUrl: './directorates-table.component.html',
  styleUrls: ['./directorates-table.component.css']
})
export class DirectoratesTableComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  contracts: Contract[];
  years;

  constructor(public dataService: DataService) {
    this.dataService.getContractsMostByTotalAmountOfContract('any')
    .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.contracts = res;
      });
    this.dataService.getContractYears(2009)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.years = res;
      });
  }

  render(event) {
    const year = event.target.value;
    this.dataService.getContractsMostByTotalAmountOfContract(year)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        this.contracts = res;
      });
  }

  ngOnInit() {
  }

}
