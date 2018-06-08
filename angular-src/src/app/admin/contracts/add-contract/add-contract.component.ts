import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Contract } from '../../../models/contract';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
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

 private upload() {
  const fileBrowser = this.fileInput.nativeElement;
  if (fileBrowser.files && fileBrowser.files[0]) {
    const formData = new FormData();
    formData.append('files', fileBrowser.files[0]);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/Data/UploadFiles', true);
    xhr.onload = function () {
      if (this['status'] === 200) {
          const responseText = this['responseText'];
          const files = JSON.parse(responseText);
          //todo: emit event
      } else {
        //todo: error handling
      }
    };
    xhr.send(formData);
  }
}

}
