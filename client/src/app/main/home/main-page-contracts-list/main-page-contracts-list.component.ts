import { Component, OnInit, TemplateRef } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import Swal from 'sweetalert2';
import { Page } from '../../../models/page';


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

  constructor(public contractsService: ContractsService, private modalService: BsModalService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.contractModal = new Contract();
    this.contract = new Contract();
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

}
