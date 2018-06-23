import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ChangePasswordComponent } from './change-password/change-password.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser = {
    id: '',
    email: ''
  };
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
  check: Boolean = false;
  bsModalRef: BsModalRef;


  constructor(private userService: UserService, private modalService: BsModalService) {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.userService.getUserByID(this.currentUser.id).subscribe(data => {
      this.user = data;
      if (this.user.role === 'user') {
        this.check = true;
        this.user.role = 'Përdorues';
      } else if (this.user.role === 'admin') {
        this.user.role = 'Admin';
      } else {
        this.user.role = 'Super Admin';
      }
      if (this.user.gender === 'male') {
        this.user.gender = 'Mashkull';
      } else if (this.user.gender === 'female') {
        this.user.gender = 'Femër';
      } else {
        this.user.gender = 'Tjetër';
      }
    });
  }

  openModalWithComponent(event) {
    this.bsModalRef = this.modalService.show(ChangePasswordComponent);
  }
}
