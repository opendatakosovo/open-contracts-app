import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '../../../models/contract';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {

  contracts: Contract[];
  

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

}
