import { Component, OnInit, ViewChild } from '@angular/core';
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
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.css']
})
export class EditContractComponent implements OnInit {
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
  constructor(public contractsService: ContractsService, private router: ActivatedRoute, public directorateService: DirectorateService, private _fb: FormBuilder, private route: Router) {
    this.directorates = [];
    this.contract = new Contract();
    this.formArrayAnnexes = new FormArray([]);
    this.formArrayInstallments = new FormArray([]);
    this.id = this.router.snapshot.paramMap.get('id');
    this.contractsService.getContractByID(this.id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.contract = data;
        if (this.contract.contract.file !== '') {
          const nameArea = <HTMLInputElement>document.getElementById('name-area');
          nameArea.value = this.contract.contract.file.toString();
          this.hasFileToDelete = true;
        }
        this.checkBudget(this.contract.budget);
        this.formatDates(this.contract);
        this.initAnnexes();
        this.initInstallments();
        if (this.contract.contract.implementationDeadline !== undefined && this.contract.contract.implementationDeadline !== '') {
          this.implementationDeadline = this.contract.contract.implementationDeadline.split(' ');
        }
      });
    this.form = _fb.group({
      activityTitle: new FormControl('', Validators.required),
      procurementNo: new FormControl(null, Validators.required),
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
      year: '',
      fppClassification: new FormControl(null, Validators.maxLength(2)),
      directorate: '',
      nameOfProcurementOffical: '',
      annexes: this.formArrayAnnexes,
      installments: this.formArrayInstallments,
    });
    this.directorateService.getAllDirectorates()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.directorates = data;
      });
    this.currentUser = JSON.parse(localStorage.getItem('user'));
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

  ngOnInit() {
    if (this.currentUser.role !== 'superadmin' && this.currentUser.role !== 'admin') {
      this.route.navigate(['/dashboard']);
    }
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', dateInputFormat: 'DD/MM/YYYY' });
  }

  calculateValues() {
    let sumAnnex = 0;
    this.contract.contract.annexes.map(annex => {
      if (annex.totalValueOfAnnexContract1 !== undefined && annex.totalValueOfAnnexContract1 !== null) {
        sumAnnex += parseFloat(annex.totalValueOfAnnexContract1.toString());
      } else {
        sumAnnex = 0;
      }
    });
    if (this.contract.contract.totalAmountOfContractsIncludingTaxes !== undefined && this.contract.contract.totalAmountOfContractsIncludingTaxes !== null) {
      this.total = parseFloat(this.contract.contract.totalAmountOfContractsIncludingTaxes.toString()) + sumAnnex;
    } else {
      this.total = 0;
    }
    if (this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== undefined && this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== null) {
      this.contract.contract.totalAmountOfAllAnnexContractsIncludingTaxes = this.total.toString();
    }
    let sumInstallments = 0;
    this.contract.installments.map(installment => {
      if (installment.installmentAmount1 !== undefined && installment.installmentAmount1 !== null) {
        sumInstallments += parseFloat(installment.installmentAmount1.toString());
      } else {
        sumInstallments = 0;
      }
    });
    if (this.contract.lastInstallmentAmount !== undefined) {
      this.totalInstallments = parseFloat(this.contract.lastInstallmentAmount.toString()) + sumInstallments;
    } else {
      this.totalInstallments = 0;
    }
    if (this.totalInstallments !== undefined) {
      this.contract.contract.totalPayedPriceForContract = this.totalInstallments.toString();
    }
  }

  dateChange(date) {
    const oldDate = new Date(date);
    return new Date(oldDate.getTime() + Math.abs(oldDate.getTimezoneOffset() * 60000));
  }

  formatDates(contract) {
    if (contract.approvalDateOfFunds !== null) {
      contract.approvalDateOfFunds = new Date(contract.approvalDateOfFunds);
    }

    if (contract.bidOpeningDate !== null) {
      contract.bidOpeningDate = new Date(contract.bidOpeningDate);
    }

    if (contract.cancellationNoticeDate !== null) {
      contract.cancellationNoticeDate = new Date(contract.cancellationNoticeDate);
    }

    if (contract.endingOfEvaluationDate !== null) {
      contract.endingOfEvaluationDate = new Date(contract.endingOfEvaluationDate);
    }

    if (contract.initiationDate !== null) {
      contract.initiationDate = new Date(contract.initiationDate);
    }

    if (contract.lastInstallmentPayDate !== null) {
      contract.lastInstallmentPayDate = new Date(contract.lastInstallmentPayDate);
    }

    if (contract.reapprovalDate !== null) {
      contract.reapprovalDate = new Date(contract.reapprovalDate);
    }

    if (contract.startingOfEvaluationDate !== null) {
      contract.startingOfEvaluationDate = new Date(contract.startingOfEvaluationDate);
    }

    if (contract.torDate !== null) {
      contract.torDate = new Date(contract.torDate);
    }

    if (contract.contract.closingDate !== null) {
      contract.contract.closingDate = new Date(contract.contract.closingDate);
    }

    if (contract.contract.publicationDate !== null) {
      contract.contract.publicationDate = new Date(contract.contract.publicationDate);
    }

    if (contract.contract.publicationDateOfGivenContract !== null) {
      contract.contract.publicationDateOfGivenContract = new Date(contract.contract.publicationDateOfGivenContract);
    }

    if (contract.contract.signingDate != null) {
      contract.contract.signingDate = new Date(contract.contract.signingDate);
    }

    if (contract.company.standardDocuments != null) {
      contract.company.standardDocuments = new Date(contract.company.standardDocuments);
    }

    for (const installment of contract.installments) {
      if (installment.installmentPayDate1 !== null) {
        installment.installmentPayDate1 = new Date(installment.installmentPayDate1);
      }
    }

    for (const annex of contract.contract.annexes) {
      if (annex.annexContractSigningDate1 !== null) {
        annex.annexContractSigningDate1 = new Date(annex.annexContractSigningDate1);
      }
    }
  }

  checkBudget(budgets) {
    if (budgets != null) {
      for (const budget of budgets) {
        if (budget === 'Buxheti i Kosovës') {
          const checkButton = <HTMLInputElement>document.getElementById('kosovoBudget');
          checkButton.checked = true;
        }

        if (budget === 'Të hyra vetanake') {
          const checkButton = <HTMLInputElement>document.getElementById('ownSources');
          checkButton.checked = true;
        }

        if (budget === 'Donacion') {
          const checkButton = <HTMLInputElement>document.getElementById('donation');
          checkButton.checked = true;
        }
      }
    }
  }
  addBudgetValue(event) {
    if (this.contract.budget[0] === '') {
      this.contract.budget = [];
    }
    if (event.target.checked === false) {
      this.contract.budget.splice(this.contract.budget.indexOf(event.target.value), 1);
    } else if (event.target.checked === true) {
      this.contract.budget.push(event.target.value);
    }
  }

  fileChangeEvent(event) {
    if (this.hasFileToDelete === true) {
      this.fileToDelete = this.contract.contract.file;
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
      this.fileToDelete = this.contract.contract.file;
      this.hasFileToDelete = false;
    }
    const nameArea = <HTMLInputElement>document.getElementById('name-area');
    nameArea.value = 'Bashkangjit dokumentin';
    this.valid = false;
    this.touched = false;
  }

  updateContract(e) {
    e.preventDefault();
    this.calculateValues();
    if (this.form.valid === true) {
      console.log(this.form.value.implementationDeadlineNumber);
      if (this.filesToUpload !== null && this.valid === true) {
        if (this.form.value.implementationDeadlineNumber !== null && this.form.value.implementationDeadlineNumber !== '' && this.form.value.implementationDeadlineNumber !== undefined) {
          this.contract.contract.implementationDeadline = this.form.value.implementationDeadlineNumber + ' ' + this.form.value.implementationDeadlineDuration;
        } else {
          this.contract.contract.implementationDeadline = '';
        }
        this.contract.approvalDateOfFunds = this.contract.approvalDateOfFunds == null ? null : this.dateChange(this.contract.approvalDateOfFunds);
        this.contract.bidOpeningDate = this.contract.bidOpeningDate == null ? null : this.dateChange(this.contract.bidOpeningDate);
        this.contract.endingOfEvaluationDate = this.contract.endingOfEvaluationDate == null ? null : this.dateChange(this.contract.endingOfEvaluationDate);
        this.contract.initiationDate = this.contract.initiationDate == null ? null : this.dateChange(this.contract.initiationDate);
        this.contract.cancellationNoticeDate = this.contract.cancellationNoticeDate == null ? null : this.dateChange(this.contract.cancellationNoticeDate);
        this.contract.reapprovalDate = this.contract.reapprovalDate == null ? null : this.dateChange(this.contract.reapprovalDate);
        this.contract.startingOfEvaluationDate = this.contract.startingOfEvaluationDate == null ? null : this.dateChange(this.contract.startingOfEvaluationDate);
        this.contract.lastInstallmentPayDate = this.contract.lastInstallmentPayDate == null ? null : this.dateChange(this.contract.lastInstallmentPayDate);
        this.contract.contract.publicationDate = this.contract.contract.publicationDate == null ? null : this.dateChange(this.contract.contract.publicationDate);
        this.contract.contract.publicationDateOfGivenContract = this.contract.contract.publicationDateOfGivenContract == null ? null : this.dateChange(this.contract.contract.publicationDateOfGivenContract);
        this.contract.contract.closingDate = this.contract.contract.closingDate == null ? null : this.dateChange(this.contract.contract.closingDate);
        this.contract.contract.signingDate = this.contract.contract.signingDate == null ? null : this.dateChange(this.contract.contract.signingDate);
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
        if (this.fileToDelete !== '') {
          formData.append('fileToDelete', this.fileToDelete);
        }
        Swal({
          title: 'Duke e ngarkuar dokumentin',
          onOpen: () => {
            Swal.showLoading();
          }
        });
        this.contractsService.updateContract(this.id, formData, 'multipart')
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
              Swal('Gabim!', 'Kontrata nuk u ndryshua.', 'error');
            } else {
              Swal('Sukses!', 'Kontrata u ndryshua me sukses.', 'success').then((result) => {
                if (result.value) {
                  this.route.navigate(['/dashboard/contracts']);
                }
              });
            }
          });
      } else if (this.filesToUpload === null) {
        if (this.form.value.implementationDeadlineNumber !== null && this.form.value.implementationDeadlineNumber !== '' && this.form.value.implementationDeadlineNumber !== undefined) {
          this.contract.contract.implementationDeadline = this.form.value.implementationDeadlineNumber + ' ' + this.form.value.implementationDeadlineDuration;
        } else {
          this.contract.contract.implementationDeadline = '';
        }
        this.contract.approvalDateOfFunds = this.contract.approvalDateOfFunds == null ? null : this.dateChange(this.contract.approvalDateOfFunds);
        this.contract.bidOpeningDate = this.contract.bidOpeningDate == null ? null : this.dateChange(this.contract.bidOpeningDate);
        this.contract.endingOfEvaluationDate = this.contract.endingOfEvaluationDate == null ? null : this.dateChange(this.contract.endingOfEvaluationDate);
        this.contract.initiationDate = this.contract.initiationDate == null ? null : this.dateChange(this.contract.initiationDate);
        this.contract.cancellationNoticeDate = this.contract.cancellationNoticeDate == null ? null : this.dateChange(this.contract.cancellationNoticeDate);
        this.contract.reapprovalDate = this.contract.reapprovalDate == null ? null : this.dateChange(this.contract.reapprovalDate);
        this.contract.startingOfEvaluationDate = this.contract.startingOfEvaluationDate == null ? null : this.dateChange(this.contract.startingOfEvaluationDate);
        this.contract.lastInstallmentPayDate = this.contract.lastInstallmentPayDate == null ? null : this.dateChange(this.contract.lastInstallmentPayDate);
        this.contract.contract.publicationDate = this.contract.contract.publicationDate == null ? null : this.dateChange(this.contract.contract.publicationDate);
        this.contract.contract.publicationDateOfGivenContract = this.contract.contract.publicationDateOfGivenContract == null ? null : this.dateChange(this.contract.contract.publicationDateOfGivenContract);
        this.contract.contract.closingDate = this.contract.contract.closingDate == null ? null : this.dateChange(this.contract.contract.closingDate);
        this.contract.contract.signingDate = this.contract.contract.signingDate == null ? null : this.dateChange(this.contract.contract.signingDate);
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
        const body = {
          requestedContract: this.contract,
          fileToDelete: null,
        };
        if (this.fileToDelete !== '') {
          body.fileToDelete = this.fileToDelete;
        }
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
              Swal('Gabim!', 'Kontrata nuk u ndryshua.', 'error');
            } else {
              Swal('Sukses!', 'Kontrata u ndryshua me sukses.', 'success').then((result) => {
                if (result.value) {
                  this.route.navigate(['/dashboard/contracts']);
                }
              });
            }
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
    nameArea.value = this.contract.contract.file.toString();
    this.hasFileToDelete = true;

  }
}


