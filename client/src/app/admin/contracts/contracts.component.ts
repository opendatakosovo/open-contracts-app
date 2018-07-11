import { Component, OnInit, ElementRef } from '@angular/core';
import { ContractsService } from '../../service/contracts.service';
import { Contract } from '../../models/contract';
@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
  contract: Contract;
  constructor(public contractsService: ContractsService) {

  }

  ngOnInit() {
  }

  addInstallments() {
  }
  removeInstallment() {
  }
}
