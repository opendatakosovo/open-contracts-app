import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DirectorateService } from '../../service/directorate.service';
import { Directorate } from '../../models/directorates';
import { User } from '../../models/user';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-directorates',
  templateUrl: './directorates.component.html',
  styleUrls: ['./directorates.component.css']
})
export class DirectoratesComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  directorates: Directorate[];
  directorate: Directorate;
  directorateModal: Directorate;
  activeUsers = [];
  userModal: User;
  users = [];
  usersInCharge: User[];
  peopleInChargeId = [];
  peopleInCharge = [];
  currentUser: User;
  constructor(public directorateService: DirectorateService, private modalService: BsModalService, public userService: UserService) {
    this.directorate = new Directorate();
    this.directorateModal = new Directorate();
    this.usersInCharge = [];
    this.userModal = new User();
    this.peopleInChargeId = [];
    this.directorateService.getAllDirectorates()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.directorates = data;
      });
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
  }

  // Function for opening add directorate modal
  openModal(template) {
    this.directorate = new Directorate();
    this.modalRef = this.modalService.show(template);
  }
  // Function for opening the add/remove people in charge modal
  openAddRemovePeopleInChargeModal(template, event) {
    this.peopleInChargeId = [];
    this.peopleInCharge = [];
    this.users = [];
    this.directorateService.getDirectorateById(event.target.dataset.id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.directorateModal = data;
        data.peopleInCharge.forEach(element => {
          this.peopleInChargeId.push(element);
        });
        this.peopleInChargeId.forEach(id => {
          this.userService.getUserByID(id)
            .takeUntil(this.unsubscribeAll)
            .subscribe(userData => {
              this.peopleInCharge.push(userData);
            });
        });
      });
    this.userService.getActiveUsers()
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (this.peopleInChargeId.length === 0) {
          res.forEach(user => {
            if (user.isInCharge === false) {
              this.users.push(user);
            }
          });
        } else {
          res.forEach(user => {
            if ((user.isInCharge === false)) {
              this.users.push(user);
            }
          });
        }
      });
    this.modalRef = this.modalService.show(template);
  }
  // Function to fetch selected users
  getUser(event) {
    const id = event.target.dataset.id;
    this.peopleInChargeId.push(id);
    this.userService.getUserByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.peopleInCharge.unshift(data);
      });
    this.users.splice((this.users.findIndex(user => user._id === id)), 1);
  }
  removeUser(event) {
    const id = event.target.dataset.id;
    this.peopleInChargeId.splice((this.peopleInChargeId.indexOf(id)), 1);
    if (this.peopleInChargeId.length === 0) {
      this.userService.getUserByID(id)
        .takeUntil(this.unsubscribeAll)
        .subscribe(userData => {
          this.peopleInCharge = [];
          this.users.unshift(userData);
        });
    } else {
      this.userService.getUserByID(id)
        .takeUntil(this.unsubscribeAll)
        .subscribe(userData => {
          this.users.unshift(userData);
        });
      this.peopleInCharge.splice(this.peopleInCharge.findIndex(user => user._id === id), 1);
    }
  }
  // Function for opening show directorate information modal
  showDirectorate(event) {
    this.peopleInCharge = [];
    const id = event.target.dataset.id;
    this.directorateService.getDirectorateById(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.directorateModal = data;
        this.directorateModal.peopleInCharge.forEach(element => {
          this.userService.getUserByID(element)
            .takeUntil(this.unsubscribeAll)
            .subscribe(userData => {
              this.peopleInCharge.push(userData);
            });
        });
      });
  }

  // Function for opening edit directorate modal
  editModal(template, event) {
    const id = event.target.dataset.id;
    this.directorateService.getDirectorateById(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.directorateModal = data;
      });
    this.modalRef = this.modalService.show(template);
  }

  // Function for opening deactivate directorate modal
  deactivateModal(template, event) {
    const id = event.target.dataset.id;
    this.directorateService.getDirectorateById(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(directorate => {
        this.directorateModal = directorate;
      });
    this.modalRef = this.modalService.show(template);
  }

  // Function for opening activate directorate modal
  activateModal(template, event) {
    const id = event.target.dataset.id;
    this.directorateService.getDirectorateById(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(directorate => {
        this.directorateModal = directorate;
      });
    this.modalRef = this.modalService.show(template);
  }

  // Add directorate function
  addDirectorate(event, isValid) {
    if (isValid === true) {
      this.directorateService.addDirectorate(this.directorate)
        .takeUntil(this.unsubscribeAll)
        .subscribe(res => {
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
            this.directorates.unshift(res.directorate);
            Swal('Sukses!', 'Drejtoria u shtua me sukses.', 'success');
            this.modalRef.hide();
          }
        });
    }
  }
  // Add people in charge function
  addRemovePeopleInCharge(event) {
    this.directorateModal.peopleInCharge = this.peopleInChargeId;
    this.directorateService.addRemovePeopleInCharge(this.directorateModal)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Personat përgjegjës nuk janë shtuar.', 'error');
          return false;
        } else {
          this.peopleInChargeId.forEach(element => {
            this.userService.getUserByID(element)
              .takeUntil(this.unsubscribeAll)
              .subscribe(data => {
                this.userModal = data;
                this.userModal.isInCharge = true;
                this.userModal.directorateName = this.directorateModal.directorateName;
                this.userService.editUser(this.userModal._id, this.userModal)
                  .takeUntil(this.unsubscribeAll)
                  .subscribe(result => {
                    if (result.err) {
                      return false;
                    } else {
                      this.modalRef.hide();
                    }
                  });
              });
          });
          this.users.forEach(element => {
            this.userService.getUserByID(element._id)
              .takeUntil(this.unsubscribeAll)
              .subscribe(data => {
                this.userModal = data;
                this.userModal.isInCharge = false;
                this.userModal.directorateName = '';
                this.userService.editUser(this.userModal._id, this.userModal)
                  .takeUntil(this.unsubscribeAll)
                  .subscribe(result => {
                    if (result.err) {
                      return false;
                    } else {
                      this.modalRef.hide();
                    }
                  });
              });
          });
          Swal('Sukses!', 'Personat përgjegjës u shtuan me sukses.', 'success');
          this.modalRef.hide();
        }
      });
  }
  // Edit directorate function
  editDirectorate(event) {
    const id = event.target.dataset.id;
    this.directorateService.editDirectorate(id, this.directorateModal)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
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
          this.directorateService.getAllDirectorates()
            .takeUntil(this.unsubscribeAll)
            .subscribe(data => {
              this.directorates = data;
            });
          Swal('Sukses!', 'Pëdoruesi u ndryshua me sukses.', 'success');
          this.modalRef.hide();
        }
      });
  }

  // Deactivate directorate function
  deactivateDirectorate(event) {
    const id = event.target.dataset.id;
    this.directorateService.deactivateDirectorate(id, this.directorateModal)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Drejtoria nuk është deaktivizuar!', 'error');
        } else {
          this.directorateService.getAllDirectorates()
            .takeUntil(this.unsubscribeAll)
            .subscribe(data => {
              this.directorates = data;
            });
          Swal('Sukses!', 'Drejtoria u deaktivizua me sukses.', 'success');
          this.modalRef.hide();
        }
      });
  }

  // Activate directorate function
  activateDirectorate(event) {
    const id = event.target.dataset.id;
    this.directorateService.activateDirectorate(id, this.directorateModal)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Drejtoria nuk është aktivizuar!', 'error');
        } else {
          this.directorateService.getAllDirectorates()
            .takeUntil(this.unsubscribeAll)
            .subscribe(data => {
              this.directorates = data;
            });
          Swal('Sukses!', 'Drejtoria u aktivizua me sukses!', 'success');
          this.modalRef.hide();
        }
      });
  }

  authorize() {
    if (this.currentUser.role !== 'superadmin' && this.currentUser.role !== 'admin') {
      return false;
    }
    return true;
  }
}
