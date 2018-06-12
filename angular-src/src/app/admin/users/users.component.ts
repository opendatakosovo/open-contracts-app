import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';
import { UserProfileComponent } from '../users/user-profile/user-profile.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @Input() users: User;
  modalRef: BsModalRef;
  bsModalRef: BsModalRef;

  constructor(public userService: UserService, private modalService: BsModalService) {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
    });
  }

  ngOnInit() { }

  // openModal() {
  //   this.modalRef = this.modalService.show(RegistrationFormComponent);
  // }



  addUser(user: User) {
    this.userService.addUser(user).subscribe(res => {
      if (res.err) {
        Swal('Gabim!', 'Pëdoruesi nuk u shtua.', 'error');
      } else if (res.exists) {
        Swal('Kujdes!', 'Pëdoruesi eksizton.', 'warning');
      } else {
        Swal('Sukses!', 'Pëdoruesi u shtua me sukses.', 'success');
      }
    });
  }

  showUser(event) {
    const state = {
      id: event.target.dataset.id
    };

    this.bsModalRef = this.modalService.show(UserProfileComponent);

  }
}

