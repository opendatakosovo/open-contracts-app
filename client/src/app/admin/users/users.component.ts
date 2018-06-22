import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Directorates } from '../../models/directorates';
import { DirectorateService } from '../../service/directorate.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  modalRef: BsModalRef;
  users: User[];
  userModal: User = {
    _id: '',
    firstName: '',
    lastName: '',
    gender: 'male',
    email: '',
    password: '',
    role: 'admin',
    department: ''
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editModal(template: TemplateRef<any>, event) {
    const id = event.target.dataset.id;
    this.userService.getUserByID(id).subscribe(user => {
      this.userModal = user;
    });
    this.modalRef = this.modalService.show(template);
  }

  showUser(event) {
    const id = event.target.dataset.id;
    this.userService.getUserByID(id).subscribe(user => {
      this.userModal = user;
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
        this.modalRef.hide();
        this.users.unshift(res.user);
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

  editUser(event) {
    const id = event.target.dataset.id;
    const firstAndLastName = document.getElementById(`${id}`).querySelector('.user-info .name a');
    const position = document.getElementById(`${id}`).querySelector('.user-info .position');
    const positionImg = document.getElementById(`${id}`).querySelector('.img-col');
    this.userService.editUser(id, this.userModal).subscribe(res => {
      if (res.err) {
        Swal('Gabim!', 'Pëdoruesi nuk u ndryshua.', 'error');
        alert('1');
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
          Swal('Gabim!', 'Pëdoruesi nuk u ndryshua.', 'error');
      } else {
           if (this.userModal.role === 'user') {
          if (this.userModal.department === null || this.userModal.department === undefined || this.userModal.department === '') {
            Swal('Gabim!', 'Pëdoruesi nuk u ndryshua.', 'error');
            alert('3');
            return false;
          } else {
            firstAndLastName.textContent = this.userModal.firstName + ' ' + this.userModal.lastName;
            position.textContent = 'Përdorues - ' + this.userModal.department;
            positionImg.innerHTML = `<img src="/assets/images/zyrtari.png" class="img-fluid">`;
            Swal('Sukses!', 'Pëdoruesi u ndryshua me sukses.', 'success');
            this.modalRef.hide();
          }
        } else if (res.err) {
          Swal('Gabim!', 'Pëdoruesi nuk u ndryshua.', 'error');
          alert('4');
          return false;
        } else {
          firstAndLastName.textContent = this.userModal.firstName + ' ' + this.userModal.lastName;
          position.textContent = 'Administrator';
          positionImg.innerHTML = `<img src="/assets/images/administratori.png" class="img-fluid">`;
          Swal('Sukses!', 'Pëdoruesi u ndryshua me sukses.', 'success');
          this.modalRef.hide();
        }
        this.userModal._id = '';
        this.userModal.firstName = '';
        this.userModal.lastName = '';
        this.userModal.gender = 'male';
        this.userModal.password = '';
        this.userModal.role = 'admin';
        this.userModal.department = '';
        this.userModal.email = '';
      }
    });
  }
}

