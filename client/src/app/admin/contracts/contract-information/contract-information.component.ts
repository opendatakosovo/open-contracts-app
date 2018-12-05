import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Contract } from '../../../models/contract';
import { ContractsService } from '../../../service/contracts.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CheckIfServerDown } from '../../../utils/CheckIfServerDown';
import { CheckIfUserIsActive } from '../../../utils/CheckIfUserIsActive';
import { User } from '../../../models/user';

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
  total;
  currentUser: User;

  constructor(public contractsService: ContractsService, private router: ActivatedRoute,
    public checkIfServerDown: CheckIfServerDown,
    private checkIfUserIsActive: CheckIfUserIsActive) {
    this.contract = new Contract();
    this.currentUser = new User();
    const id = this.router.snapshot.paramMap.get('id');
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.contractsService.getContractByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.contract = data;
        if (this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== '' && this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== undefined && this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== null && this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== 'NaN') {
          this.totalOfAnnexesWithTaxes = parseFloat(this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes.toString().replace(',', ''));
        } else {
          this.totalOfAnnexesWithTaxes = 0;
        }
        if (this.contract.contract.totalPayedPriceForContract !== '' && this.contract.contract.totalPayedPriceForContract !== undefined && this.contract.contract.totalPayedPriceForContract !== null && this.contract.contract.totalPayedPriceForContract !== 'NaN') {
          this.totalPayedPriceForContract = parseFloat(this.contract.contract.totalPayedPriceForContract.toString().replace(',', ''));
        } else {
          this.totalPayedPriceForContract = 0;
        }
        if (this.contract.contract.discountAmountFromContract !== '' && this.contract.contract.discountAmountFromContract !== undefined && this.contract.contract.discountAmountFromContract !== null && this.contract.contract.discountAmountFromContract !== 'NaN') {
          this.discountAmount = parseFloat(this.contract.contract.discountAmountFromContract.toString().replace(',', ''));
        } else {
          this.discountAmount = 0;
        }
        this.total = this.totalOfAnnexesWithTaxes - this.totalPayedPriceForContract - this.discountAmount;
        this.total = parseFloat(this.total.toString()).toLocaleString();
        if (this.contract.contract.implementationDeadline === null || this.contract.contract.implementationDeadline === '' || this.contract.contract.implementationDeadline === ' undefined' || this.contract.contract.implementationDeadline === 'n-a' || this.contract.contract.implementationDeadline === 'n/a') {
          this.contract.contract.implementationDeadline = '-';
        }
        if (this.contract.contract.implementationDeadline !== '' && this.contract.contract.implementationDeadline !== '') {
          const implementationDeadlineValues = this.contract.contract.implementationDeadline.includes(' undefined');
          if (implementationDeadlineValues) {
            this.contract.contract.implementationDeadline = this.contract.contract.implementationDeadline.replace(' undefined', '');
          }
        }
      },
        err => {
          this.checkIfServerDown.check(err.status);
        });
  }

  ngOnInit() {
    this.checkIfUserIsActive.check();
  }

}
