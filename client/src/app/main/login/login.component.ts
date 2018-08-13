import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  email: string;
  password: string;
  forgotEmail: string;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private userService: UserService,
    private modalService: BsModalService
  ) {
    document.body.style.background = '#fdfdfd';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  ngOnInit() {
    if (this.userService.loggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onLoginSubmit(e, isValid) {
    e.preventDefault();
    const user = {
      email: this.email,
      password: this.password
    };
    if (isValid === true) {
      this.userService.authUser(user)
        .takeUntil(this.unsubscribeAll)
        .subscribe(data => {
          if (data.success) {
            this.userService.storeUserData(data.token, data.user);
          } else {
            Swal('Gabim!', data.msg, 'info');
            this.router.navigate(['/login']);
          }
        });
    }
  }

  requestRegerationForPassword(e, isValid) {
    e.preventDefault();
    Swal({
      title: 'Duke dërguar email',
      onOpen: () => {
        Swal.showLoading();
      }
    });
    if (isValid) {
      this.userService.forgotPassword(this.forgotEmail)
        .takeUntil(this.unsubscribeAll)
        .subscribe(res => {
          if (res.err) {
            Swal('Gabim!', `Dërgimi i email dështoji.`, 'error');
          } else if (res.userExist) {
            Swal('Kujdes!', `Përdoruesi nuk ekziston.`, 'warning');
          } else {
            Swal('Sukses!', 'Email për kërkes të rigjenerimit të fjalëkalimit u dërgua.', 'success');
            this.modalRef.hide();
          }
        });
    }
  }
}
