import { Component, OnInit, ViewChild } from '@angular/core';
import { Contract } from '../../../models/contract';
import { ValidatorFn } from '@angular/forms/src/directives/validators';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {
  countInstallment: number;
  countAnnex: number;
  contracts: Contract[];
  installments: Array<number> = [];
  annexes: Array<number> = [];
  contract: Contract = {
    activityTitle: '',
    publicationDate: '',
    noOfDownloads: '',
    noOfOffers: '',
    dateOfGivenContractPublication: '',
    dateOfNoticeCancellations: '',
    nameOfOE: '',
    signingDate: '',
    startDateOfImplemetation: '',
    contractClosingDate: '',
    predictedContractAmount: '',
    totalAmount: '',
 };
  constructor() {
    this.countInstallment = 1;
    this.countAnnex = 1;
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
    this.installments.push(this.countInstallment);
    ++this.countInstallment;
  }
  removeInstallment() {
    this.installments.pop();
    --this.countInstallment;
  }
  addAnnex() {
    this.annexes.push(this.countAnnex);
    ++this.countAnnex;
  }
  removeAnnex() {
    this.annexes.pop();
    --this.countAnnex;
  }
}
