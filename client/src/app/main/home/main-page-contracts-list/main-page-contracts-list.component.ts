import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { DirectorateService } from '../../../service/directorate.service';
import { Contract } from '../../../models/contract';
import { Directorate } from '../../../models/directorates';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { formatDate } from 'ngx-bootstrap/chronos';
import { Page } from '../../../models/page';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
@Component({
  selector: 'app-main-page-contracts-list',
  templateUrl: './main-page-contracts-list.component.html',
  styleUrls: ['./main-page-contracts-list.component.css']
})
export class MainPageContractsListComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  contract: Contract;
  contracts: Contract[];
  contractModal: Contract;
  modalRef: BsModalRef;
  page = new Page();
  directorates: Directorate[];
  rows = new Array<Contract>();
  private ref: ChangeDetectorRef;
  temp = [];
  search = {
    string: '',
    directorate: '',
    date: new Date(),
    referenceDate: new Date(),
    value: '',
  };
  @ViewChild('table') table: DatatableComponent;

  constructor(public contractsService: ContractsService, private modalService: BsModalService, private translate: TranslateService,
    public directorateService: DirectorateService) {
    translate.setDefaultLang('sq');
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.contractModal = new Contract();
    this.contract = new Contract();
    this.search = {
      string: 'Kërko kontratën',
      directorate: 'Drejtoria',
      date: null,
      referenceDate: null,
      value: 'Vlera',
    };
    this.directorateService.getAllDirectorates().subscribe(data => {
      this.directorates = data;
    });
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
    this.onGetContracts();
  }

  onGetContracts() {
    this.contractsService.serverPagination(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.temp = pagedData.data;
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.contractsService.serverPaginationLatestContracts(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  onTypeString(event: any) {
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
    this.contractsService.filterContract(this.search).subscribe(data => {
      this.rows = data;
    });
    this.table.offset = 0;
  }

}
