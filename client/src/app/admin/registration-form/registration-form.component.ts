import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from '../../models/user';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UsersComponent } from '../users/users.component';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';
import { Directorates } from '../../models/directorates';
import { DirectorateService } from '../../service/directorate.service';





@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  directorates: Directorates;
  public getUser: EventEmitter<User> = new EventEmitter();
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

  constructor(public bsModalRef: BsModalRef, public directorateService: DirectorateService) {
    this.directorateService.getDirectorates().subscribe(data => {
      this.directorates = data;
    });
  }




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
