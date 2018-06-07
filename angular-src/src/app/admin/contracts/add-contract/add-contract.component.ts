import { Component, OnInit, Input } from '@angular/core';

import { Contract } from '../../../../../../models/contract';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {

  @Input('contract') contract: Contract;
  

  constructor() { }

  ngOnInit() {
    let activityTitle = this.contract.activityTitle;
    this.contract.publicationDate = '';
    this.contract.noOfDownloads = '';
    this.contract.noOfOffers = '';
    this.contract.dateOfGivenContractPublication = '';
    this.contract.dateOfNoticeCancellations = '';
    this.contract.nameOfOE = '';
    this.contract.signingDate = '';
    this.contract.startDateOfImplemetation = '';
    this.contract.contractClosingDate = '';
    this.contract.predictedContractAmount = '';
    this.contract.totalAmount = '';
  }

}
