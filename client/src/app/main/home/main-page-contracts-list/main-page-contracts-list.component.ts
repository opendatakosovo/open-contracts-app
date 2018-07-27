import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
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
  contract: Contract;
  contracts: Contract[];
  contractModal: Contract;
  modalRef: BsModalRef;
  page = new Page();
  rows = new Array<Contract>();
  private ref: ChangeDetectorRef;
  temp = [];
  public currentPageLimit = 10;
  public currentVisible = 3;
  public readonly pageLimitOptions = [
    { value: 5 },
    { value: 10 },
    { value: 20 }
  ];
  public readonly visibleOptions = [
    { value: 1 },
    { value: 3 },
    { value: 5 },
    { value: 10 },
  ];

  @ViewChild('table') table: DatatableComponent;

  constructor(public contractsService: ContractsService, private modalService: BsModalService, private translate: TranslateService, ref: ChangeDetectorRef) {
    translate.setDefaultLang('sq');
    this.page.pageNumber = 0;
    this.page.size = 20;
    this.contractModal = new Contract();
    this.contract = new Contract();
    this.tableStyle();
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
  }

  // Function to change the limit of contracts in one page
  public onLimitChange(limit: any): void {
    this.tableStyle();
    this.changePageLimit(limit);
    this.table.limit = this.currentPageLimit;
    this.table.recalculate();
    setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        this.table.offset = Math.floor((this.table.rowCount - 1) / this.table.limit);
      }
    });
  }

  public onVisibleChange(visible: any): void {
    this.currentVisible = parseInt(visible, 10);
  }

  private changePageLimit(limit: any): void {
    this.currentPageLimit = parseInt(limit, 10);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.contractsService.serverPaginationLatestContracts(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.tableStyle();
    });
  }

  tableStyle() {
    $(document).ready(function () {
      $('.datatable-header').css({ 'color': 'white', 'background-color': '#32a6bd', 'width': '100%' });
      $('.ngx-datatable.bootstrap .datatable-header .datatable-header-cell').css('padding-left', '26px');
      $('.ngx-datatable .datatable-body').css('width', '100%');
      setTimeout(function () {
        $('.datatable-body-row').css({ 'color': '#5f5e5e', 'border': 'none' });
        $('.ngx-datatable.bootstrap .datatable-body .datatable-body-row').css('width', '100%');
        $('.ngx-datatable.bootstrap').css('border-radius', '10px');
        $('.ngx-datatable.bootstrap .datatable-body .datatable-body-row .datatable-body-cell').css('padding-left', '14px');
      }, 100);
    });
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }


}
