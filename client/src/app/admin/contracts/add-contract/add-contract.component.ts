import { Component, OnInit, ViewChild } from '@angular/core';
import { Contract } from '../../../models/contract';
import { Annex } from '../../../models/annex';
import { Installment } from '../../../models/installment';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import * as moment from 'moment';
import { ContractsService } from '../../../service/contracts.service';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {
  countInstallment: number;
  countAnnex: number;
  annexArray: number[];
  startOfEvaluationDate: Date;
  endOfEvaluationDate: Date;
  startImplementationDeadline: Date;
  endImplementationDeadline: Date;
  arrayInstallments: number[];
  filesToUpload: Array<File>;
  contract: Contract = {
    activityTitle: '',
    procurementNo: 0,
    procurementType: 0,
    procurementValue: 0,
    procurementProcedure: 0,
    planned: 0,
    budget: 0,
    initiationDate: new Date(),
    approvalDateOfFunds: new Date(),
    torDate: new Date(),
    contractPublicationDate: new Date(),
    complaintsToAuthority1: 0,
    complaintsToOshp1: 0,
    bidOpeningDateTime: new Date(),
    contractNoOfDownloads: 0,
    contractNoOfOffers: 0,
    noOfOffersForContract: 0,
    startingOfEvaluationDate: new Date(),
    endingOfEvaluationDate: new Date(),
    noOfRefusedBids: 0,
    reapprovalDate: new Date(),
    standardeDocumentsForOe: new Date(),
    publicationDateOfGivenContract: new Date(),
    cancellationNoticeDate: new Date(),
    complaintsToAuthority2: 0,
    complaintsToOshp2: 0,
    predictedContractValue: 0,
    oeType: 0,
    applicationDeadlineType: 0,
    contractCriteria: 0,
    retender: '',
    status: 0,
    nameOfContractedOe: '',
    signingDate: new Date(),
    contractImplementationDeadlineStartingDate: new Date(),
    contractImplementationDeadlineEndingDate: new Date(),
    contractClosingDate: new Date(),
    noOfPaymentInstallments: new Date(),
    totalAmountOfAllAnnexContractsIncludingTaxes: '',
    annexes: [],
    installments: [],
    lastInstallmendPayDate: new Date(),
    lastInstallmendAmount: '',
    discountAmount: 0,
    totalAmount: '',
    department: '',
    nameOfProdcurementOffical: ''
  };
  constructor(public contractsService: ContractsService) {
    this.countInstallment = 1;
    this.countAnnex = 1;
    this.annexArray = [];
    this.arrayInstallments = [];

    const annex: Annex = {
      totalValueOfAnnexContract1: '',
      annexContractSigningDate1: new Date()
    };
    this.contract.annexes.push(annex);

    const installment: Installment = {
      installmentPayDate1: null,
      installmentAmount1: ''
    };
    this.contract.installments.push(installment);

  }
  @ViewChild('fileInput') fileInput;
  ngOnInit() {
    function checkFile(file) {
      const extension = file.substr((file.lastIndexOf('.') + 1));
      if (!/(pdf|zip|doc)$/ig.test(extension)) {
        alert('Invalid file type: ' + extension + '.  Please use DOC, PDF or Zip.');
      }
    }
  }

  addInstallments() {
    const installment: Installment = {
      installmentPayDate1: null,
      installmentAmount1: ''
    };

    this.contract.installments.push(installment);
    this.arrayInstallments.push(++this.countInstallment);
  }
  removeInstallment() {
    this.contract.installments.pop();
    this.arrayInstallments.pop();
    --this.countInstallment;
  }

  addAnnex() {
    const annex: Annex = {
      totalValueOfAnnexContract1: '',
      annexContractSigningDate1: null
    };
    this.contract.annexes.push(annex);
    this.annexArray.push(++this.countAnnex);
  }

  removeAnnex() {
    this.contract.annexes.pop();
    this.annexArray.pop();
    --this.countAnnex;
  }


  monDiff(d1, d2): number {
    const date1 = moment(d1);
    const date2 = moment(d2);
    return moment(d2).diff(d1, 'months') >= 1 ? moment(d2).diff(d1, 'months') : moment(d2).diff(d1, 'days');
  }

  fileChangeEvent(event) {
    this.filesToUpload = <Array<File>>event.target.files;
    console.log(this.filesToUpload);
  }

  addContract() {
    const formData = new FormData();
    formData.append("file", this.filesToUpload[0], this.filesToUpload[0]['name']);
    formData.append('contract', JSON.stringify(this.contract));
    this.contractsService.addContract(formData).subscribe(res => {
      console.log(res);
    });
  }

}
