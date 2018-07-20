import { Component, OnInit, ViewChild } from '@angular/core';
import { Contract } from '../../../models/contract';
import { Directorate } from '../../../models/directorates';
import { Annex } from '../../../models/annex';
import { Installment } from '../../../models/installment';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import * as moment from 'moment';
import { ContractsService } from '../../../service/contracts.service';
import { DirectorateService } from '../../../service/directorate.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.css']
})
export class EditContractComponent implements OnInit {
  directorates: Directorate[];
  countInstallment: number;
  countAnnex: number;
  annexArray: number[];
  startOfEvaluationDate: Date;
  endOfEvaluationDate: Date;
  startImplementationDeadline: Date;
  endImplementationDeadline: Date;
  arrayInstallments: number[];
  filesToUpload: Array<File>;
  contract: Contract;
  constructor(public contractsService: ContractsService, private router: ActivatedRoute, public directorateService: DirectorateService) {
    this.directorates = [];
    // this.countInstallment = 1;
    // this.countAnnex = 1;
    // this.annexArray = [];
    // this.arrayInstallments = [];
    // this.contract = new Contract();
    // const id = this.router.snapshot.paramMap.get('id');
    // this.contractsService.getContractByID(id).subscribe(data => {
    //   this.contract = data;
    //   if (this.contract.contract.annexes.length === 0) {
    //     const annex: Annex = {
    //       totalValueOfAnnexContract1: null,
    //       annexContractSigningDate1: null
    //     };
    //     this.contract.contract.annexes.push(annex);
    //   }

    //   if (this.contract.installments.length === 0) {
    //     const installment: Installment = {
    //       installmentPayDate1: null,
    //       installmentAmount1: null
    //     };
    //     this.contract.installments.push(installment);
    //   }
    // });
    this.directorateService.getAllDirectorates().subscribe(data => {
      this.directorates = data;
    });
  }
  @ViewChild('fileInput') fileInput;

  addInstallments() {
    // // const installment: Installment = {
    // //   installmentPayDate1: new Date(),
    // //   installmentAmount1: 0
    // // };

    // this.contract.installments.push(installment);
    // this.arrayInstallments.push(++this.countInstallment);
  }

  removeInstallment() {
    // this.contract.installments.pop();
    // this.arrayInstallments.pop();
    // --this.countInstallment;
  }

  addAnnex() {
    // const annex: Annex = {
    //   totalValueOfAnnexContract1: 0,
    //   annexContractSigningDate1: new Date()
    // };
    // this.contract.contract.annexes.push(annex);
    // this.annexArray.push(++this.countAnnex);
  }

  removeAnnex() {
    // this.contract.contract.annexes.pop();
    // this.annexArray.pop();
    // --this.countAnnex;
  }

  fileChangeEvent(event) {
    this.filesToUpload = <Array<File>>event.target.files;
  }
  ngOnInit() {
  }

}
