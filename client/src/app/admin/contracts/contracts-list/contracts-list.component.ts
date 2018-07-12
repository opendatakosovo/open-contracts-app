import { Component, OnInit, TemplateRef } from '@angular/core';
import { ContractsService } from '../../../service/contracts.service';
import { Contract } from '../../../models/contract';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import Swal from 'sweetalert2';
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
  constructor(public contractsService: ContractsService, private modalService: BsModalService) {
    this.contractModal = new Contract();
    this.contract = new Contract();
    this.contractsService.getContracts().subscribe(data => {
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

  // Function to open delete modal
  deleteModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.contractsService.getContractByID(id).subscribe(contract => {
      this.contract = contract;
      console.log(id);
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
        this.modalRef.hide();
        this.contractsService.getContracts().subscribe(data => {
          this.contracts = data;
        });
        Swal('Sukses!', 'Kontrata u fshi me sukses.', 'success');
      }
    });
  }

}
