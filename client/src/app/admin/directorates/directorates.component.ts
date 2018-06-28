import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DirectorateService } from '../../service/directorate.service';
import { Directorates } from '../../models/directorates';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-directorates',
  templateUrl: './directorates.component.html',
  styleUrls: ['./directorates.component.css']
})
export class DirectoratesComponent implements OnInit {
  modalRef: BsModalRef;
  directorates: Directorates[];
  directorate: Directorates = {
    _id: '',
    directorateName: '',
    thePersonInCharge: '',
    isActive: true
  };
  directorateModal: Directorates = {
    _id: '',
    directorateName: '',
    thePersonInCharge: '',
    isActive: true
  };

  constructor(public directorateService: DirectorateService, private modalService: BsModalService) {
    this.directorateService.getDirectorates().subscribe(data => {
      this.directorates = data;
      console.log(this.directorates);
    });
   }

  ngOnInit() {
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  showDirectorate(event) {
    const id = event.target.dataset.id;
    this.directorateService.getDirectorateByID(id).subscribe(directorate => {
      this.directorateModal = directorate;
    });
  }
  addDirectorate(event) {
    this.directorateService.addDirectorate(this.directorate).subscribe( res => {
      if (res.err) {
        Swal('Gabim!' , 'Drejtoria nuk u shtua' , 'error');
      } else if (res.exists) {
        Swal('Kujdes!', 'Drejtoria ekziston.', 'warning');
      } else if (res.errVld) {
        let errList = '';
        res.errVld.map(error => {
            errList += `<li>${error.msg}</li>`;
        });
        const htmlData = `<div style="text-align: center;">${errList}</div>`;
        Swal({
            title: 'Kujdes!',
            html: htmlData,
            width: 750,
            type: 'info',
            confirmButtonText: 'Kthehu te forma'
        });
      } else {
        this.modalRef.hide();
        this.directorates.unshift(this.directorate);
        Swal('Sukses!', 'Drejtoria u shtua me sukses.', 'success');
        this.directorate.directorateName = '';
        this.directorate.thePersonInCharge = '';
        this.directorate.isActive = true;
      }
    });
  }

}
