import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';
import { UserProfileComponent } from '../users/user-profile/user-profile.component';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import { Directorates } from '../../models/directorates';
import { DirectorateService } from '../../service/directorate.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @Input() users: User;
  @Input() directorates: Directorates;
  modalRef: BsModalRef;
  bsModalRef: BsModalRef;

  constructor(public userService: UserService, private modalService: BsModalService, public directorateService: DirectorateService) {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
    this.directorateService.getDirectorates().subscribe(data => {
      this.directorates = data;
    });
  }

  ngOnInit() { }

  openModal() {
    this.modalRef = this.modalService.show(RegistrationFormComponent);
  }


  showUser(event) {
    const state = {
      id: event.target.dataset.id
    };

    this.bsModalRef = this.modalService.show(UserProfileComponent);

  }
}

