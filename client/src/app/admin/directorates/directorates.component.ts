import { Component, OnInit, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AddDirectoratesComponent } from './add-directorates/add-directorates.component';
import { DirectorateService } from '../../service/directorate.service';
import { Directorates } from '../../models/directorates';

@Component({
  selector: 'app-directorates',
  templateUrl: './directorates.component.html',
  styleUrls: ['./directorates.component.css']
})
export class DirectoratesComponent implements OnInit {
  @Input() directorates: Directorates;
  modalRef: BsModalRef;

  constructor(public direcatorateService: DirectorateService, private modalService: BsModalService) {
    this.direcatorateService.getDirectorates().subscribe(data => {
      this.directorates = data;
      console.log(this.directorates);
    });
   }

  ngOnInit() {
  }
  openModal() {
    this.modalRef = this.modalService.show(AddDirectoratesComponent);
  }

}
