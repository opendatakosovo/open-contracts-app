import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import { Directorates } from '../../models/directorates';
import { DirectorateService } from '../../service/directorate.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
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
  currentUser: User = {
    _id: '',
    firstName: '',
    lastName: '',
    gender: 'male',
    email: '',
    password: '',
    role: 'admin',
    department: ''
  };
  directorates: Directorates[];
  modalRef: BsModalRef;
  bsModalRef: BsModalRef;

  constructor(public userService: UserService, private modalService: BsModalService, public directorateService: DirectorateService) {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
    this.directorateService.getDirectorates().subscribe(data => {
      this.directorates = data;
    });
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() { }

  openModal() {
    this.modalRef = this.modalService.show(RegistrationFormComponent);
  }


  showUser(event) {
    const id = event.target.dataset.id;
    this.userService.getUserByID(id).subscribe(user => {
      this.user = user;
    });
  }


  generatePassword(event) {
    const id = event.target.dataset.id;
    Swal({
      title: 'Duke procesuar',
      onOpen: () => {
          Swal.showLoading();
      }
  });
    this.userService.generatePassword(id).subscribe(result => {
      if (!result.err) {
        Swal('Sukses!', 'Pëdoruesit ju rigjenerua fjalëkalimi dhe ju dërgua me sukses.', 'success');
      } else {
        Swal('Gabim!', `Përdoruesit nuk u rigjenerua fjalëkalimi me sukses arsyja: ${result.err}`, 'success');
      }
    });
  }
}

