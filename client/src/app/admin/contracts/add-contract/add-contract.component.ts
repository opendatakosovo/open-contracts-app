import { Component, OnInit, ViewChild } from '@angular/core';
import { Contract } from '../../../models/contract';
import { Annex } from '../../../models/annex';
import { Installment } from '../../../models/installment';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import * as moment from 'moment';
import { ContractsService } from '../../../service/contracts.service';
import Swal from 'sweetalert2';

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
  contract: Contract;
  constructor(public contractsService: ContractsService) {
    this.countInstallment = 1;
    this.countAnnex = 1;
    this.annexArray = [];
    this.arrayInstallments = [];
    this.contract = new Contract();
    console.log(this.contract);
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
      installmentAmount1: 0
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
      totalValueOfAnnexContract1: 0,
      annexContractSigningDate1: null
    };
    this.contract.contract.annexes.push(annex);
    this.annexArray.push(++this.countAnnex);
  }

  removeAnnex() {
    this.contract.contract.annexes.pop();
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
    console.log(this.filesToUpload.length);
  }

  addContract(e, isValid) {
    e.preventDefault();
    console.log(isValid);
    const formData = new FormData();
    // formData.append('file', this.filesToUpload[0], this.filesToUpload[0]['name']);
    // formData.append('contract', JSON.stringify(this.contract));
    // this.contractsService.addContract(formData).subscribe(res => {
    //   if (res.err) {
    //     Swal('Gabim!', 'Kontrata nuk u shtua.', 'error');
    //   } else if (res.errVld) {
    //     let errList = '';
    //     for (const v of res.errVld) {
    //       errList += `<li>${v}</li>`;
    //     }
    //     const htmlData = `<div style="text-align: center;">${errList}</div>`;
    //     Swal({
    //       title: 'Kujdes!',
    //       html: htmlData,
    //       width: 750,
    //       type: 'info',
    //       confirmButtonText: 'Kthehu te forma'
    //     });
    //   } else {
    //     Swal('Sukses!', 'Kontrata u shtua me sukses.', 'success');
    //   }
    // });
  }
}
