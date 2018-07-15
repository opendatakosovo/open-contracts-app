import { Component, OnInit, TemplateRef } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import Swal from 'sweetalert2';

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
  constructor(public contractsService: ContractsService, private modalService: BsModalService) {
    this.contractModal = new Contract();
    this.contract = new Contract();
    this.contractsService.latestContracts().subscribe(data => {
      this.contracts = data;
    });
  }
  messages = {
    emptyMessage: `
    <div>
      <span class="classname">Nuk ka kontrata!</span>
    </div>
  `
  };
  ngOnInit() {
  }

}
