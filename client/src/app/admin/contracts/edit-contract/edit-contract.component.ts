import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Contract } from '../../../models/contract';
import { Directorate } from '../../../models/directorates';
import { Annex } from '../../../models/annex';
import { Installment } from '../../../models/installment';
import { ContractsService } from '../../../service/contracts.service';
import { DirectorateService } from '../../../service/directorate.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { CustomValidator } from '../../../validators/custom-validator';
import { DatasetService } from '../../../service/dataset.service';
import { TreeNode } from '@angular/router/src/utils/tree';
import { DateParsingFlags } from 'ngx-bootstrap/chronos/create/parsing.types';
@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.css']
})
export class EditContractComponent implements OnInit, AfterViewChecked {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  id: string;
  startOfEvaluationDate: Date;
  endOfEvaluationDate: Date;
  arrayInstallments: number[];
  filesToUpload: File = null;
  hasFileToDelete: Boolean = false;
  fileToDelete;
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
  @ViewChild('fileInput') fileInput;
  implementationDeadline = [];
  currentUser: User;
  documents: FormArray;
  contractDocsNames = [];
  docsToDelete = [];
  docsToUpload = [];
  lastTransaction: Date;
  lastTransactionAmount: number;
  planned: string;
  payeeId: string;
  payerId: string;
  retender: string;
  tenderStatus: string;
  budget: string;
  initiationDate: Date;
  approvalDateOfFunds: Date;
  torDate: Date;
  reapprovalDate: Date;
  standardDocuments: Date;
  cancellationNoticeDate: Date;
  companyType: Boolean;
  headquartersName: string;
  directorateName: string;
  nameOfProcurementOffical: string;
  fppClassification: number;
  noOfCompaniesWhoDownloadedTenderDoc: number;
  noOfRefusedBids: number;
  contractDocument: string;
  initiationDateUpdated: Date;
  approvalDateOfFundsUpdated: Date;
  torDateUpdated: Date;
  reapprovalDateUpdated: Date;
  standardDocumentsUpdated: Date;
  cancellationNoticeDateUpdated: Date;
  noOfCompaniesWhoDownloadedTenderDocUpdated: number;
  noOfRefusedBidsUpdated: number;

