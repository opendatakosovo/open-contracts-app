import { Component, OnInit, Inject, ChangeDetectorRef, TemplateRef, Input, ViewChild } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import Swal from 'sweetalert2';
import { Page } from '../../../models/page';
import * as $ from 'jquery';
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.css']
})
export class ContractsListComponent implements OnInit {
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

  constructor(public contractsService: ContractsService, private modalService: BsModalService, ref: ChangeDetectorRef) {
    this.page.pageNumber = 0;
    this.page.size = 20;
    this.contractModal = new Contract();
    this.contract = new Contract();
    this.ref = ref;
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
    this.onGetContracts();
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
    this.contractsService.serverPagination(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.tableStyle();
    });
  }

  onGetContracts() {
    this.contractsService.serverPagination(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.temp = this.rows;
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

  filterContractName(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (result) {
      return result.activityTitle.toLocaleLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
    this.tableStyle();
  }

  // Function to open delete modal
  deleteModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.contractsService.getContractByID(id).subscribe(contract => {
      this.contract = contract;
    });
    this.modalRef = this.modalService.show(template);
  }

  // Function to delete a specific contract
  deleteContract(event) {
    const id = event.target.dataset.id;
    this.contractsService.deleteContractByID(id).subscribe(res => {
      if (res.err) {
        Swal('Gabim!', 'Kontrata nuk u fshi.', 'error');
      } else {
        this.tableStyle();
        this.modalRef.hide();
        this.contractsService.serverPagination(this.page).subscribe(pagedData => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        });
        Swal('Sukses!', 'Kontrata u fshi me sukses.', 'success');
      }
    });
  }

}
