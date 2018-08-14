import { Component, OnInit, Inject, ChangeDetectorRef, TemplateRef, AfterViewInit, ViewChild } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Subject } from 'rxjs/Subject';
import { Contract } from '../../../models/contract';
import { Directorate } from '../../../models/directorates';
import { DirectorateService } from '../../../service/directorate.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import Swal from 'sweetalert2';
import { Page } from '../../../models/page';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { User } from '../../../models/user';


@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit, AfterViewInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  bsConfig: Partial<BsDatepickerConfig>;
  directorates: Directorate[];
  contract: Contract;
  contracts: Contract[];
  contractModal: Contract;
  modalRef: BsModalRef;
  totalContracts: Number;
  page = new Page();
  rows = new Array<Contract>();
  currentUser: User;
  private ref: ChangeDetectorRef;
  private datatableBodyElement: Element;
  search = {
    string: '',
    directorate: '',
    date: new Date(),
    referenceDate: new Date(),
    value: '',
    year: '',
    pageInfo: new Page()
  };
  offsetX: number;

  @ViewChild('table') table: DatatableComponent;

  constructor(public contractsService: ContractsService, private modalService: BsModalService, ref: ChangeDetectorRef,
              public directorateService: DirectorateService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.contractModal = new Contract();
    this.totalContracts = 0;
    this.contract = new Contract();
    this.ref = ref;
    this.directorateService.getAllDirectorates()
    .takeUntil(this.unsubscribeAll)
    .subscribe(data => {
      this.directorates = data;
    });
    this.search = {
      string: '',
      directorate: '',
      date: null,
      referenceDate: null,
      value: '',
      year: 'any',
      pageInfo: {
        pageNumber: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        column: ''
      }
    };
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  messages = {
    emptyMessage: `
    <div>
        <i class="fa fa-spinner fa-spin"></i>
        <p>Duke shfaqur kontratat</p>
    </div>
    `
  };

  ngOnInit() {
    this.setPage({ offset: 0 });
    this.totalContracts = this.page.totalElements;
  }

  ngAfterViewInit() {
    this.datatableBodyElement = this.table.element.querySelector('datatable-body');
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.search.pageInfo.pageNumber = pageInfo.offset;
    if (this.page.totalElements === this.totalContracts) {
      this.contractsService.serverPagination(this.page)
        .takeUntil(this.unsubscribeAll)
        .subscribe(pagedData => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        });
    } else {
      this.contractsService.filterContract(this.search)
        .takeUntil(this.unsubscribeAll)
        .subscribe(data => {
          this.page = data.page;
          this.rows = data.data;
        });
    }
  }

  onTableScroll(scroll: any) {
    const offsetX = scroll.offsetX;
    // can be undefined sometimes
    if (offsetX != null) {
      this.offsetX = offsetX;
    }
  }
  // Function to sort contracts ascending or descending
  sortContracts(column) {
    this.page.column = column;
    const asc = document.getElementById('sort').classList.contains('asc');
    const desc = document.getElementById('sort').classList.contains('desc');
    this.rows = [];
    this.messages = {
      emptyMessage: `
      <div>
          <i class="fa fa-spinner fa-spin"></i>
          <p>Duke renditur kontratat</p>
      </div>
    `
    };
    if (asc === false || desc === true) {
      this.contractsService.serverSortContractsAscending(this.page)
        .takeUntil(this.unsubscribeAll)
        .subscribe(pagedData => {
          const ascClass = document.getElementById('sort');
          if (desc === true) {
            ascClass.classList.remove('desc');
          }
          ascClass.classList.add('asc');
          this.page = pagedData.page;
          this.rows = pagedData.data;
          setTimeout(() => {
            this.datatableBodyElement.scrollLeft = this.offsetX;
          }, 1);
        }, err => {
          console.log(err);
        });
    } else {
      this.contractsService.serverSortContractsDescending(this.page)
        .takeUntil(this.unsubscribeAll)
        .subscribe(pagedData => {
          const descClass = document.getElementById('sort');
          descClass.classList.remove('asc');
          descClass.classList.add('desc');
          this.page = pagedData.page;
          this.rows = pagedData.data;
          setTimeout(() => {
            this.datatableBodyElement.scrollLeft = this.offsetX;
          }, 1);
        }, err => {
          console.log(err);
        });
    }
  }

  // Function to open delete modal
  deleteModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.contractsService.getContractByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(contract => {
        this.contract = contract;
      });
    this.modalRef = this.modalService.show(template);
  }

  // Function to delete a specific contract
  deleteContract(event) {
    const id = event.target.dataset.id;
    this.contractsService.deleteContractByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Kontrata nuk u fshi.', 'error');
        } else {
          this.modalRef.hide();
          this.contractsService.serverPagination(this.page)
            .takeUntil(this.unsubscribeAll)
            .subscribe(pagedData => {
              this.page = pagedData.page;
              this.rows = pagedData.data;
            });
          Swal('Sukses!', 'Kontrata u fshi me sukses.', 'success');
        }
      });
  }

  onType() {
    this.contractsService.filterContractDashboard(this.search, this.currentUser.role, this.currentUser.directorateName)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.page = data.page;
        this.rows = data.data;
        if (data.data.length === 0) {
          this.messages = {
            emptyMessage: `
            <div>
                <p>Asnjë kontratë nuk përputhet me të dhënat e shypura</p>
            </div>
          `
          };
        }
      });
    this.table.offset = 0;
  }
  onDatePick(event) {
    if (event !== null && event !== undefined) {
      this.search.date = event;
      this.search.date.setHours(0);
      this.search.date.setMinutes(0);
      this.search.date.setSeconds(0);
      this.search.date.setMilliseconds(0);
      this.search.referenceDate = new Date(this.search.date.toDateString());
      this.search.referenceDate.setDate(this.search.referenceDate.getDate() + 1);
      this.search.date.toISOString();
      this.search.referenceDate.toISOString();
    }
    this.contractsService.filterContractDashboard(this.search, this.currentUser.role, this.currentUser.directorateName)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.page = data.page;
        this.rows = data.data;
        if (data.data.length === 0) {
          this.messages = {
            emptyMessage: `
            <div>
                <p>Asnjë kontratë nuk përputhet me të dhënat e shypura</p>
            </div>
          `
          };
        }
      });
    this.table.offset = 0;
  }

  onDateInputChange(event) {
    const val = event.target.value;
    if (val === '') {
      this.contractsService.serverPaginationLatestContracts(this.page)
        .takeUntil(this.unsubscribeAll)
        .subscribe(pagedData => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        });
    }
  }

  onChange() {
    this.contractsService.filterContract(this.search)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.page = data.page;
        this.rows = data.data;
        if (data.data.length === 0) {
          this.messages = {
            emptyMessage: `
          <div>
              <p>Asnjë kontratë nuk përputhet me të dhënat e shypura</p>
          </div>
        `
          };
        }
      });
    this.table.offset = 0;
  }
}
