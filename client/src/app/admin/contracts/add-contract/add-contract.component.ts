import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Contract } from '../../../models/contract';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { InstallmentComponent } from '../installment/installment.component';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {
  @ViewChild( 'InstallmentComponent' ) installment: InstallmentComponent;
  counter: number;
  contracts: Contract[];
  iterates: Array<number> = [];
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
    this.counter = 1;
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
    this.iterates.push(this.counter);
    ++this.counter;
    console.log(this.iterates);
  }
}
