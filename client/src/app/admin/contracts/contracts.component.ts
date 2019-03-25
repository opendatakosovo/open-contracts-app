import { Component, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ContractsService } from '../../service/contracts.service';
import { Contract } from '../../models/contract';
import { User } from '../../models/user';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
  contract: Contract;
  currentUser: User;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(public contractsService: ContractsService) {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
  }

  updateAllContracts(event) {
    this.contractsService.migrateContracts(this.currentUser)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          console.log(res.err);
        } else {
          console.log('Contracts updated');
        }
      });
  }
}
