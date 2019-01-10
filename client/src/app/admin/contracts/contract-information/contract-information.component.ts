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
  lastTransactionDate: Date;
  lastTransactionAmount: Number;
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
        if (this.contract.releases[0].contracts[0].implementation.transactions.length > 0) {
          const i = this.contract.releases[0].contracts[0].implementation.transactions.length;
          this.lastTransactionDate = this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date;
          this.lastTransactionAmount = this.contract.releases[0].contracts[0].implementation.transactions[i - 1].value.amount;
        }
        if (this.contract.releases[0].contracts[0].value.amount !== 0 && this.contract.releases[0].contracts[0].value.amount !== undefined && this.contract.releases[0].contracts[0].value.amount !== null) {
          this.totalOfAnnexesWithTaxes = parseFloat(this.contract.releases[0].contracts[0].value.amount.toString());
        } else {
          this.totalOfAnnexesWithTaxes = 0;
        }
        if (this.contract.releases[0].contracts[0].implementation.finalValue.amount !== 0 && this.contract.releases[0].contracts[0].implementation.finalValue.amount !== undefined && this.contract.releases[0].contracts[0].implementation.finalValue.amount !== null) {
          this.totalPayedPriceForContract = parseFloat(this.contract.releases[0].contracts[0].implementation.finalValue.amount.toString());
        } else {
          this.totalPayedPriceForContract = 0;
        }
        if (this.contract.releases[0].contracts[0].deductionAmountFromContract.value.amount !== 0 && this.contract.releases[0].contracts[0].deductionAmountFromContract.value.amount !== undefined && this.contract.releases[0].contracts[0].deductionAmountFromContract.value.amount !== null) {
          this.discountAmount = parseFloat(this.contract.releases[0].contracts[0].deductionAmountFromContract.value.amount.toString());
        } else {
          this.discountAmount = 0;
        }
        this.total = this.totalOfAnnexesWithTaxes - this.totalPayedPriceForContract - this.discountAmount;
        if (this.contract.releases[0].contracts[0].period.durationInDays === null || this.contract.releases[0].contracts[0].period.durationInDays === '' || this.contract.releases[0].contracts[0].period.durationInDays === ' undefined' || this.contract.releases[0].contracts[0].period.durationInDays === 'n-a' || this.contract.releases[0].contracts[0].period.durationInDays === 'n/a') {
          this.contract.releases[0].contracts[0].period.durationInDays = '-';
        }
        if (this.contract.releases[0].contracts[0].period.durationInDays !== '' && this.contract.releases[0].contracts[0].period.durationInDays !== '') {
          const implementationDeadlineValues = this.contract.releases[0].contracts[0].period.durationInDays.includes(' undefined');
          if (implementationDeadlineValues) {
            this.contract.releases[0].contracts[0].period.durationInDays = this.contract.releases[0].contracts[0].period.durationInDays.replace(' undefined', '');
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
