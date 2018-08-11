import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Contract } from '../../../models/contract';
import { ContractsService } from '../../../service/contracts.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-contract-information',
  templateUrl: './contract-information.component.html',
  styleUrls: ['./contract-information.component.css']
})
export class ContractInformationComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  contracts: Contract[];
  contract: Contract;
  totalOfAnnexesWithTaxes: number;
  totalPayedPriceForContract: number;
  discountAmount: number;
  total: number;

  constructor(public contractsService: ContractsService, private router: ActivatedRoute) {
    this.contract = new Contract();
    const id = this.router.snapshot.paramMap.get('id');
    this.contractsService.getContractByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.contract = data;
        if (this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== '' && this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== undefined && this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== null && this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== 'NaN') {
          this.totalOfAnnexesWithTaxes = parseFloat(this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes.toString());
        } else {
          this.totalOfAnnexesWithTaxes = 0;
        }
        if (this.contract.contract.totalPayedPriceForContract !== '' && this.contract.contract.totalPayedPriceForContract !== undefined && this.contract.contract.totalPayedPriceForContract !== null && this.contract.contract.totalPayedPriceForContract !== 'NaN') {
          this.totalPayedPriceForContract = parseFloat(this.contract.contract.totalPayedPriceForContract.toString());
        } else {
          this.totalPayedPriceForContract = 0;
        }
        if (this.contract.contract.discountAmountFromContract !== '' && this.contract.contract.discountAmountFromContract !== undefined && this.contract.contract.discountAmountFromContract !== null && this.contract.contract.discountAmountFromContract !== 'NaN') {
          this.discountAmount = parseFloat(this.contract.contract.discountAmountFromContract.toString());
        } else {
          this.discountAmount = 0;
        }
        this.total = this.totalOfAnnexesWithTaxes - this.totalPayedPriceForContract - this.discountAmount;
      });
  }

  ngOnInit() {
  }

}
