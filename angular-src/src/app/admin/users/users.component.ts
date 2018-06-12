import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  modalRef: BsModalRef;
  users: User[];

  constructor(public userService: UserService, private modalService: BsModalService) {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
    });
  }

  ngOnInit() {
  }

  openModal() {
    this.modalRef = this.modalService.show(RegistrationFormComponent);
  }

  addUser(user: User) {
    this.userService.addUser(user).subscribe(res => {
      if (res.err) {
        Swal( 'Gabim!' , 'Pëdoruesi nuk u shtua.', 'error');
      } else if (res.exists) {
        Swal('Kujdes!', 'Pëdoruesi eksizton.', 'warning');
      } else {
        Swal('Sukses!', 'Pëdoruesi u shtua me sukses.', 'success');
      }
    });
  }

}
