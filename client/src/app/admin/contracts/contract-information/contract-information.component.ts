import { Component, OnInit } from '@angular/core';
import { Contract } from '../../../models/contract';
import { ContractsService } from '../../../service/contracts.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-contract-information',
  templateUrl: './contract-information.component.html',
  styleUrls: ['./contract-information.component.css']
})
export class ContractInformationComponent implements OnInit {
  contracts: Contract[];
  contract: Contract;
  totalOfAnnexesWithTaxes: number;
  totalPayedPriceForContract: number;
  discountAmount: number;

  constructor(public contractsService: ContractsService, private router: ActivatedRoute) {
    this.contract = new Contract();
    const id = this.router.snapshot.paramMap.get('id');
    this.contractsService.getContractByID(id).subscribe(data => {
      this.contract = data;
      if (this.contract.contract.totalOfAnnexesWithTaxes !== '') {
        this.totalOfAnnexesWithTaxes = parseFloat(this.contract.contract.totalOfAnnexesWithTaxes.toString());
      }
      if (this.contract.contract.totalPayedPriceForContract !== '') {
        this.totalPayedPriceForContract = parseFloat(this.contract.contract.totalPayedPriceForContract.toString());
      }
      if (this.contract.contract.discountAmountFromContract !== '') {
        this.discountAmount = parseFloat(this.contract.contract.discountAmountFromContract.toString());
      }
    });
  }

  ngOnInit() {
  }

}