  constructor(public contractsService: ContractsService, private router: ActivatedRoute, public directorateService: DirectorateService, private _fb: FormBuilder, private route: Router, public datasetService: DatasetService) {
    this.directorates = [];
    this.contract = new Contract();
    this.formArrayAnnexes = new FormArray([]);
    this.formArrayInstallments = new FormArray([]);
    this.id = this.router.snapshot.paramMap.get('id');
    this.contractsService.getContractByID(this.id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.contract = data;
        for (let i = 0; i < this.contract.releases[0].tender.documents.length; i++) {
          this.contractDocsNames.push(this.contract.releases[0].tender.documents[i].title);
          this.addDocument();
        }
        if (data.bidOpeningDateTime === null) {
          this.contract.releases[0].tender.tenderPeriod.startDate = data.bidOpeningDateTime;
        }
        if (this.contract.releases[0].contracts[0].documents[0] && this.contract.releases[0].contracts[0].documents[0].title !== '') {
          const nameArea = <HTMLInputElement>document.getElementById('name-area');
          nameArea.value = this.contract.releases[0].contracts[0].documents[0].title.toString();
          this.hasFileToDelete = true;
        }
        this.checkBudget(this.contract.releases[0].planning.budget.description);
        this.formatDates(this.contract);
        this.initAnnexes();
        this.initInstallments();
        if (this.contract.releases[0].contracts[0].period.durationInDays !== undefined && this.contract.releases[0].contracts[0].period.durationInDays !== '') {
          this.implementationDeadline = this.contract.releases[0].contracts[0].period.durationInDays.split(' ');
        }
        // Check the planning documents to check the planning radiobutton
        if (this.contract.releases[0].planning.documents[0] && this.contract.releases[0].planning.documents[0].documentType === 'procurementPlan') {
          this.planned = 'po';
        } else {
          this.planned = 'jo';
        }
        // Check the relatedProcesses to fill the retender button
        if (this.contract.releases[0].relatedProcesses[0] && this.contract.releases[0].relatedProcesses[0].relationship === 'unsuccessfulProcess') {
          this.retender = 'Po';
        } else {
          this.retender = 'jo';
        }
        // Fill the tenderStatus to check the status radiobutton
        if (this.contract.releases[0].tender.status === 'active' && (this.contract.releases[0].tender.awardPeriod.startDate && this.contract.releases[0].tender.awardPeriod.endDate)) {
          this.tenderStatus = 'evaluation';
        } else if (this.contract.releases[0].tender.status === 'active') {
          this.tenderStatus = 'published';
        } else if (this.contract.releases[0].tender.status === 'cancelled') {
          this.tenderStatus = 'cancelled';
        } else if (this.contract.releases[0].tender.status === 'complete') {
          this.tenderStatus = 'contracted';
        }
        // Check tender items to fill the fppClassification field
        this.contract.releases[0].tender.items.map(item => {
          if (item.classification.id === 'CPV') {
            this.fppClassification = Number(item.quantity);
          }
        });
        // Map the parties to fill the parties names
        this.contract.releases[0].parties.map(party => {
          if (party.details && party.details.local !== null) {
            this.companyType = party.details.local;
            this.headquartersName = party.address.region.toString();
          } else {
            this.nameOfProcurementOffical = party.contactPoint.name.toString();
            this.directorateName = party.name.toString();
          }
        });
        // Check contracts documents
        if (this.contract.releases[0].contracts[0].documents) {
          this.contract.releases[0].contracts[0].documents.map(document => {
            this.contractDocument = document.title.toString();
          });
        }
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
      flagStatus: null,
      totalPayedPriceForContract: '',
      year: new FormControl(null, [Validators.required, CustomValidator.isZero()]),
      fppClassification: new FormControl(null, Validators.maxLength(2)),
      directorate: '',
      nameOfProcurementOffical: '',
      annexes: this.formArrayAnnexes,
      installments: this.formArrayInstallments,
      documents: _fb.array([])
    });
    this.directorateService.getAllDirectorates()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        data.forEach(element => {
          if (element.directorateIsActive === true) {
            this.directorates.push(element);
          }
        });
      });
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngAfterViewChecked() {
    this.addDocumentNames();
  }

  onClick() {
    this.fileInput.nativeElement.click();
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

  removeInstallment(i) {
    this.contract.releases[0].contracts[0].implementation.transactions.splice(i, 1);
    const arrControl = this.formArrayInstallments;
    arrControl.removeAt(i);
  }

  initInstallments() {
    const arrControl = this.formArrayInstallments;
    this.contract.releases[0].contracts[0].implementation.transactions.map(installment => {
      arrControl.push(this.addInstallment(installment));
    });
  }

  addAnnex(annex: Annex) {
    return this._fb.group({
      description: annex.description,
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

  ngOnInit() {
    if (this.currentUser.role !== 'superadmin' && this.currentUser.role !== 'admin') {
      this.route.navigate(['/dashboard']);
    }
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', dateInputFormat: 'DD/MM/YYYY' });
  }

  calculateValues() {
    let sumAnnex = 0;
    this.contract.releases[0].contracts[0].amendments.map(annex => {
      if (annex.description !== undefined && annex.description !== null) {
        sumAnnex += parseFloat(annex.description.toString());
      } else {
        sumAnnex = 0;
      }
    });
    if (this.contract.releases[0].tender.value.amount === undefined || this.contract.releases[0].tender.value.amount === null) {
      this.contract.releases[0].tender.value.amount = 0;
    }
    this.total = parseFloat(this.contract.releases[0].tender.value.amount.toString()) + sumAnnex;
    this.contract.releases[0].contracts[0].value.amount = this.total;
    let sumInstallments = 0;
    this.contract.releases[0].contracts[0].implementation.transactions.map(installment => {
      if (installment.value.amount !== undefined && installment.value.amount !== null) {
        sumInstallments += parseFloat(installment.value.amount.toString());
      } else {
        sumInstallments = 0;
      }
    });
    this.contract.releases[0].contracts[0].implementation.finalValue.amount = sumInstallments;
  }

  dateChange(date) {
    const oldDate = new Date(date);
    return new Date(oldDate.getTime() + Math.abs(oldDate.getTimezoneOffset() * 60000));
  }

  formatDates(contract) {
    if (contract.releases[0].planning.milestones[1].dateMet !== null) {
      contract.releases[0].planning.milestones[1].dateMet = new Date(contract.releases[0].planning.milestones[1].dateMet);
    }

    if (contract.releases[0].tender.tenderPeriod.startDate !== null) {
      contract.releases[0].tender.tenderPeriod.startDate = new Date(contract.releases[0].tender.tenderPeriod.startDate);
    }

    if (contract.releases[0].tender.milestones[1].dateMet !== null) {
      contract.releases[0].tender.milestones[1].dateMet = new Date(contract.releases[0].tender.milestones[1].dateMet);
    }

    if (contract.releases[0].tender.awardPeriod.endDate !== null) {
      contract.releases[0].tender.awardPeriod.endDate = new Date(contract.releases[0].tender.awardPeriod.endDate);
    }

    if (contract.releases[0].planning.milestones[0].dateMet !== null) {
      contract.releases[0].planning.milestones[0].dateMet = new Date(contract.releases[0].planning.milestones[0].dateMet);
    }

    if (contract.lastInstallmentPayDate !== null) {
      contract.lastInstallmentPayDate = new Date(contract.lastInstallmentPayDate);
    }

    if (contract.releases[0].planning.milestones[3].dateMet !== null) {
      contract.releases[0].planning.milestones[3].dateMet = new Date(contract.releases[0].planning.milestones[3].dateMet);
    }

    if (contract.releases[0].tender.awardPeriod.startDate !== null) {
      contract.releases[0].tender.awardPeriod.startDate = new Date(contract.releases[0].tender.awardPeriod.startDate);
    }

    if (contract.releases[0].planning.milestones[2].dateMet !== null) {
      contract.releases[0].planning.milestones[2].dateMet = new Date(contract.releases[0].planning.milestones[2].dateMet);
    }

    if (contract.releases[0].contracts[0].period.endDate !== null) {
      contract.releases[0].contracts[0].period.endDate = new Date(contract.releases[0].contracts[0].period.endDate);
    }

    if (contract.releases[0].tender.date !== null) {
      contract.releases[0].tender.date = new Date(contract.releases[0].tender.date);
    }

    if (contract.releases[0].awards[0].date !== null) {
      contract.releases[0].awards[0].date = new Date(contract.releases[0].awards[0].date);
    }

    if (contract.releases[0].contracts[0].period.startDate != null) {
      contract.releases[0].contracts[0].period.startDate = new Date(contract.releases[0].contracts[0].period.startDate);
    }

    if (contract.releases[0].tender.milestones[0].dateMet != null) {
      contract.releases[0].tender.milestones[0].dateMet = new Date(contract.releases[0].tender.milestones[0].dateMet);
    }
    if (contract.releases[0].tender.value.amount === NaN) {
      contract.releases[0].tender.value.amount = 0;
    }

    for (const installment of contract.releases[0].contracts[0].implementation.transactions) {
      if (installment.date !== null) {
        installment.date = new Date(installment.date);
      }
    }

    for (const annex of contract.releases[0].contracts[0].amendments) {
      if (annex.date !== null) {
        annex.date = new Date(annex.date);
      }
    }
  }

  checkBudget(budgets) {
    if (budgets.includes('Buxheti i Kosovës')) {
      const checkButton = <HTMLInputElement>document.getElementById('kosovoBudget');
      checkButton.checked = true;
    }

    if (budgets.includes('Të hyra vetanake')) {
      const checkButton = <HTMLInputElement>document.getElementById('ownSources');
      checkButton.checked = true;
    }

    if (budgets.includes('Donacion')) {
      const checkButton = <HTMLInputElement>document.getElementById('donation');
      checkButton.checked = true;
    }
  }

  addBudgetValue(event) {
    this.budget = this.contract.releases[0].planning.budget.description.toString();
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

  fileChangeEvent(event) {
    if (this.hasFileToDelete === true) {
      this.fileToDelete = this.contract.releases[0].contracts[0].documents[0].title;
      this.hasFileToDelete = false;
    }
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
    if (this.filesToUpload != null) {
      this.filesToUpload = null;
    }
    if (this.hasFileToDelete === true) {
      this.fileToDelete = this.contract.releases[0].contracts[0].documents[0].title;
      this.hasFileToDelete = false;
    }
    const nameArea = <HTMLInputElement>document.getElementById('name-area');
    nameArea.value = 'Bashkangjit dokumentin';
    this.valid = false;
    this.touched = false;
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
    this.contract.releases[0].planning.milestones[1].dateMet = this.contract.releases[0].planning.milestones[1].dateMet == null ? null : this.dateChange(this.contract.releases[0].planning.milestones[1].dateMet);
    this.contract.releases[0].tender.tenderPeriod.startDate = this.contract.releases[0].tender.tenderPeriod.startDate == null ? null : this.dateChange(this.contract.releases[0].tender.tenderPeriod.startDate);
    this.contract.releases[0].tender.awardPeriod.endDate = this.contract.releases[0].tender.awardPeriod.endDate == null ? null : this.dateChange(this.contract.releases[0].tender.awardPeriod.endDate);
    this.contract.releases[0].planning.milestones[0].dateMet = this.contract.releases[0].planning.milestones[0].dateMet == null ? null : this.dateChange(this.contract.releases[0].planning.milestones[0].dateMet);
    this.contract.releases[0].tender.milestones[1].dateMet = this.contract.releases[0].tender.milestones[1].dateMet == null ? null : this.dateChange(this.contract.releases[0].tender.milestones[1].dateMet);
    this.contract.releases[0].planning.milestones[3].dateMet = this.contract.releases[0].planning.milestones[3].dateMet == null ? null : this.dateChange(this.contract.releases[0].planning.milestones[3].dateMet);
    this.contract.releases[0].tender.awardPeriod.startDate = this.contract.releases[0].tender.awardPeriod.startDate == null ? null : this.dateChange(this.contract.releases[0].tender.awardPeriod.startDate);
    const i = this.contract.releases[0].contracts[0].implementation.transactions.length;
    if (i > 0) {
      this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date = this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date == null ? null : this.dateChange(this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date);
    }
    this.contract.releases[0].tender.date = this.contract.releases[0].tender.date == null ? null : this.dateChange(this.contract.releases[0].tender.date);
    this.contract.releases[0].awards[0].date = this.contract.releases[0].awards[0].date == null ? null : this.dateChange(this.contract.releases[0].awards[0].date);
    this.contract.releases[0].contracts[0].period.endDate = this.contract.releases[0].contracts[0].period.endDate == null ? null : this.dateChange(this.contract.releases[0].contracts[0].period.endDate);
    this.contract.releases[0].contracts[0].period.startDate = this.contract.releases[0].contracts[0].period.startDate == null ? null : this.dateChange(this.contract.releases[0].contracts[0].period.startDate);
    if (this.contract.releases[0].contracts[0].implementation.transactions.length > 1) {
      for (const installment of this.contract.releases[0].contracts[0].implementation.transactions) {
        installment.date = installment.date == null ? null : this.dateChange(installment.date);
      }
    }
    if (this.contract.releases[0].contracts[0].amendments.length > 1) {
      for (const annex of this.contract.releases[0].contracts[0].amendments) {
        annex.date = annex.date == null ? null : this.dateChange(annex.date);
      }
    }
    // if (this.form.value.totalAmountOfContractsIncludingTaxes) {
    //   this.form.value.totalAmountOfContractsIncludingTaxes = parseFloat(this.form.value.totalAmountOfContractsIncludingTaxes.replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2 });
    //   this.form.patchValue({
    //     'totalAmountOfContractsIncludingTaxes': this.form.value.totalAmountOfContractsIncludingTaxes
    //   });
    // }
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
    if (this.planned === 'po' && (this.contract.releases[0].planning.documents || this.contract.releases[0].planning.documents[0].documentType !== 'procurementPlan')) {
      this.contract.releases[0].planning.documents.push({
        id: Math.random().toString(36).substr(2, 9) + '-procurementPlan',
        documentType: 'procurementPlan'
      });
    } else if (this.planned === 'jo' && this.contract.releases[0].planning.documents[0].documentType && this.contract.releases[0].planning.documents[0].documentType === 'procurementPlan') {
      this.contract.releases[0].planning.documents = [];
    }
    // Push planning milestones
    if (this.contract.releases[0].planning.milestones[0].dateMet !== null && this.contract.releases[0].planning.milestones[0].id === '') {
      this.contract.releases[0].planning.milestones[0].id = this.milestoneId('initiationDate');
      this.contract.releases[0].planning.milestones[0].title = 'Data e inicimit të aktivitetit të prokurimit (data e pranimit të kërkesës)';
      this.contract.releases[0].planning.milestones[0].type = 'preProcurement';
      this.contract.releases[0].planning.milestones[0].code = 'initiationDate';
      this.contract.releases[0].planning.milestones[0].status = 'met';
    }
    if (this.contract.releases[0].planning.milestones[1].dateMet !== null && this.contract.releases[0].planning.milestones[1].id === '') {
      this.contract.releases[0].planning.milestones[1].id = this.milestoneId('approvalDateOfFunds');
      this.contract.releases[0].planning.milestones[1].title = 'Data e aprovimit të deklaratës së nevojave dhe disponueshmërisë së mjeteve';
      this.contract.releases[0].planning.milestones[1].type = 'approval';
      this.contract.releases[0].planning.milestones[1].code = 'approvalDateOfFunds';
      this.contract.releases[0].planning.milestones[1].status = 'met';
    }
    if (this.contract.releases[0].planning.milestones[2].dateMet !== null && this.contract.releases[0].planning.milestones[2].id === '') {
      this.contract.releases[0].planning.milestones[2].id = this.milestoneId('torDate');
      this.contract.releases[0].planning.milestones[2].title = 'Data e pranimit të specifikimit teknik (TOR)';
      this.contract.releases[0].planning.milestones[2].type = 'assessment';
      this.contract.releases[0].planning.milestones[2].code = 'torDate';
      this.contract.releases[0].planning.milestones[2].status = 'met';
    }
    if (this.contract.releases[0].planning.milestones[3].dateMet !== null && this.contract.releases[0].planning.milestones[3].id === '') {
      this.contract.releases[0].planning.milestones[3].id = this.milestoneId('reapprovalDate');
      this.contract.releases[0].planning.milestones[3].title = 'Data e aprovimit të Deklaratës së nevojave dhe disponueshmërisë së mjeteve - rikonfirmimi';
      this.contract.releases[0].planning.milestones[3].type = 'approval';
      this.contract.releases[0].planning.milestones[3].code = 'reapprovalDate';
      this.contract.releases[0].planning.milestones[3].status = 'met';
    }
    // Fill the bids statistics
    if ((this.contract.releases[0].bids.statistics[0].value !== 0 || this.contract.releases[0].bids.statistics[0].value !== null) && this.contract.releases[0].bids.statistics[0].id === '') {
      this.contract.releases[0].bids.statistics[0].id = '0001';
      this.contract.releases[0].bids.statistics[0].measure = 'numberOfDownloads';
      this.contract.releases[0].bids.statistics[0].notes = 'Nr. i OE që kanë shkarkuar dosjen e tenderit';
    }
    if ((this.contract.releases[0].bids.statistics[1].value !== 0 || this.contract.releases[0].bids.statistics[1].value !== null) && this.contract.releases[0].bids.statistics[1].id === '') {
      this.contract.releases[0].bids.statistics[1].id = '0002';
      this.contract.releases[0].bids.statistics[1].measure = 'numberOfRefusedBids';
      this.contract.releases[0].bids.statistics[1].notes = 'Numri i ofertave të refuzuara';
    }
    // Fill tender milestones
    if (this.contract.releases[0].tender.milestones[0].dateMet !== null || this.contract.releases[0].tender.milestones[0].id === '') {
      this.contract.releases[0].tender.milestones[0].id = this.milestoneId('standardDocuments');
      this.contract.releases[0].tender.milestones[0].title = 'Letrat Standarde për OE';
      this.contract.releases[0].tender.milestones[0].type = 'engagement';
      this.contract.releases[0].tender.milestones[0].code = 'standardDocuments';
      this.contract.releases[0].tender.milestones[0].status = 'met';
    }
    if (this.contract.releases[0].tender.milestones[1].dateMet !== null || this.contract.releases[0].tender.milestones[1].id === '') {
      this.contract.releases[0].tender.milestones[1].id = this.milestoneId('cancellationNoticeDate');
      this.contract.releases[0].tender.milestones[1].title = 'Data e publikimit të anulimit të njoftimit';
      this.contract.releases[0].tender.milestones[1].type = 'approval';
      this.contract.releases[0].tender.milestones[1].code = 'cancellationNoticeDate';
      this.contract.releases[0].tender.milestones[1].status = 'met';
    }
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
    if (this.contract.releases[0].tender.tenderers[0].name) {
      this.contract.releases[0].parties.push({
        name: this.contract.releases[0].tender.tenderers[0].name,
        roles: [
          'supplier',
          'tenderer',
          'payee'
        ],
        id: this.payeeId,
        address: {
          region: this.headquartersName
        },
        details: {
          local: this.companyType
        }
      });
    }
    // Fill the payer party
    if (this.directorateName) {
      this.contract.releases[0].parties.push({
        address: {
          region: 'Prishtinë',
          postalCode: '10000',
          countryName: 'Kosovë'
        },
        contactPoint: {
          url: 'https://kk.rks-gov.net/prishtine/',
          name: this.nameOfProcurementOffical
        },
        roles: [
          'buyer',
          'payer',
          'procuringEntity'
        ],
        name: this.directorateName,
        id: this.payerId
      });
    }
    // Check retender value to fill related process
    if ((this.retender === 'po' || this.retender === 'Po') && this.contract.releases[0].relatedProcesses[0].relationship !== 'unsuccessfulProcess') {
      this.contract.releases[0].relatedProcesses[0].relationship = 'unsuccessfulProcess';
    } else {
      this.contract.releases[0].relatedProcesses[0].relationship = '';
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
    if (this.contract.releases[0].contracts[0].implementation.transactions.length > 0) {
      for (const transaction of this.contract.releases[0].contracts[0].implementation.transactions) {
        if (transaction.id === '' && transaction.payee.id === '' && transaction.payer.id === '') {
          transaction.id = Math.random().toString(36).substr(2, 9) + '-transaction';
          transaction.payee.id = this.payeeId;
          transaction.payer.id = this.payerId;
        }
      }
    }
    // Check for the last transaction
    const length = this.contract.releases[0].contracts[0].implementation.transactions.length;
    if (this.contract.releases[0].contracts[0].implementation.transactions[length] && this.contract.releases[0].contracts[0].implementation.transactions[length].id === '') {
      this.contract.releases[0].contracts[0].implementation.transactions[length].id = Math.random().toString(36).substr(2, 9) + '-last-transaction';
    }
    // Fill other fields with the directorate names
    this.contract.releases[0].buyer.name = this.directorateName;
    if (this.contract.releases[0].contracts[0].implementation.transactions.length > 0) {
      for (const transaction of this.contract.releases[0].contracts[0].implementation.transactions) {
        transaction.payer.name = this.directorateName;
      }
    }
    // Planning, awards, contracts id and ocid
    if (this.contract.releases[0].planning.budget.id === '') {
      this.contract.releases[0].planning.budget.id = this.ocidMaker('-planning');
    }
    if (this.contract.releases[0].awards[0].id === '') {
      this.contract.releases[0].awards[0].id = this.ocidMaker('-award');
    }
    if (this.contract.releases[0].contracts[0].id === '') {
      this.contract.releases[0].contracts[0].id = this.ocidMaker('-contract');
    }
    if (this.contract.releases[0].ocid === '') {
      this.contract.releases[0].ocid = this.ocidMaker('');
    }
    if (this.contract.releases[0].id === '') {
      this.contract.releases[0].id = this.ocidMaker('-contract');
    }
    if (this.contract.releases[0].contracts[0].awardID === '') {
      this.contract.releases[0].contracts[0].awardID = this.contract.releases[0].awards[0].id;
    }
    // Tenderers id
    if (this.contract.releases[0].tender.tenderers[0].name && this.contract.releases[0].tender.tenderers[0].name !== '' && this.contract.releases[0].tender.tenderers[0].id === '') {
      this.contract.releases[0].tender.tenderers[0].id = this.payeeId;
    }
    // Find the starting and ending date of evaluation in days
    if (this.contract.releases[0].tender.awardPeriod.startDate && this.contract.releases[0].tender.awardPeriod.endDate && this.contract.releases[0].tender.awardPeriod.durationInDays === '') {
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
    if (this.contract.releases[0].buyer.id === '') {
      this.contract.releases[0].buyer.id = this.payerId;
    }
    if (this.contract.releases[0].awards[0].suppliers[0].id === '') {
      this.contract.releases[0].awards[0].suppliers[0].id = this.payeeId;
    }
    // Convert string values to numbers
    this.contract.contract.predictedValueSlug = this.form.value.predictedValue.toString().replace(/[,]+/g, '');
    this.contract.releases[0].planning.budget.amount.amount = Number(this.form.value.predictedValue.toString().replace(/[^0-9\.-]+/g, ''));
    this.contract.contract.totalAmountOfContractsIncludingTaxesSlug = this.form.value.totalAmountOfContractsIncludingTaxes.toString().replace(/[,]+/g, '');
    this.contract.releases[0].tender.value.amount = Number(this.form.value.totalAmountOfContractsIncludingTaxes.toString().replace(/[^0-9\.-]+/g, ''));
    this.contract.releases[0].contracts[0].deductionAmountFromContract.value.amount = Number(this.form.value.discountAmountFromContract.toString().replace(/[^0-9\.-]+/g, ''));
    // Published date
    this.contract.publishedDate = new Date();
    // Fill the uri with the link to the copy of this package
    if (this.contract.uri === '') {
      this.contract.uri = `https://kontratatehapura.prishtinaonline.com/contracts/json/${this.contract.releases[0].ocid}`;
    }
    // Date signed
    this.contract.releases[0].contracts[0].dateSigned = this.contract.releases[0].contracts[0].period.startDate;
    // Overall date
    if (this.contract.releases[0].date === null) {
      this.contract.releases[0].date = new Date();
    }
  }

  updateContract(e) {
    e.preventDefault();
    this.calculateValues();
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
        if (this.fileToDelete !== '') {
          formData.append('fileToDelete', this.fileToDelete);
        }
        Swal({
          title: 'Duke e ngarkuar dokumentin',
          onOpen: () => {
            Swal.showLoading();
          }
        });

        this.contractsService.deleteDocuments(this.docsToDelete)
          .subscribe(docsRes => {
            if (docsRes['_body'] === 'Completed') {
              this.contractsService.uploadDocuments(docsFormData)
                .subscribe(docsUploadRes => {
                  if (docsUploadRes['_body'] === 'Completed') {

                    this.contractsService.updateContract(this.id, formData, 'multipart')
                      .takeUntil(this.unsubscribeAll)
                      .subscribe(res => {
                        if (res.existErr) {
                          Swal('Kujdes!', 'Dokumenti Kontratës ekziston!', 'warning');
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
                          Swal('Gabim!', 'Kontrata nuk u ndryshua.', 'error');
                        } else {
                          Swal('Sukses!', 'Kontrata u ndryshua me sukses.', 'success').then((result) => {
                            this.datasetService.updateCsv(this.contract.year, this.contract)
                              .takeUntil(this.unsubscribeAll)
                              .subscribe(data => {
                              });
                            if (result.value) {
                              this.route.navigate(['/dashboard/contracts']);
                            }
                          });
                        }
                      });
                  }
                  Swal('Gabim!', 'Kontrata nuk u ndryshua.', 'error');
                });
            }
            Swal('Gabim!', 'Kontrata nuk u ndryshua.', 'error');
          });
      } else if (this.filesToUpload === null) {
        this.changeValues();
        const body = {
          requestedContract: this.contract,
          fileToDelete: null,
        };
        if (this.fileToDelete !== '') {
          body.fileToDelete = this.fileToDelete;
        }

        this.contractsService.deleteDocuments(this.docsToDelete)
          .subscribe(docsRes => {
            if (docsRes['_body'] === 'Completed') {
              this.contractsService.uploadDocuments(docsFormData)
                .subscribe(docsUploadRes => {
                  if (docsUploadRes['_body'] === 'Completed') {

                    this.contractsService.updateContract(this.id, body)
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
                          console.log(res);

                          Swal('Gabim!', 'Kontrata nuk u ndryshua.', 'error');
                        } else {
                          Swal('Sukses!', 'Kontrata u ndryshua me sukses.', 'success').then((result) => {
                            this.datasetService.updateCsv(this.contract.year, this.contract)
                              .takeUntil(this.unsubscribeAll)
                              .subscribe(data => {
                              });
                            if (result.value) {
                              this.route.navigate(['/dashboard/contracts']);
                            }
                          });
                        }
                      });
                  }
                  Swal('Gabim!', 'Kontrata nuk u ndryshua.', 'error');
                });
            }
            Swal('Gabim!', 'Kontrata nuk u ndryshua.', 'error');
          });
      }
    }
  }
  bringBackFile() {
    this.fileToDelete = '';
    if (this.filesToUpload != null) {
      this.filesToUpload = null;
    }
    const nameArea = <HTMLInputElement>document.getElementById('name-area');
    nameArea.value = this.contract.releases[0].contracts[0].documents[0].title.toString();
    this.hasFileToDelete = true;

  }



  ///////////// Documents ////////////////

  docsButtonClick(index) {
    document.getElementById('doc-' + index).click();
  }

  addDocumentNames() {
    for (let i = 0; i < this.contractDocsNames.length; i++) {
      // Add document name to input text
      const nameArea = <HTMLInputElement>document.getElementById('docname' + i);
      nameArea.value = this.contractDocsNames[i].toString();
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
    this.docsToDelete.push(this.contract.releases[0].tender.documents[id]);
    this.contractDocsNames = this.contractDocsNames.filter((doc) => {
      return doc !== this.contract.releases[0].tender.documents[id];
    });
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
        this.contractDocsNames.push(newFileName);
        this.documents.controls[index].setValue({ doc: '', error: false, errorMsg: '' });
      } else {
        this.documents.controls[index].setValue({ doc: '', error: true, errorMsg: 'Tipi dokumentit nuk është valid, duhet të jetë i tipit pdf, docx, doc ose xls' });
      }
    }
  }


  ///////////// Documents ////////////////

  get formData() {
    return <FormArray>this.form.get('documents');
  }

}


