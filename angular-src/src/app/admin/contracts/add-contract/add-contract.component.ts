import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Contract } from '../../../models/contract';
import { ValidatorFn } from '@angular/forms/src/directives/validators';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {

  contracts: Contract[];

  @ViewChild('fileInput') fileInput;
  

  ngOnInit() { 
    function checkFile(file) {
      var extension = file.substr((file.lastIndexOf('.') +1));
      if (!/(pdf|zip|doc)$/ig.test(extension)) {
        alert("Invalid file type: "+extension+".  Please use DOC, PDF or Zip.");
      }
    }
  }

  contract:Contract = { 
    activityTitle: "",
    publicationDate: "",
    noOfDownloads: "",
    noOfOffers: "",
    dateOfGivenContractPublication: "",
    dateOfNoticeCancellations: "",
    nameOfOE: "",
    signingDate: "",
    startDateOfImplemetation: "",
    contractClosingDate: "",
    predictedContractAmount: "",
    totalAmount: "",
 };


}
