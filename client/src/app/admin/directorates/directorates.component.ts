import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DirectorateService } from '../../service/directorate.service';
import { Directorate } from '../../models/directorates';
import { User } from '../../models/user';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'app-directorates',
  templateUrl: './directorates.component.html',
  styleUrls: ['./directorates.component.css']
})
export class DirectoratesComponent implements OnInit {
  modalRef: BsModalRef;
  directorates: Directorate[];
  directorate: Directorate;
  directorateModal: Directorate;
  activeUsers = [];
  emails = [];

  constructor(public directorateService: DirectorateService, private modalService: BsModalService, public userService: UserService) {
    this.directorate = new Directorate();
    this.directorateModal = new Directorate();

    this.directorateService.directoratesAndTheirPeopleInCharge().subscribe(data => {
      this.directorates = data.result;
      for (this.directorate of this.directorates) {
        this.emails.push(this.directorate.thePersonInChargeEmail);
      }
    });

    this.userService.getActiveUsers().subscribe(data => {
      data.forEach(element1 => {
        if (this.emails.includes(element1.email) === false) {
          this.activeUsers.push(element1);
        }
      });
    });
  }

  ngOnInit() {
  }
  // Function for opening add directorate modal
  openModal(template: TemplateRef<any>) {
    this.directorate = new Directorate();
    this.modalRef = this.modalService.show(template);
  }

  // Function for opening show directorate information modal
  showDirectorate(event) {
    const email = event.target.dataset.id;
    this.directorateService.getDirectorateByPersonInChargeEmail(email).subscribe(data => {
      data.forEach(element => {
        this.directorateModal = element;
      });
    });
  }

  // Function for opening edit directorate modal
  editModal(template: TemplateRef<any>, event) {
    const email = event.target.dataset.id;
    this.directorateService.getDirectorateByPersonInChargeEmail(email).subscribe(data => {
      data.directorate.forEach(element => {
        this.directorateModal = element;
      });
    });
    this.modalRef = this.modalService.show(template);
  }

  // Function for opening deactivate directorate modal
  deactivateModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.directorateService.getDirectorateById(id).subscribe(directorate => {
      this.directorateModal = directorate;
    });
    this.modalRef = this.modalService.show(template);
  }

  // Function for opening activate directorate modal
  activateModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.directorateService.getDirectorateById(id).subscribe(directorate => {
      this.directorateModal = directorate;
    });
    this.modalRef = this.modalService.show(template);
  }

  // Add directorate function
  addDirectorate(event) {
    this.directorateService.addDirectorate(this.directorate).subscribe(res => {
      if (res.err) {
        Swal('Gabim!', 'Drejtoria nuk u shtua', 'error');
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
        this.activeUsers = [];
        this.userService.getActiveUsers().subscribe(data => {
          data.forEach(element1 => {
            if (this.emails.includes(element1.email) === false) {
              this.activeUsers.push(element1);
            }
          });
        });
        this.directorateService.directoratesAndTheirPeopleInCharge().subscribe(data => {
          this.directorates = data.result;
        });
        this.modalRef.hide();
        Swal('Sukses!', 'Drejtoria u shtua me sukses.', 'success');
      }
    });
  }

  // Edit directorate function
  editDirectorate(event) {
    const id = event.target.dataset.id;
    this.directorateService.editDirectorate(id, this.directorateModal).subscribe(res => {
      if (res.err) {
        Swal('Gabim!', 'Drejtoria nuk u ndryshua.', 'error');
        return false;
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
      } else if (this.directorateModal.directorateName === '') {
        Swal('Gabim!', 'Drejtoria nuk u ndryshua.', 'error');
      } else if (res.err) {
        Swal('Gabim!', 'Pëdoruesi nuk u ndryshua.', 'error');
        return false;
      } else {
        this.directorateService.directoratesAndTheirPeopleInCharge().subscribe(data => {
          this.directorates = data.result;
          for (this.directorate of this.directorates) {
            this.emails.push(this.directorate.thePersonInChargeEmail);
          }
        });
        this.userService.getActiveUsers().subscribe(data => {
          data.forEach(element1 => {
            if (this.emails.includes(element1.email) === false) {
              this.activeUsers.push(element1);
            }
          });
        });
        Swal('Sukses!', 'Pëdoruesi u ndryshua me sukses.', 'success');
        this.modalRef.hide();
      }
    });
  }

  // Deactivate directorate function
  deactivateDirectorate(event) {
    const id = event.target.dataset.id;
    this.directorateService.deactivateDirectorate(id, this.directorateModal).subscribe(res => {
      if (res.err) {
        Swal('Gabim!', 'Drejtoria nuk është deaktivizuar!', 'error');
      } else {
        this.modalRef.hide();
        this.directorateService.directoratesAndTheirPeopleInCharge().subscribe(data => {
          this.directorates = data.result;
        });
        Swal('Sukses!', 'Drejtoria u deaktivizua me sukses.', 'success');
      }
    });
  }

  // Activate directorate function
  activateDirectorate(event) {
    const id = event.target.dataset.id;

    this.directorateService.activateDirectorate(id, this.directorateModal).subscribe(res => {
      if (res.err) {
        Swal('Gabim!', 'Drejtoria nuk është aktivizuar!', 'error');
      } else {
        this.modalRef.hide();
        this.directorateService.directoratesAndTheirPeopleInCharge().subscribe(data => {
          this.directorates = data.result;
        });
        Swal('Sukses!', 'Drejtoria u aktivizua me sukses!', 'success');
      }
    });
  }

}
