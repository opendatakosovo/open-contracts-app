import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Directorate } from '../../models/directorates';
import { DirectorateService } from '../../service/directorate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  users: User[];
  userModal: User;
  user: User;
  directorateModal: Directorate;
  currentUser: User;
  numberOfDirectorates: number;
  constructor(public userService: UserService, private modalService: BsModalService, public directorateService: DirectorateService, private route: Router) {
    this.userModal = new User();
    this.user = new User();
    this.currentUser = new User();
    this.directorateModal = new Directorate();
    this.userService.getUsers()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.users = data;
      });
    this.directorateService.countDirectorates()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.numberOfDirectorates = data;
      });
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    if (this.currentUser.role !== 'superadmin' && this.currentUser.role !== 'admin') {
      this.route.navigate(['/dashboard']);
    }
  }

  // Function to open add user modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // Function to open edit modal
  editModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.userService.getUserByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(user => {
        this.userModal = user;
      });
    this.modalRef = this.modalService.show(template);
  }

  // Function to open deactivate modal
  deactivateModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.userService.getUserByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(user => {
        this.userModal = user;
      });
    this.modalRef = this.modalService.show(template);
  }

  // Function to open activate modal
  activateModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.userService.getUserByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(user => {
        this.userModal = user;
      });
    this.modalRef = this.modalService.show(template);
  }

  // Function to show a specific user or admin
  showUser(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.userService.getUserByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(user => {
        this.userModal = user;
      });
    this.modalRef = this.modalService.show(template);
  }

  // Function to generate password for a user or admin
  generatePassword(event) {
    const id = event.target.dataset.id;
    Swal({
      title: 'Duke procesuar',
      onOpen: () => {
        Swal.showLoading();
      }
    });
    this.userService.generatePassword(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(result => {
        if (!result.err) {
          Swal('Sukses!', 'Përdoruesi ju rigjenerua fjalëkalimi dhe ju dërgua me sukses.', 'success');
        } else {
          Swal('Gabim!', `Përdoruesi nuk u rigjenerua fjalëkalimi me sukses arsyja: ${result.err}`, 'success');
        }
      });
  }

  // Function to add a user or admin
  addUser(event) {
    this.userService.addUser(this.user)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Përdoruesi nuk u shtua.', 'error');
        } else if (res.exists) {
          Swal('Kujdes!', 'Përdoruesi eksizton.', 'warning');
        } else if (res.errVld) {
          let errList = '';
          res.errVld.map(error => {
            errList += `<p>${error.msg}</p>`;
          });
          const htmlData = `<div style="text-align: center;">${errList}</div>`;
          Swal({
            title: 'Kujdes!',
            html: htmlData,
            width: 750,
            type: 'info',
            confirmButtonText: 'Kthehu tek forma'
          });
        } else if (res.usr_err) {
          Swal({
            title: 'Përdoruesi ekziston por është joaktiv',
            type: 'warning',
            confirmButtonText: 'Kthehu tek forma',
          });
        } else {
          this.modalRef.hide();
          this.userService.getUsers()
            .takeUntil(this.unsubscribeAll)
            .subscribe(data => {
              this.users = data;
            });
          if (this.user.role === 'admin') {
            Swal('Sukses!', 'Admini u shtua me sukses.', 'success');
          } else {
            Swal('Sukses!', 'Përdoruesi u shtua me sukses.Tani mund të përcaktoni detyrën e tij!', 'success');
          }
          this.user = new User();
        }
      });
  }

  // Function to edit a specific user or admin
  editUser(event) {
    const id = event.target.dataset.id;
    this.userService.editUser(id, this.userModal)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Përdoruesi nuk u ndryshua.', 'error');
          return false;
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
        } else if (this.userModal.firstName === '' || this.userModal.lastName === '') {
          Swal('Gabim!', 'Përdoruesi nuk u ndryshua.', 'error');
        } else if (res.err) {
          Swal('Gabim!', 'Përdoruesi nuk u ndryshua.', 'error');
          return false;
        } else {
          this.userService.getUsers()
            .takeUntil(this.unsubscribeAll)
            .subscribe(data => {
              this.users = data;
            });
          Swal('Sukses!', 'Përdoruesi u ndryshua me sukses.', 'success');
          this.modalRef.hide();
        }
      });
  }

  // Function to deactivate a specific user or admin
  deactivateUser(event) {
    const id = event.target.dataset.id;
    if ((this.userModal.role === 'user') && (this.userModal.isInCharge = true)) {
      this.directorateService.getDirectorateByName(this.userModal.directorateName)
        .takeUntil(this.unsubscribeAll)
        .subscribe(data => {
          this.directorateModal = data;
          this.directorateModal.peopleInCharge.forEach(element => {
            if (element === this.userModal._id) {
              this.directorateModal.peopleInCharge.splice((this.directorateModal.peopleInCharge.indexOf(element)), 1);
            }
          });
          this.directorateService.addRemovePeopleInCharge(this.directorateModal)
            .takeUntil(this.unsubscribeAll)
            .subscribe(result => {
              if (result.err) {
                return false;
              } else {
                this.modalRef.hide();
              }
            });
        });
      this.userModal.directorateName = '';
      this.userModal.isInCharge = false;
      this.userModal.isActive = false;
    } else {
      this.userModal.isActive = false;
    }
    this.userService.editUser(id, this.userModal)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Përdoruesi nuk u deaktivizua.', 'error');
        } else {
          this.modalRef.hide();
          this.userService.getUsers()
            .takeUntil(this.unsubscribeAll)
            .subscribe(data => {
              this.users = data;
            });
          Swal('Sukses!', 'Përdoruesi u deaktivizua me sukses.', 'success');
        }
      });
  }

  // Function to activate a specific user or admin
  activateUser(event) {
    const id = event.target.dataset.id;
    this.userService.activateUser(id, this.userModal)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Përdoruesi nuk u aktivizua.', 'error');
        } else {
          this.modalRef.hide();
          this.userService.getUsers()
            .takeUntil(this.unsubscribeAll)
            .subscribe(data => {
              this.users = data;
            });
          Swal('Sukses!', 'Përdoruesi u aktivizua me sukses.', 'success');
        }
      });
  }
}
