import { Component, OnInit } from '@angular/core';
import { Directorates } from '../../../models/directorates';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DirectorateService } from '../../../service/directorate.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-directorates',
  templateUrl: './add-directorates.component.html',
  styleUrls: ['./add-directorates.component.css']
})
export class AddDirectoratesComponent implements OnInit {
  directorates: Directorates[];
  directorate: Directorates = {
    _id: '',
    directorateName: '',
    thePersonInCharge: '',
    isActive: true
  };

  constructor(public bsModalRef: BsModalRef , public directorateService: DirectorateService) {
    this.directorateService.getDirectorates().subscribe( data => {
      this.directorates = data;
    });
  }

  ngOnInit() {
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
        this.bsModalRef.hide();
        this.directorates.unshift(this.directorate);
        Swal('Sukses!', 'Drejtoria u shtua me sukses.', 'success');
        this.directorate.directorateName = '';
        this.directorate.thePersonInCharge = '';
        this.directorate.isActive = true;
      }
    });
  }
}
