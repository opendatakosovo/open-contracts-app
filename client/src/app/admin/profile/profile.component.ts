import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ChangePasswordComponent } from './change-password/change-password.component';
import Swal from 'sweetalert2';
import { Directorate } from '../../models/directorates';
import { DirectorateService } from '../../service/directorate.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  currentUser = {
    id: '',
    email: ''
  };
  user: User;
  userModal: User;
  check: Boolean = false;
  bsModalRef: BsModalRef;
  directorates: Directorate[];

  constructor(private userService: UserService, private modalService: BsModalService, public directorateService: DirectorateService) {
    this.user = new User();
    this.userModal = new User();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.userService.getUserByID(this.currentUser.id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.user = data;
      });
  }

  openModalWithComponent(event) {
    this.bsModalRef = this.modalService.show(ChangePasswordComponent);
  }

  editModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.userService.getUserByID(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(user => {
        this.userModal = user;
      });
    this.bsModalRef = this.modalService.show(template);
  }

  editProfile(event) {
    const id = event.target.dataset.id;
    this.userService.editUser(id, this.userModal)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Pëdoruesi nuk u ndryshua.', 'error');
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
            this.userService.getUserByID(this.user._id)
              .takeUntil(this.unsubscribeAll)
              .subscribe(data => {
                this.user = data;
              });
            Swal('Sukses!', 'Pëdoruesi u ndryshua me sukses.', 'success');
          }
        });
    }

}
