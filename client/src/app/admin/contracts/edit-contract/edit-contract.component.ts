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
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { CustomValidator } from '../../../validators/custom-validator';
import { DatasetService } from '../../../service/dataset.service';
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
        if (data.bidOpeningDateTime === null) {
          this.contract.releases[0].tender.tenderPeriod.startDate = data.bidOpeningDateTime;
        }
        if (this.contract.releases[0].contracts[0].documents[0].title !== '') {
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

  onClick() {
    this.fileInput.nativeElement.click();
  }

  addInstallment(installment: Installment) {
    return this._fb.group({
      value: {
        amount: 0
      },
      date: null
    });
  }

  addNewInstallment() {
    this.contract.releases[0].contracts[0].implementation.transactions.push({
      value: {
        amount: 0
      },
      date: null
    });
    const arrControl = this.formArrayInstallments;
    arrControl.push(this.addInstallment({
      value: {
        amount: 0
      },
      date: null
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
    if (this.contract.releases[0].contracts[0].value.amount !== undefined && this.contract.releases[0].contracts[0].value.amount !== null && this.contract.releases[0].contracts[0].value.amount !== 0) {
      this.total = parseFloat(this.contract.releases[0].contracts[0].value.amount.toString()) + sumAnnex;
    } else {
      this.total = 0;
    }
    if (this.contract.releases[0].contracts[0].value.amount !== undefined && this.contract.releases[0].contracts[0].value.amount !== null) {
      this.contract.releases[0].contracts[0].value.amount = this.total;
    }
    let sumInstallments = 0;
    this.contract.releases[0].contracts[0].implementation.transactions.map(installment => {
      if (installment.value.amount !== undefined && installment.value.amount !== null) {
        sumInstallments += parseFloat(installment.value.amount.toString());
      } else {
        sumInstallments = 0;
      }
    });
    const i = this.contract.releases[0].contracts[0].implementation.transactions.length;
    if (this.contract.releases[0].contracts[0].implementation.transactions[i - 1] !== undefined) {
      this.totalInstallments = parseFloat(this.contract.releases[0].contracts[0].implementation.transactions.toString()) + sumInstallments;
    } else {
      this.totalInstallments = 0;
    }
    if (this.totalInstallments !== undefined) {
      this.contract.releases[0].contracts[0].implementation.finalValue.amount = this.totalInstallments;
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

    if (contract.releases[0].tender.tenderPeriod.startDate !== null) {
      contract.releases[0].tender.tenderPeriod.startDate = new Date(contract.releases[0].tender.tenderPeriod.startDate);
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

    if (contract.releases[0].contracts[0].period.endDate !== null) {
      contract.releases[0].contracts[0].period.endDate = new Date(contract.releases[0].contracts[0].period.endDate);
    }

    if (contract.contract.publicationDate !== null) {
      contract.contract.publicationDate = new Date(contract.contract.publicationDate);
    }

    if (contract.contract.publicationDateOfGivenContract !== null) {
      contract.contract.publicationDateOfGivenContract = new Date(contract.contract.publicationDateOfGivenContract);
    }

    if (contract.releases[0].contracts[0].period.startDate != null) {
      contract.releases[0].contracts[0].period.startDate = new Date(contract.releases[0].contracts[0].period.startDate);
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
    if (event.target.checked === false) {
      this.contract.releases[0].planning.budget.description.slice(this.contract.releases[0].planning.budget.description.indexOf(event.target.value), 1);
    } else if (event.target.checked === true) {
      this.contract.releases[0].planning.budget.description = this.contract.releases[0].planning.budget.description + ' ' + event.target.value;
    }
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

  updateContract(e) {
    e.preventDefault();
    this.calculateValues();
    if (this.form.valid === true) {
      if (this.filesToUpload !== null && this.valid === true) {
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
        this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date = this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date == null ? null : this.dateChange(this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date);
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
                // this.datasetService.updateCsv(this.contract.year, this.contract)
                //   .takeUntil(this.unsubscribeAll)
                //   .subscribe(data => {
                //   });
                if (result.value) {
                  this.route.navigate(['/dashboard/contracts']);
                }
              });
            }
          });
      } else if (this.filesToUpload === null) {
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
        this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date = this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date == null ? null : this.dateChange(this.contract.releases[0].contracts[0].implementation.transactions[i - 1].date);
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
                // this.datasetService.updateCsv(this.contract.year, this.contract)
                //   .takeUntil(this.unsubscribeAll)
                //   .subscribe(data => {
                //   });
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
    nameArea.value = this.contract.releases[0].contracts[0].documents[0].title.toString();
    this.hasFileToDelete = true;

  }
}


