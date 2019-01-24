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
  lastTransactionAmount: number;
  planned: string;
  criteria: string;
  retender: string;
  tenderStatus: string;

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
          this.lastTransactionAmount = Number(this.contract.releases[0].contracts[0].implementation.transactions[i - 1].value.amount);
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
        if (this.contract.releases[0].planning.documents[0] && this.contract.releases[0].planning.documents[0].documentType && this.contract.releases[0].planning.documents[0].documentType === 'procurementPlan') {
          this.planned = 'Po';
        } else {
          this.planned = 'Jo';
        }
        if (this.contract.releases[0].tender.awardCriteria === 'lowPrice') {
          this.criteria = 'Çmimi më i ulët';
        } else if (this.contract.releases[0].tender.awardCriteria === 'costOnly') {
          this.criteria = 'Tenderi ekonomikisht më i favorshëm';
        } else if (this.contract.releases[0].tender.awardCriteria === 'ratedCriteria') {
          this.criteria = 'Çmimi më i ulët me poentim';
        }
        if (this.contract.releases[0].relatedProcesses[0].relationship && this.contract.releases[0].relatedProcesses[0].relationship === 'unsuccessfulProcess') {
          this.retender = 'Po';
        } else {
          this.retender = 'Jo';
        }
        if (this.contract.releases[0].tender.status === 'active' && (this.contract.releases[0].tender.awardPeriod.startDate && this.contract.releases[0].tender.awardPeriod.endDate)) {
          this.tenderStatus = 'evaluation';
        } else if (this.contract.releases[0].tender.status === 'active') {
          this.tenderStatus = 'published';
        } else if (this.contract.releases[0].tender.status === 'cancelled') {
          this.tenderStatus = 'cancelled';
        } else if (this.contract.releases[0].tender.status === 'complete') {
          this.tenderStatus = 'contracted';
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
