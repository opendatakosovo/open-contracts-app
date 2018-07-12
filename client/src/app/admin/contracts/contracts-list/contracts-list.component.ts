import { Component, OnInit } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit {
  contract: Contract;
  contracts: Contract[];

  constructor(public contractsService: ContractsService) {
    this.contractsService.getContracts().subscribe(data => {
      this.contracts = data;
    });
  }

  ngOnInit() {
  }


}
