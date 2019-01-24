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
import { DatasetService } from '../../../service/dataset.service';
import { Lot } from '../../../models/lot';
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
  docsToUpload: File[] = [];
  docsFileNames = [];
  contract: Contract;
  directorates: Directorate[];
  bsConfig: Partial<BsDatepickerConfig>;
  public form: FormGroup;
  valid = false;
  touched: boolean;
  message: string;
  formArrayAnnexes: FormArray;
  formArrayInstallments: FormArray;
  total: number;
  totalInstallments: number;
  currentUser: User;
  lastTransaction: Date;
  lastTransactionAmount: number;
  budget: string;
  planned: string;
  retender: string;
  payeeId: string;
  payerId: string;
  tenderStatus: string;
  documents: FormArray;
  fppClassification: number;
  formArrayLots: FormArray;

  constructor(public contractsService: ContractsService, public directorateService: DirectorateService, private _fb: FormBuilder, private router: Router, public datasetService: DatasetService) {
    this.directorates = [];
    this.contract = new Contract();
    this.formArrayAnnexes = new FormArray([]);
    this.formArrayInstallments = new FormArray([]);
    this.formArrayLots = new FormArray([]);
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
      implementationDeadlineNumberLot: null,
      implementationDeadlineDurationLot: '',
      closingDate: null,
      noOfPaymentInstallments: null,
      valueOfLot: null,
      totalAmountOfContractsIncludingTaxes: '',
      totalAmountOfAllAnnexContractsIncludingTaxes: '',
      lastInstallmentPayDate: null,
      lastInstallmentAmount: '',
      discountAmountFromContract: '',
      totalPayedPriceForContract: '',
      year: new FormControl(null, [Validators.required, CustomValidator.isZero()]),
      fppClassification: new FormControl(null, Validators.maxLength(2)),
      directorate: '',
      nameOfProcurementOffical: '',
      annexes: this.formArrayAnnexes,
      installments: this.formArrayInstallments,
      lots: this.formArrayLots,
      documents: _fb.array([])
    });
    this.initAnnexes();
    this.initInstallments();
    this.initLot();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.budget = '';
  }

  @ViewChild('fileInput') fileInput;
  @ViewChild('docInput') docInput;

  ngOnInit() {
    if (this.currentUser.role !== 'superadmin' && this.currentUser.role !== 'admin') {
      this.router.navigate(['/dashboard']);
    }
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', dateInputFormat: 'DD-MM-YYYY' });
  }

  onClick() {
    this.fileInput.nativeElement.click();
  }

  docsButtonClick(index) {
    document.getElementById('doc-' + index).click();
  }

  addInstallment(installment: Installment) {
    return this._fb.group({
      id: installment.id,
      date: installment.date,
      value: installment.value.amount,
      payerId: installment.payer.id,
      payerName: installment.payer.name,
      payeeId: installment.payee.id,
      payeeName: installment.payee.name,
      currency: installment.value.currency
    });
  }

  addLot(lot: Lot) {
    return this._fb.group({
      id: lot.id,
      description: lot.description,
      value: lot.value.amount
    });
  }

  addNewInstallment() {
    this.contract.releases[0].contracts[0].implementation.transactions.push({
      id: '',
      date: null,
      payer: {
        id: '',
        name: ''
      },
      payee: {
        id: '',
        name: ''
      },
      value: {
        amount: 0,
        currency: 'EUR'
      }
    });
    const arrControl = this.formArrayInstallments;
    arrControl.push(this.addInstallment({
      id: '',
      date: null,
      payer: {
        id: '',
        name: ''
      },
      payee: {
        id: '',
        name: ''
      },
      value: {
        amount: 0,
        currency: 'EUR'
      }
    }));
  }

  addNewLot() {
    this.contract.releases[0].tender.lots.push({
      id: '',
      description: '',
      value: {
        amount: 0,
        currency: 'EUR'
      }
    });
    const arrControl = this.formArrayLots;
    arrControl.push(this.addLot({
      id: '',
      description: '',
      value: {
        amount: 0,
        currency: 'EUR'
      }
    }));
  }

  removeInstallment(i) {
    this.contract.releases[0].contracts[0].implementation.transactions.splice(i, 1);
    const arrControl = this.formArrayInstallments;
    arrControl.removeAt(i);
  }

  removeLot(i) {
    this.contract.releases[0].tender.lots.splice(i, 1);
    const arrControl = this.formArrayLots;
    arrControl.removeAt(i);
  }

  initInstallments() {
    const arrControl = this.formArrayInstallments;
    this.contract.releases[0].contracts[0].implementation.transactions.map(installment => {
      arrControl.push(this.addInstallment(installment));
    });
  }

  initLot() {
    const arrControl = this.formArrayLots;
    this.contract.releases[0].tender.lots.map(lot => {
      arrControl.push(this.addLot(lot));
    });
  }

  addAnnex(annex: Annex) {
    return this._fb.group({
      description:
        annex.description,
      date: annex.date
    });
  }

  addNewAnnex() {
    this.contract.releases[0].contracts[0].amendments.push({
      description: '',
      date: null
    });
    const arrControl = this.formArrayAnnexes;
    arrControl.push(this.addAnnex({
      description: '',
      date: null
    }));
  }
  removeAnnex(i) {
    this.contract.releases[0].contracts[0].amendments.splice(i, 1);
    const arrControl = this.formArrayAnnexes;
    arrControl.removeAt(i);
  }

  initAnnexes() {
    const arrControl = this.formArrayAnnexes;
    this.contract.releases[0].contracts[0].amendments.map(annex => {
      arrControl.push(this.addAnnex(annex));
    });
  }

  calculateValues() {
    let sumAnnex = 0;
    this.contract.releases[0].contracts[0].amendments.map(annex => {
      sumAnnex += parseFloat(annex.description.toString());
    });
    this.total = parseFloat(this.contract.releases[0].tender.value.amount.toString()) + sumAnnex;
    this.contract.releases[0].contracts[0].value.amount = parseFloat(this.total.toString());
    let sumInstallments = 0;
    this.contract.releases[0].contracts[0].implementation.transactions.map(installment => {
      sumInstallments += parseFloat(installment.value.amount.toString());
    });
    if (this.contract.releases[0].contracts[0].implementation.transactions.length > 0) {
      this.contract.releases[0].contracts[0].implementation.finalValue.amount = sumInstallments;
    } else {
      this.contract.releases[0].contracts[0].implementation.finalValue.amount = 0;
    }
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

  addDocument() {
    this.documents = this.form.get('documents') as FormArray;
    this.documents.push(
      this._fb.group({
        doc: '',
        error: false,
        errorMsg: ''
      })
    );
  }

  removeDocument(id) {
    this.documents.removeAt(id);
  }

  docsChangeEvent(event, index) {
    const docsTypes = ['application/msword', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel'];
    if (event.target.files.length > 0) {
      const theFile = event.target.files[0];
      if (docsTypes.includes(theFile.type)) {
        const nameArea = <HTMLInputElement>document.getElementById('docname' + index);
        nameArea.value = theFile.name;
        const newFileName = theFile.name.slice(0, -4) + '-' + Date.now() + '.pdf';
        const newFile = new File([theFile], newFileName);
        this.docsToUpload.push(newFile);
        this.docsFileNames.push(newFileName);
        this.documents.controls[index].setValue({ doc: '', error: false, errorMsg: '' });
      } else {
        this.documents.controls[index].setValue({ doc: '', error: true, errorMsg: 'Tipi dokumentit nuk është valid, duhet të jetë i tipit pdf, docx, doc ose xls' });
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
      this.budget = this.budget.replace(event.target.value, '');
    } else if (event.target.checked === true && !this.budget.includes(event.target.value)) {
      this.budget = this.budget + ' ' + event.target.value;
      if (this.budget.includes('  ')) {
        this.budget = this.budget.replace('  ', ' ');
      }
    }
    this.contract.releases[0].planning.budget.description = this.budget;
  }

  milestoneId(code) {
    const milestones_id = Math.random().toString(36).substr(2, 9) + '-' + code;
    return milestones_id;
  }

  ocidMaker(value) {
    let year;
    let ocid = '';
    if (this.contract.year !== null && this.contract.year !== undefined) {
      const foo = '' + this.contract.year;
      year = foo.slice(2, 4);
    } else {
      year = 0;
    }
    ocid = 'ocds-3n5h6d-' + this.contract.releases[0].tender.id + '-' + year + value;
    return ocid;
  }

  changeValues() {
    this.payeeId = Math.random().toString(36).substr(2, 9) + '-payee';
    this.payerId = Math.random().toString(36).substr(2, 9) + '-payer';
    if (this.form.value.implementationDeadlineNumber !== null && this.form.value.implementationDeadlineDuration !== '') {
      this.contract.releases[0].tender.contractPeriod.durationInDays = this.form.value.implementationDeadlineNumber + ' ' + this.form.value.implementationDeadlineDuration;

      this.contract.releases[0].awards[0].contractPeriod.durationInDays = this.form.value.implementationDeadlineNumber + ' ' + this.form.value.implementationDeadlineDuration;

      this.contract.releases[0].contracts[0].period.durationInDays = this.form.value.implementationDeadlineNumber + ' ' + this.form.value.implementationDeadlineDuration;
    } else {
      this.contract.releases[0].tender.contractPeriod.durationInDays = '';
      this.contract.releases[0].awards[0].contractPeriod.durationInDays = '';
      this.contract.releases[0].contracts[0].period.durationInDays = '';
    }
    if (this.contract.releases[0].tender.lots.length > 0) {
      for (let i = 0; i < this.form.value.lots.length; i++) {
        if (this.form.value.lots[i].id !== '' && this.form.value.lots[i].description !== '') {
          this.contract.releases[0].tender.lots[i].description = this.form.value.lots[i].description + ' ' + this.form.value.lots[i].id;
        } else {
          this.contract.releases[0].tender.lots[i].description = '';
        }
      }
    }

    this.contract.releases[0].tender.awardPeriod.startDate =
      this.contract.releases[0].tender.awardPeriod.startDate == null ? null : this.dateChange(this.contract.releases[0].tender.awardPeriod.startDate);
    if (this.contract.releases[0].contracts[0].implementation.transactions.length > 0) {
      const i = this.contract.releases[0].contracts[0].implementation.transactions.length;
      this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date =
        this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date == null ? null : this.dateChange(this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date);
    }
    this.contract.releases[0].tender.date =
      this.contract.releases[0].tender.date == null ? null : this.dateChange(this.contract.releases[0].tender.date);
    this.contract.releases[0].awards[0].date =
      this.contract.releases[0].awards[0].date ==
        null ? null : this.dateChange(this.contract.releases[0].awards[0].date);
    this.contract.releases[0].contracts[0].period.endDate =
      this.contract.releases[0].contracts[0].period.endDate == null ? null : this.dateChange(this.contract.releases[0].contracts[0].period.endDate);
    this.contract.releases[0].contracts[0].period.startDate =
      this.contract.releases[0].contracts[0].period.startDate == null ? null : this.dateChange(this.contract.releases[0].contracts[0].period.startDate);
    if (this.contract.releases[0].contracts[0].implementation.transactions.length > 0) {
      for (const installment of this.contract.releases[0].contracts[0].implementation.transactions) {
        installment.date = installment.date == null ? null : this.dateChange(installment.date);
      }
    }
    if (this.contract.releases[0].contracts[0].implementation.transactions.length > 0) {
      const installmentIndex = this.contract.releases[0].contracts[0].implementation.transactions.length;
      this.lastTransaction = this.contract.releases[0].contracts[0].implementation.transactions[installmentIndex - 1].date;
      this.lastTransaction = this.lastTransaction == null ? null : this.dateChange(this.lastTransaction);
      this.lastTransactionAmount = Number(this.contract.releases[0].contracts[0].implementation.transactions[installmentIndex - 1].value.amount);
    }
    if (this.contract.releases[0].contracts[0].amendments.length > 0) {
      for (const annex of this.contract.releases[0].contracts[0].amendments) {
        annex.date = annex.date == null ? null : this.dateChange(annex.date);
      }
    }
    // Map the additional procurement category for main procurement
    if (this.contract.releases[0].tender.additionalProcurementCategories === 'goods') {
      this.contract.releases[0].tender.mainProcurementCategory = 'goods';
    } else if (this.contract.releases[0].tender.additionalProcurementCategories === 'works' || this.contract.releases[0].tender.additionalProcurementCategories === 'concessionWorks' || this.contract.releases[0].tender.additionalProcurementCategories === 'designContest' || this.contract.releases[0].tender.additionalProcurementCategories === 'immovableProperty') {
      this.contract.releases[0].tender.mainProcurementCategory = 'works';
    } else if (this.contract.releases[0].tender.additionalProcurementCategories === 'services' || this.contract.releases[0].tender.additionalProcurementCategories === 'consultingServices') {
      this.contract.releases[0].tender.mainProcurementCategory = 'services';
    }
    // Map the procurement method rationale for procurement method
    if (this.contract.releases[0].tender.procurementMethodRationale === 'openProcedure' || this.contract.releases[0].tender.procurementMethodRationale === 'negociatedProcedureAfterAwardNotice') {
      this.contract.releases[0].tender.procurementMethod = 'open';
    } else if (this.contract.releases[0].tender.procurementMethodRationale === 'limitedProcedure' || this.contract.releases[0].tender.procurementMethodRationale === 'quotationValueProcedure') {
      this.contract.releases[0].tender.procurementMethod = 'limited';
    } else if (this.contract.releases[0].tender.procurementMethodRationale === 'negociatedProcedureWithoutAwardNotice') {
      this.contract.releases[0].tender.procurementMethod = 'direct';
    } else if (this.contract.releases[0].tender.procurementMethodRationale === 'designContest' || this.contract.releases[0].tender.procurementMethodRationale === 'minimalValueProcedure') {
      this.contract.releases[0].tender.procurementMethod = 'selective';
    }
    // Fill the item tender with the fppClassification number
    if (this.fppClassification !== 0 && this.fppClassification !== null) {
      this.contract.releases[0].tender.items.push({
        id: Math.random().toString(36).substr(2, 9) + '-CPV' + '-' + this.fppClassification,
        description: 'The CPV number for the services provided',
        classification: {
          scheme: 'CPV',
          id: 'CPV',
          description: 'The common procurement vocabulary number'
        },
        quantity: this.fppClassification
      });
    }
    // Check if it is planned or not to fill the planning documents
    if (this.planned === 'po') {
      this.contract.releases[0].planning.documents.push({
        id: Math.random().toString(36).substr(2, 9) + '-procurementPlan',
        documentType: 'procurementPlan'
      });
    }
    // Push planning milestones
    if (this.contract.releases[0].planning.milestones[0].dateMet !== null) {
      this.contract.releases[0].planning.milestones[0].id = this.milestoneId('initiationDate');
      this.contract.releases[0].planning.milestones[0].title = 'Data e inicimit të aktivitetit të prokurimit (data e pranimit të kërkesës)';
      this.contract.releases[0].planning.milestones[0].type = 'preProcurement';
      this.contract.releases[0].planning.milestones[0].code = 'initiationDate';
      this.contract.releases[0].planning.milestones[0].status = 'met';
    }
    if (this.contract.releases[0].planning.milestones[1].dateMet !== null) {
      this.contract.releases[0].planning.milestones[1].id = this.milestoneId('approvalDateOfFunds');
      this.contract.releases[0].planning.milestones[1].title = 'Data e aprovimit të deklaratës së nevojave dhe disponueshmërisë së mjeteve';
      this.contract.releases[0].planning.milestones[1].type = 'approval';
      this.contract.releases[0].planning.milestones[1].code = 'approvalDateOfFunds';
      this.contract.releases[0].planning.milestones[1].status = 'met';
    }
    if (this.contract.releases[0].planning.milestones[2].dateMet !== null) {
      this.contract.releases[0].planning.milestones[2].id = this.milestoneId('torDate');
      this.contract.releases[0].planning.milestones[2].title = 'Data e pranimit të specifikimit teknik (TOR)';
      this.contract.releases[0].planning.milestones[2].type = 'assessment';
      this.contract.releases[0].planning.milestones[2].code = 'torDate';
      this.contract.releases[0].planning.milestones[2].status = 'met';
    }
    if (this.contract.releases[0].planning.milestones[3].dateMet !== null) {
      this.contract.releases[0].planning.milestones[3].id = this.milestoneId('reapprovalDate');
      this.contract.releases[0].planning.milestones[3].title = 'Data e aprovimit të Deklaratës së nevojave dhe disponueshmërisë së mjeteve - rikonfirmimi';
      this.contract.releases[0].planning.milestones[3].type = 'approval';
      this.contract.releases[0].planning.milestones[3].code = 'reapprovalDate';
      this.contract.releases[0].planning.milestones[3].status = 'met';
    }
    // Fill the bids statistics
    if (this.contract.releases[0].bids.statistics[0].value !== 0 || this.contract.releases[0].bids.statistics[0].value !== null) {
      this.contract.releases[0].bids.statistics[0].id = '0001';
      this.contract.releases[0].bids.statistics[0].measure = 'numberOfDownloads';
      this.contract.releases[0].bids.statistics[0].notes = 'Nr. i OE që kanë shkarkuar dosjen e tenderit';
    }
    if (this.contract.releases[0].bids.statistics[1].value !== 0 || this.contract.releases[0].bids.statistics[1].value !== null) {
      this.contract.releases[0].bids.statistics[1].id = '0002';
      this.contract.releases[0].bids.statistics[1].measure = 'numberOfRefusedBids';
      this.contract.releases[0].bids.statistics[1].notes = 'Numri i ofertave të refuzuara';
    }
    // Fill tender milestones
    if (this.contract.releases[0].tender.milestones[0].dateMet !== null) {
      this.contract.releases[0].tender.milestones[0].id = this.milestoneId('standardDocuments');
      this.contract.releases[0].tender.milestones[0].title = 'Letrat Standarde për OE';
      this.contract.releases[0].tender.milestones[0].type = 'engagement';
      this.contract.releases[0].tender.milestones[0].code = 'standardDocuments';
      this.contract.releases[0].tender.milestones[0].status = 'met';
    }
    if (this.contract.releases[0].tender.milestones[1].dateMet !== null) {
      this.contract.releases[0].tender.milestones[1].id = this.milestoneId('cancellationNoticeDate');
      this.contract.releases[0].tender.milestones[1].title = 'Data e publikimit të anulimit të njoftimit';
      this.contract.releases[0].tender.milestones[1].type = 'approval';
      this.contract.releases[0].tender.milestones[1].code = 'cancellationNoticeDate';
      this.contract.releases[0].tender.milestones[1].status = 'met';
    }
    // Change the dates
    this.contract.releases[0].planning.milestones[1].dateMet =
      this.contract.releases[0].planning.milestones[1].dateMet == null ? null : this.dateChange(this.contract.releases[0].planning.milestones[1].dateMet);
    this.contract.releases[0].tender.tenderPeriod.startDate = this.contract.releases[0].tender.tenderPeriod.startDate == null ? null : this.dateChange(this.contract.releases[0].tender.tenderPeriod.startDate);
    this.contract.releases[0].tender.awardPeriod.endDate =
      this.contract.releases[0].tender.awardPeriod.endDate == null ? null : this.dateChange(this.contract.releases[0].tender.awardPeriod.endDate);
    this.contract.releases[0].planning.milestones[0].dateMet = this.contract.releases[0].planning.milestones[0].dateMet == null ? null : this.dateChange(this.contract.releases[0].planning.milestones[0].dateMet);
    this.contract.releases[0].tender.milestones[1].dateMet =
      this.contract.releases[0].tender.milestones[1].dateMet == null ? null : this.dateChange(this.contract.releases[0].tender.milestones[1].dateMet);
    this.contract.releases[0].planning.milestones[3].dateMet = this.contract.releases[0].planning.milestones[3].dateMet == null ? null : this.dateChange(this.contract.releases[0].planning.milestones[3].dateMet);
    // Map enquiries based on enquiry type
    if (this.contract.releases[0].awards[0].enquiryType) {
      if (this.contract.releases[0].awards[0].enquiryType === 'none' || this.contract.releases[0].awards[0].enquiryType === 'negative') {
        this.contract.releases[0].awards[0].hasEnquiries = false;
      } else if (this.contract.releases[0].awards[0].enquiryType === 'positive') {
        this.contract.releases[0].awards[0].hasEnquiries = true;
      }
    }
    // Map complaints based on complaint type
    if (this.contract.releases[0].awards[0].complaintType) {
      if (this.contract.releases[0].awards[0].complaintType === 'none' || this.contract.releases[0].awards[0].complaintType === 'negative') {
        this.contract.releases[0].awards[0].hasComplaints = false;
      } else if (this.contract.releases[0].awards[0].complaintType === 'positive') {
        this.contract.releases[0].awards[0].hasComplaints = true;
      }
    }
    // Fill the company party
    this.contract.releases[0].parties[0].name = this.contract.releases[0].tender.tenderers[0].name;
    this.contract.releases[0].parties[0].roles = [
      'supplier',
      'tenderer',
      'payee'
    ];
    if (this.contract.releases[0].parties[0].id === '') {
      this.contract.releases[0].parties[0].id = this.payeeId;
    }
    // Fill the payer party
    if (this.contract.releases[0].parties[1].id === '') {
      this.contract.releases[0].parties[1].address.region = 'Prishtinë';
      this.contract.releases[0].parties[1].address.postalCode = '10000';
      this.contract.releases[0].parties[1].address.countryName = 'Kosovë';
      this.contract.releases[0].parties[1].contactPoint.url = 'https://kk.rks-gov.net/prishtine/';
      this.contract.releases[0].parties[1].roles = [
        'buyer',
        'payer',
        'procuringEntity'
      ];
      this.contract.releases[0].parties[1].id = this.payerId;
    }
    // Check retender value to fill related process
    if (this.retender === 'po' || this.retender === 'Po') {
      this.contract.releases[0].relatedProcesses[0].relationship = 'unsuccessfulProcess';
    }
    // Map the tender status
    if (this.tenderStatus === 'published' || this.tenderStatus === 'evaluation') {
      this.contract.releases[0].tender.status = 'active';
    } else if (this.tenderStatus === 'cancelled') {
      this.contract.releases[0].tender.status = 'cancelled';
    } else if (this.tenderStatus === 'contracted') {
      this.contract.releases[0].tender.status = 'complete';
    }
    // Fill other fields with the company name
    this.contract.releases[0].awards[0].suppliers[0].name = this.contract.releases[0].tender.tenderers[0].name;
    if (this.contract.releases[0].contracts[0].implementation.transactions.length > 0) {
      for (const transaction of this.contract.releases[0].contracts[0].implementation.transactions) {
        transaction.payee.name = this.contract.releases[0].tender.tenderers[0].name;
      }
    }
    // Fill other fields with the signing date
    this.contract.releases[0].tender.contractPeriod.startDate = this.contract.releases[0].contracts[0].period.startDate;
    this.contract.releases[0].awards[0].contractPeriod.startDate = this.contract.releases[0].contracts[0].period.startDate;
    // Fill other fields with the ending date
    this.contract.releases[0].tender.contractPeriod.endDate = this.contract.releases[0].contracts[0].period.endDate;
    this.contract.releases[0].awards[0].contractPeriod.endDate = this.contract.releases[0].contracts[0].period.endDate;
    // Fill the transactions
    for (const transaction of this.contract.releases[0].contracts[0].implementation.transactions) {
      transaction.id = Math.random().toString(36).substr(2, 9) + '-transaction';
      transaction.payee.id = this.payeeId;
      transaction.payer.id = this.payerId;
    }
    // Check for the last transaction
    if (this.contract.releases[0].contracts[0].implementation.transactions[this.contract.releases[0].contracts[0].implementation.transactions.length - 1]) {
      this.contract.releases[0].contracts[0].implementation.transactions[this.contract.releases[0].contracts[0].implementation.transactions.length - 1].id = Math.random().toString(36).substr(2, 9) + '-last-transaction';
    }
    // Fill other fields with the directorate names
    this.contract.releases[0].buyer.name = this.contract.releases[0].parties[1].name;
    for (const transaction of this.contract.releases[0].contracts[0].implementation.transactions) {
      transaction.payer.name = this.contract.releases[0].parties[1].name;
    }
    // Planning, awards, contracts id and ocid
    this.contract.releases[0].planning.budget.id = this.ocidMaker('-planning');
    this.contract.releases[0].awards[0].id = this.ocidMaker('-award');
    this.contract.releases[0].contracts[0].id = this.ocidMaker('-contract');
    this.contract.releases[0].ocid = this.ocidMaker('');
    this.contract.releases[0].id = this.ocidMaker('-contract');
    this.contract.releases[0].contracts[0].awardID = this.contract.releases[0].awards[0].id;
    // Tenderers id
    if (this.contract.releases[0].tender.tenderers[0].name && this.contract.releases[0].tender.tenderers[0].name !== '') {
      this.contract.releases[0].tender.tenderers[0].id = this.payeeId;
    }
    // Find the starting and ending date of evaluation in days
    if (this.contract.releases[0].tender.awardPeriod.startDate && this.contract.releases[0].tender.awardPeriod.endDate) {
      // Get 1 day in milliseconds
      const one_day = 1000 * 60 * 60 * 24;

      // Convert both dates to milliseconds
      const date1_ms = this.contract.releases[0].tender.awardPeriod.startDate.getTime();
      const date2_ms = this.contract.releases[0].tender.awardPeriod.endDate.getTime();

      // Calculate the difference in milliseconds
      const difference_ms = date2_ms - date1_ms;

      // Convert back to days and return
      this.contract.releases[0].tender.awardPeriod.durationInDays = Math.round(difference_ms / one_day) + ' ditë';
    }
    // Buyer, supplier id
    this.contract.releases[0].buyer.id = this.payerId;
    this.contract.releases[0].awards[0].suppliers[0].id = this.payeeId;
    // Convert string values to numbers
    this.contract.contract.predictedValueSlug = this.form.value.predictedValue.toString().replace(/[,]+/g, '');
    this.contract.releases[0].planning.budget.amount.amount = Number(this.form.value.predictedValue.toString().replace(/[^0-9\.-]+/g, ''));
    this.contract.contract.totalAmountOfContractsIncludingTaxesSlug = this.form.value.totalAmountOfContractsIncludingTaxes.toString().replace(/[,]+/g, '');
    this.contract.releases[0].tender.value.amount = Number(this.form.value.totalAmountOfContractsIncludingTaxes.toString().replace(/[^0-9\.-]+/g, ''));
    this.contract.releases[0].contracts[0].deductionAmountFromContract.value.amount = Number(this.form.value.discountAmountFromContract.toString().replace(/[^0-9\.-]+/g, ''));
    // Published date
    this.contract.publishedDate = new Date();
    // Fill the uri with the link to the copy of this package
    this.contract.uri = `https://kontratatehapura.prishtinaonline.com/contracts/json/${this.contract.releases[0].ocid}`;
    // Date signed
    this.contract.releases[0].contracts[0].dateSigned = this.contract.releases[0].contracts[0].period.startDate;
    // Overall date
    this.contract.releases[0].date = new Date();
  }

  addContract(e) {
    e.preventDefault();
    this.calculateValues();
    // Add documents to form data
    const docsFormData = new FormData();
    for (let i = 0; i < this.docsToUpload.length; i++) {
      docsFormData.append('file', this.docsToUpload[i]);
      this.contract.releases[0].tender.documents.push(
        {
          documentType: 'tenderNotice',
          title: this.docsToUpload[i].name.replace('.pdf', ''),
          url: 'https://kontratatehapura.prishtinaonline.com/documents/' + this.docsToUpload[i].name,
          format: 'application/pdf',
          language: 'sq',
          id: Math.random().toString(36).substr(2, 9) + '-tenderNotice'
        }
      );
    }
    if (this.form.valid === true) {
      if (this.filesToUpload !== null && this.valid === true) {
        this.changeValues();
        this.contract.releases[0].contracts[0].documents.push({
          documentType: 'contractSigned',
          title: this.filesToUpload.name.replace('.pdf', ''),
          url: `https://kontratatehapura.prishtinaonline.com/uploads/${this.filesToUpload.name}`,
          format: 'application/pdf',
          language: 'sq',
          id: Math.random().toString(36).substr(2, 9) + '-contractSigned'
        });
        const formData = new FormData();
        formData.append('file', this.filesToUpload, this.filesToUpload['name']);
        formData.append('contract', JSON.stringify(this.contract));
        Swal({
          title: 'Duke e importuar setin e të dhënave',
          onOpen: () => {
            Swal.showLoading();
          }
        });
        this.contractsService.uploadDocuments(docsFormData)
          .subscribe(docResponse => {
            if (docResponse['_body'] === 'Completed') {
              // Add the contract if documents are uploaded successfully
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
                      this.datasetService.updateCsv(this.contract.year, this.contract)
                        .takeUntil(this.unsubscribeAll)
                        .subscribe(data => {
                        });
                      if (result.value) {
                        this.router.navigate(['/dashboard/contracts']);
                      }
                    });
                  }
                });
            } else {
              Swal('Sukses!', 'Kontrata u shtua me sukses.', 'success').then((result) => {
                // this.datasetService.updateCsv(this.contract.year, this.contract)
                //   .takeUntil(this.unsubscribeAll)
                //   .subscribe(data => {
                //   });
                if (result.value) {
                  this.router.navigate(['/dashboard/contracts']);
                }
              });
            }
          });
      } else if (this.filesToUpload === null) {
        this.changeValues();
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
                // this.datasetService.updateCsv(this.contract.year, this.contract)
                //   .takeUntil(this.unsubscribeAll)
                //   .subscribe(data => {
                //   });
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

  get formData() {
    return <FormArray>this.form.get('documents');
  }
}
