import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
import { Directorate } from '../../../models/directorates';
import { DirectorateService } from '../../../service/directorate.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Page } from '../../../models/page';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-main-page-contracts-list',
  templateUrl: './main-page-contracts-list.component.html',
  styleUrls: ['./main-page-contracts-list.component.css']
})
export class MainPageContractsListComponent implements OnInit, AfterViewInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  bsConfig: Partial<BsDatepickerConfig>;
  contract: Contract;
  contracts: Contract[];
  contractModal: Contract;
  directorates: Directorate[];
  modalRef: BsModalRef;
  page = new Page();
  rows = new Array<Contract>();
  totalContracts: Number;
  isSortedAsc: Boolean;
  isSortedDesc: Boolean;
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
  language = 'sq';

  @ViewChild('table') table: DatatableComponent;

  constructor(public contractsService: ContractsService, private modalService: BsModalService, private translate: TranslateService,
    public directorateService: DirectorateService, public route: Router, public activatedRoute: ActivatedRoute) {
    translate.setDefaultLang('sq');
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.totalContracts = 0;
    this.isSortedAsc = false;
    this.isSortedDesc = false;
    this.directorateService.getAllPublicDirectorates()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.directorates = data;
      });
    this.contract = new Contract();
    this.search = {
      string: '',
      directorate: '',
      date: null,
      referenceDate: null,
      value: '',
      year: '2018',
      pageInfo: {
        pageNumber: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        column: ''
      }
    };
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
    if ((this.route.url.split('?', 1)[0] === '/sq' && this.route.url.split('?', 2).length > 1)) {
      this.language = 'sq';
      this.translate.use(this.language);
    } else if ((this.route.url.split('?', 1)[0] === '/sr' && this.route.url.split('?', 2).length > 1)) {
      this.language = 'sr';
      this.translate.use(this.language);
    } else if ((this.route.url.split('?', 1)[0] === '/en' && this.route.url.split('?', 2).length > 1)) {
      this.language = 'en';
      this.translate.use(this.language);
    }

    if (this.activatedRoute.snapshot.queryParamMap.has('string') === true || this.activatedRoute.snapshot.queryParamMap.has('directorate') === true
      || this.activatedRoute.snapshot.queryParamMap.has('date') === true || this.activatedRoute.snapshot.queryParamMap.has('value') === true) {
      this.search.string = (this.activatedRoute.snapshot.queryParamMap.get('string') === 'any' ? 'any' : this.activatedRoute.snapshot.queryParamMap.get('string'));
      this.search.directorate = (this.activatedRoute.snapshot.queryParamMap.get('directorate') === 'any' ? 'any' : this.activatedRoute.snapshot.queryParamMap.get('directorate'));
      this.search.date = (this.activatedRoute.snapshot.queryParamMap.get('date') === 'any' ? null : new Date(this.activatedRoute.snapshot.queryParamMap.get('date')));
      this.search.value = (this.activatedRoute.snapshot.queryParamMap.get('value') === 'any' ? 'any' : this.activatedRoute.snapshot.queryParamMap.get('value'));
      if (this.search.string === 'any') {
        this.search.string = '';
      }
      if (this.search.directorate === 'any') {
        this.search.directorate = '';
      }
      if (this.search.value === 'any') {
        this.search.value = '';
      }
      this.contractsService.filterContract(this.search)
        .takeUntil(this.unsubscribeAll)
        .subscribe(data => {
          this.page = data.page;
          this.rows = data.data;
          if (data.data.length === 0) {
            this.messages = {
              emptyMessage: `
          <div>
              <p>Asnjë kontratë nuk përputhet me të dhënat e shtypura</p>
          </div>
        `
            };
          }
        });
      this.table.offset = 0;
    } else {
      this.setPage({ offset: 0 });
      this.totalContracts = this.page.totalElements;
    }
  }

  ngAfterViewInit() {
    this.datatableBodyElement = this.table.element.querySelector('datatable-body');
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.search.pageInfo.pageNumber = pageInfo.offset;
    if (this.page.totalElements === this.totalContracts && (this.isSortedAsc === false && this.isSortedDesc === false)) {
      this.contractsService.serverPaginationLatestContracts(this.page)
        .takeUntil(this.unsubscribeAll)
        .subscribe(pagedData => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        });
    } else if (this.isSortedAsc === false || this.isSortedDesc === true) {
      this.contractsService.serverSortLatestContractsAscending(this.page)
        .takeUntil(this.unsubscribeAll)
        .subscribe(pagedData => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        });
    } else if (this.isSortedAsc === true || this.isSortedDesc === false) {
      this.contractsService.serverSortLatestContractsDescending(this.page)
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

  // Function to sort latest contracts ascending or descending
  sortContracts(column) {
    this.page.column = column;
    const asc = document.getElementById('sort').classList.contains('asc');
    const desc = document.getElementById('sort').classList.contains('desc');
    this.isSortedAsc = asc;
    this.isSortedDesc = desc;
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
      this.contractsService.serverSortLatestContractsAscending(this.page)
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
      this.contractsService.serverSortLatestContractsDescending(this.page)
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

  onType() {
    this.messages = {
      emptyMessage: `
      <div>
          <i class="fa fa-spinner fa-spin"></i>
          <p>Duke filtruar</p>
      </div>
    `
    };
    this.contractsService.filterContract(this.search)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.page = data.page;
        this.rows = data.data;
        if (data.data.length === 0) {
          this.messages = {
            emptyMessage: `
          <div>
              <p>Asnjë kontratë nuk përputhet me të dhënat e shtypura</p>
          </div>
        `
          };
        }
      });
    this.table.offset = 0;
    this.route.navigate([], {
      replaceUrl: false,
      relativeTo: this.activatedRoute,
      queryParams: {
        'string': this.search.string === '' ? 'any' : this.search.string, 'directorate': this.search.directorate === '' ? 'any' : this.search.directorate,
        'date': this.search.date === null ? 'any' : this.search.date.toString(), 'value': this.search.value === '' ? 'any' : this.search.value
      }
    });
  }

  onDateInputChange(event) {
    const val = event.target.value;
    this.messages = {
      emptyMessage: `
      <div>
          <i class="fa fa-spinner fa-spin"></i>
          <p>Duke filtruar</p>
      </div>
    `
    };
    if (val === '') {
      this.search.date = null;
      this.contractsService.filterContract(this.search)
        .takeUntil(this.unsubscribeAll)
        .subscribe(data => {
          this.page = data.page;
          this.rows = data.data;
        });
    }
    this.route.navigate([], {
      replaceUrl: false,
      relativeTo: this.activatedRoute,
      queryParams: {
        'string': this.search.string === '' ? 'any' : this.search.string, 'directorate': this.search.directorate === '' ? 'any' : this.search.directorate,
        'date': this.search.date === null ? 'any' : this.search.date.toString(), 'value': this.search.value === '' ? 'any' : this.search.value
      }
    });
  }

  onDatePick(event) {
    this.messages = {
      emptyMessage: `
      <div>
          <i class="fa fa-spinner fa-spin"></i>
          <p>Duke filtruar</p>
      </div>
    `
    };
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
      this.contractsService.filterContract(this.search)
        .takeUntil(this.unsubscribeAll)
        .subscribe(data => {
          this.page = data.page;
          this.rows = data.data;
          if (data.data.length === 0) {
            this.messages = {
              emptyMessage: `
            <div>
                <p>Asnjë kontratë nuk përputhet me të dhënat e shtypura</p>
            </div>
          `
            };
          }
        });
      this.table.offset = 0;
    }
    this.route.navigate([], {
      replaceUrl: false,
      queryParams: {
        'string': this.search.string === '' ? 'any' : this.search.string, 'directorate': this.search.directorate === '' ? 'any' : this.search.directorate,
        'date': this.search.date === null ? 'any' : this.search.date.toString(), 'value': this.search.value === '' ? 'any' : this.search.value
      }
    });
  }
  onChange() {
    this.messages = {
      emptyMessage: `
      <div>
          <i class="fa fa-spinner fa-spin"></i>
          <p>Duke filtruar</p>
      </div>
    `
    };
    this.contractsService.filterContract(this.search)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.page = data.page;
        this.rows = data.data;
        if (data.data.length === 0) {
          this.messages = {
            emptyMessage: `
          <div>
              <p>Asnjë kontratë nuk përputhet me të dhënat e shtypura</p>
          </div>
        `
          };
        }
      });
    this.table.offset = 0;
    this.route.navigate([], {
      replaceUrl: false,
      queryParams: {
        'string': this.search.string === '' ? 'any' : this.search.string, 'directorate': this.search.directorate === '' ? 'any' : this.search.directorate,
        'date': this.search.date === null ? 'any' : this.search.date.toString(), 'value': this.search.value === '' ? 'any' : this.search.value
      }
    });
  }
}
