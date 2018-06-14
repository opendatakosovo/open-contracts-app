import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UsersComponent } from '../users/users.component';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';





@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  user: User = {
    _id: '',
    firstName: '',
    lastName: '',
    gender: 'male',
    email: '',
    password: '',
    role: 'admin',
    department: ''
  };

  constructor(public bsModalRef: BsModalRef, public userService: UserService) { }




  ngOnInit() {
  }

  addUser(event) {
    this.userService.addUser(this.user).subscribe(res => {
      if (res.err) {
        Swal('Gabim!', 'Pëdoruesi nuk u shtua.', 'error');
      } else if (res.exists) {
        Swal('Kujdes!', 'Pëdoruesi eksizton.', 'warning');
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
        Swal('Sukses!', 'Pëdoruesi u shtua me sukses.', 'success');
        this.user._id = '';
        this.user.firstName = '';
        this.user.lastName = '';
        this.user.gender = 'male';
        this.user.password = '';
        this.user.role = 'admin';
        this.user.department = '';
        this.user.email = '';
      }
    });
  }
}
