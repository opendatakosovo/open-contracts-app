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
  directorate: Directorates = {
    directorateName: '',
    thePersonInCharge: '',
  };

  constructor(public bsModalRef: BsModalRef , public directorateService: DirectorateService) { }

  ngOnInit() {
  }

  addDirectorate(event) {
    this.directorateService.addDirectorate(this.directorate).subscribe( res => {
      if (res.err) {
        Swal('Gabim!' , 'Drejtoria nuk u shtua' , 'error');
      } else if (res.exists) {
        Swal('Kujdes!', 'Drejtoria ekziston.', 'warning');
      } else {
        this.bsModalRef.hide();
        Swal('Sukses!', 'Drejtoria u shtua me sukses.', 'success');
        this.directorate.directorateName = '';
      }
    });
  }
}
