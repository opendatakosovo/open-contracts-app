import { Component, OnInit, ElementRef } from '@angular/core';
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
  constructor(public contractsService: ContractsService) {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
  }

  addInstallments() {
  }
  removeInstallment() {
  }
}
