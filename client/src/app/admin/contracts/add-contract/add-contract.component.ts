import { Component, OnInit, ViewChild } from '@angular/core';
import { Contract } from '../../../models/contract';
import { Annex } from '../../../models/annex';
import { Subject } from 'rxjs/Subject';
import { Installment } from '../../../models/installment';
import * as moment from 'moment';
import { ContractsService } from '../../../service/contracts.service';
import Swal from 'sweetalert2';
import { Directorate } from '../../../models/directorates';
import { DirectorateService } from '../../../service/directorate.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomValidator } from '../../../validators/custom-validator';
import { Router } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  startOfEvaluationDate: Date;
  endOfEvaluationDate: Date;
  startImplementationDeadline: Date;
  endImplementationDeadline: Date;
  arrayInstallments: number[];
  filesToUpload: File = null;
  contract: Contract;
  directorates: Directorate[];
  bsConfig: Partial<BsDatepickerConfig>;
  public form: FormGroup;
  valid = false;
  touched: boolean;
  message: string;
  formArrayAnnexes: FormArray;
  formArrayInstallments: FormArray;
  total: Number;
  totalInstallments: Number;
  currentUser: User;

  constructor(public contractsService: ContractsService, public directorateService: DirectorateService, private _fb: FormBuilder, private router: Router) {

    this.directorates = [];
    this.contract = new Contract();
    this.formArrayAnnexes = new FormArray([]);
    this.formArrayInstallments = new FormArray([]);
    this.directorateService.getAllDirectorates()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        data.forEach(element => {
          if (element.directorateIsActive === true) {
            this.directorates.push(element);
          }
        });
      });
    this.form = _fb.group({
      activityTitle: new FormControl('', Validators.required),
      procurementNo: new FormControl(null, [Validators.required, CustomValidator.isZero()]),
      procurementType: '',
      procurementValue: '',
      procurementProcedure: '',
      planned: null,
      budget: '',
      initiationDate: null,
      approvalDateOfFunds: '',
      torDate: null,
      publicationDate: null,
      complaintsToAuthority1: '',
      complaintsToOshp1: '',
      bidOpeningDate: null,
      noOfCompaniesWhoDownloadedTenderDoc: null,
      noOfCompaniesWhoSubmited: null,
      startingOfEvaluationDate: null,
      endingOfEvaluationDate: null,
      reapprovalDate: null,
      standardDocuments: '',
      cancellationNoticeDate: null,
      complaintsToAuthority2: '',
      complaintsToOshp2: '',
      predictedValue: '',
      applicationDeadlineType: '',
      criteria: '',
      retender: '',
      type: '',
      noOfRefusedBids: null,
      publicationDateOfGivenContract: null,
      status: '',
      companyName: '',
      headquartersName: '',
      signingDate: null,
      implementationDeadlineNumber: null,
      implementationDeadlineDuration: '',
      closingDate: null,
      noOfPaymentInstallments: null,
      totalAmountOfContractsIncludingTaxes: '',
      totalAmountOfAllAnnexContractsIncludingTaxes: '',
      lastInstallmentPayDate: null,
      lastInstallmentAmount: '',
      discountAmountFromContract: '',
      totalPayedPriceForContract: '',
      year: '',
      fppClassification: new FormControl(null, Validators.maxLength(2)),
      directorate: '',
      nameOfProcurementOffical: '',
      annexes: this.formArrayAnnexes,
      installments: this.formArrayInstallments
    });
    this.initAnnexes();
    this.initInstallments();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  @ViewChild('fileInput') fileInput;

  ngOnInit() {
    if (this.currentUser.role !== 'superadmin' && this.currentUser.role !== 'admin') {
      this.router.navigate(['/dashboard']);
    }
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', dateInputFormat: 'DD-MM-YYYY' });
  }

  onClick() {
    this.fileInput.nativeElement.click();
  }

  addInstallment(installment: Installment) {
    return this._fb.group({
      installmentAmount1: '',
      installmentPayDate1: null
    });
  }

  addNewInstallment() {
    this.contract.installments.push({
      installmentAmount1: '',
      installmentPayDate1: null
    });
    const arrControl = this.formArrayInstallments;
    arrControl.push(this.addInstallment({
      installmentAmount1: '',
      installmentPayDate1: null
    }));
  }

  removeInstallment(i) {
    this.contract.installments.splice(i, 1);
    const arrControl = this.formArrayInstallments;
    arrControl.removeAt(i);
  }

  initInstallments() {
    const arrControl = this.formArrayInstallments;
    this.contract.installments.map(installment => {
      arrControl.push(this.addInstallment(installment));
    });
  }

  addAnnex(annex: Annex) {
    return this._fb.group({
      totalValueOfAnnexContract1: annex.totalValueOfAnnexContract1,
      annexContractSigningDate1: annex.annexContractSigningDate1
    });
  }

  addNewAnnex() {
    this.contract.contract.annexes.push({
      totalValueOfAnnexContract1: '',
      annexContractSigningDate1: null
    });
    const arrControl = this.formArrayAnnexes;
    arrControl.push(this.addAnnex({
      totalValueOfAnnexContract1: '',
      annexContractSigningDate1: null
    }));
  }
  removeAnnex(i) {
    this.contract.contract.annexes.splice(i, 1);
    const arrControl = this.formArrayAnnexes;
    arrControl.removeAt(i);
  }

  initAnnexes() {
    const arrControl = this.formArrayAnnexes;
    this.contract.contract.annexes.map(annex => {
      arrControl.push(this.addAnnex(annex));
    });
  }

  calculateValues() {
    let sumAnnex = 0;
    this.contract.contract.annexes.map(annex => {
      sumAnnex += parseFloat(annex.totalValueOfAnnexContract1.toString());
    });
    this.total = parseFloat(this.contract.contract.totalAmountOfContractsIncludingTaxes.toString()) + sumAnnex;
    this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes = this.total.toString();

    let sumInstallments = 0;
    this.contract.installments.map(installment => {
      sumInstallments += parseFloat(installment.installmentAmount1.toString());
    });
    this.totalInstallments = parseFloat(this.contract.lastInstallmentAmount.toString()) + sumInstallments;
    this.contract.contract.totalPayedPriceForContract = this.totalInstallments.toString();
  }

  monDiff(d1, d2): number {
    return moment(d2).diff(d1, 'months') >= 1 ? moment(d2).diff(d1, 'months') : moment(d2).diff(d1, 'days');
  }

  fileChangeEvent(event) {
    if (event.target.files.length > 0 || this.filesToUpload == null) {
      this.filesToUpload = event.target.files[0];
      const nameArea = <HTMLInputElement>document.getElementById('name-area');
      nameArea.value = this.filesToUpload.name;
      this.touched = true;
      if (this.filesToUpload.type !== 'application/pdf') {
        this.valid = false;
        this.message = 'Tipi dokumentit nuk është valid, duhet të jetë i tipit pdf';
      } else {
        this.valid = true;
      }
    }
  }

  removeFile() {
    this.filesToUpload = null;
    const nameArea = <HTMLInputElement>document.getElementById('name-area');
    nameArea.value = 'Bashkangjit dokumentin';
    this.valid = false;
    this.touched = false;
  }

  addBudgetValue(event) {
    if (event.target.checked === false) {
      this.contract.budget.splice(this.contract.budget.indexOf(event.target.value), 1);
    } else if (event.target.checked === true) {
      this.contract.budget.push(event.target.value);
    }
  }

  addContract(e) {
    e.preventDefault();
    this.calculateValues();
    if (this.form.valid === true) {
      if (this.filesToUpload !== null && this.valid === true) {
        if (this.form.value.implementationDeadlineNumber !== null && this.form.value.implementationDeadlineNumber !== '') {
          if (this.form.value.implementationDeadlineDuration !== '') {
          this.contract.contract.implementationDeadline = this.form.value.implementationDeadlineNumber + ' ' + this.form.value.implementationDeadlineDuration;
        }} else {
          this.contract.contract.implementationDeadline = '';
        }
        this.contract.approvalDateOfFunds =
          this.contract.approvalDateOfFunds == null ? null : this.dateChange(this.contract.approvalDateOfFunds);
        this.contract.bidOpeningDate = this.contract.bidOpeningDate == null ? null : this.dateChange(this.contract.bidOpeningDate);
        this.contract.endingOfEvaluationDate =
          this.contract.endingOfEvaluationDate == null ? null : this.dateChange(this.contract.endingOfEvaluationDate);
        this.contract.initiationDate = this.contract.initiationDate == null ? null : this.dateChange(this.contract.initiationDate);
        this.contract.cancellationNoticeDate =
          this.contract.cancellationNoticeDate == null ? null : this.dateChange(this.contract.cancellationNoticeDate);
        this.contract.reapprovalDate = this.contract.reapprovalDate == null ? null : this.dateChange(this.contract.reapprovalDate);
        this.contract.startingOfEvaluationDate =
          this.contract.startingOfEvaluationDate == null ? null : this.dateChange(this.contract.startingOfEvaluationDate);
        this.contract.lastInstallmentPayDate =
          this.contract.lastInstallmentPayDate == null ? null : this.dateChange(this.contract.lastInstallmentPayDate);
        this.contract.contract.publicationDate =
          this.contract.contract.publicationDate == null ? null : this.dateChange(this.contract.contract.publicationDate);
        this.contract.contract.publicationDateOfGivenContract =
          this.contract.contract.publicationDateOfGivenContract ==
            null ? null : this.dateChange(this.contract.contract.publicationDateOfGivenContract);
        this.contract.contract.closingDate =
          this.contract.contract.closingDate == null ? null : this.dateChange(this.contract.contract.closingDate);
        this.contract.contract.signingDate =
          this.contract.contract.signingDate == null ? null : this.dateChange(this.contract.contract.signingDate);
        if (this.contract.installments.length > 1) {
          for (const installment of this.contract.installments) {
            installment.installmentPayDate1 = this.dateChange(installment.installmentPayDate1);
          }
        }

        if (this.contract.contract.annexes.length > 1) {
          for (const annex of this.contract.contract.annexes) {
            annex.annexContractSigningDate1 = this.dateChange(annex.annexContractSigningDate1);
          }
        }
        const formData = new FormData();
        formData.append('file', this.filesToUpload, this.filesToUpload['name']);
        formData.append('contract', JSON.stringify(this.contract));
        Swal({
          title: 'Duke e importuar setin e të dhënave',
          onOpen: () => {
            Swal.showLoading();
          }
        });
        this.contractsService.addContract(formData, 'multipart')
          .takeUntil(this.unsubscribeAll)
          .subscribe(res => {
            if (res.existErr) {
              Swal('Kujdes!', 'Dokumenti Kontratës ekziston!.', 'warning');
            } else if (res.typeValidation) {
              Swal('Kujdes!', 'Tipi Dokumentit Kontratës është i gabuar.', 'warning');
            } else if (res.errVld) {
              let errList = '';
              for (const v of res.errVld) {
                errList += `<li>${v}</li>`;
              }
              const htmlData = `<div style="text-align: center;">${errList}</div>`;
              Swal({
                title: 'Kujdes!',
                html: htmlData,
                width: 750,
                type: 'info',
                confirmButtonText: 'Kthehu te forma'
              });
            } else if (res.err) {
              Swal('Gabim!', 'Kontrata nuk u shtua.', 'error');
            } else {
              Swal('Sukses!', 'Kontrata u shtua me sukses.', 'success').then((result) => {
                if (result.value) {
                  this.router.navigate(['/dashboard/contracts']);
                }
              });
            }
          });
      } else if (this.filesToUpload === null) {
        if (this.form.value.implementationDeadlineNumber !== null && this.form.value.implementationDeadlineDuration !== '') {
          this.contract.contract.implementationDeadline = this.form.value.implementationDeadlineNumber + ' ' + this.form.value.implementationDeadlineDuration;
        } else {
          this.contract.contract.implementationDeadline = '';
        }
        this.contract.approvalDateOfFunds =
          this.contract.approvalDateOfFunds == null ? null : this.dateChange(this.contract.approvalDateOfFunds);
        this.contract.bidOpeningDate = this.contract.bidOpeningDate == null ? null : this.dateChange(this.contract.bidOpeningDate);
        this.contract.endingOfEvaluationDate =
          this.contract.endingOfEvaluationDate == null ? null : this.dateChange(this.contract.endingOfEvaluationDate);
        this.contract.initiationDate = this.contract.initiationDate == null ? null : this.dateChange(this.contract.initiationDate);
        this.contract.cancellationNoticeDate =
          this.contract.cancellationNoticeDate == null ? null : this.dateChange(this.contract.cancellationNoticeDate);
        this.contract.reapprovalDate = this.contract.reapprovalDate == null ? null : this.dateChange(this.contract.reapprovalDate);
        this.contract.startingOfEvaluationDate =
          this.contract.startingOfEvaluationDate == null ? null : this.dateChange(this.contract.startingOfEvaluationDate);
        this.contract.lastInstallmentPayDate =
          this.contract.lastInstallmentPayDate == null ? null : this.dateChange(this.contract.lastInstallmentPayDate);
        this.contract.contract.publicationDate =
          this.contract.contract.publicationDate == null ? null : this.dateChange(this.contract.contract.publicationDate);
        this.contract.contract.publicationDateOfGivenContract =
          this.contract.contract.publicationDateOfGivenContract ==
            null ? null : this.dateChange(this.contract.contract.publicationDateOfGivenContract);
        this.contract.contract.closingDate =
          this.contract.contract.closingDate == null ? null : this.dateChange(this.contract.contract.closingDate);
        this.contract.contract.signingDate =
          this.contract.contract.signingDate == null ? null : this.dateChange(this.contract.contract.signingDate);
        if (this.contract.installments.length > 1) {
          for (const installment of this.contract.installments) {
            installment.installmentPayDate1 = this.dateChange(installment.installmentPayDate1);
          }
        }

        if (this.contract.contract.annexes.length > 1) {
          for (const annex of this.contract.contract.annexes) {
            annex.annexContractSigningDate1 = this.dateChange(annex.annexContractSigningDate1);
          }
        }
        this.contractsService.addContract(this.contract)
          .takeUntil(this.unsubscribeAll)
          .subscribe(res => {
            if (res.errVld) {
              let errList = '';
              for (const v of res.errVld) {
                errList += `<li>${v}</li>`;
              }
              const htmlData = `<div style="text-align: center;">${errList}</div>`;
              Swal({
                title: 'Kujdes!',
                html: htmlData,
                width: 750,
                type: 'info',
                confirmButtonText: 'Kthehu te forma'
              });
            } else if (res.err) {
              Swal('Gabim!', 'Kontrata nuk u shtua.', 'error');
            } else {
              Swal('Sukses!', 'Kontrata u shtua me sukses.', 'success').then((result) => {
                if (result.value) {
                  this.router.navigate(['/dashboard/contracts']);
                }
              });
            }
          });
      }

    }
  }

  dateChange(date) {
    const oldDate = new Date(date);
    return new Date(oldDate.getTime() + Math.abs(oldDate.getTimezoneOffset() * 60000));
  }
}
