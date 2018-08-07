import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Page } from '../../../models/page';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';
import { elementAt } from 'rxjs/operator/elementAt';
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
  reorderable: boolean;

  @ViewChild('table') table: DatatableComponent;

  constructor(public contractsService: ContractsService, private modalService: BsModalService, private translate: TranslateService) {
    translate.setDefaultLang('sq');
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.contractModal = new Contract();
    this.contract = new Contract();
    this.reorderable = true;
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

  sortContracts(column) {
    this.page.column = column;
    const asc = document.getElementById('sort').classList.contains('asc');
    const desc = document.getElementById('sort').classList.contains('desc');
    if (asc === false || desc === true) {
      this.contractsService.serverSortLatestContractsAscending(this.page).subscribe(pagedData => {
        const ascClass = document.getElementById('sort');
        if (desc === true) {
          ascClass.classList.remove('desc');
        }
        ascClass.classList.add('asc');
        this.page = pagedData.page;
        this.page.column = pagedData.column;
        this.rows = pagedData.data;
      });
    } else {
      this.contractsService.serverSortLatestContractsDescending(this.page).subscribe(pagedData => {
        const descClass = document.getElementById('sort');
        descClass.classList.remove('asc');
        descClass.classList.add('desc');
        this.page = pagedData.page;
        this.page.column = pagedData.column;
        this.rows = pagedData.data;
      });
    }
  }
}
