import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../service/data.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-directorates-table',
  templateUrl: './directorates-table.component.html',
  styleUrls: ['./directorates-table.component.css']
})
export class DirectoratesTableComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  contracts;
  years;

  constructor(public dataService: DataService) {
    this.dataService.getContractsMostByTotalAmountOfContract(2018).subscribe(res => {
      this.contracts = res;
    });
    this.dataService.getContractYears(2009).subscribe(res => {
      this.years = res;
    });
  }

  render(event) {
    const year = event.target.value;
    this.dataService.getContractsMostByTotalAmountOfContract(year).takeUntil(this.unsubscribeAll).subscribe(res => {
      this.contracts = res;
    });
  }

  ngOnInit() {
  }

}
