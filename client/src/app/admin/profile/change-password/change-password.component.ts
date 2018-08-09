import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserService } from '../../../service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  user = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  };

  constructor(public bsModalRef: BsModalRef, public userService: UserService) { }

  ngOnInit() {
  }

  changePassword(event) {
    this.userService.changePassword(this.user)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Fjalëkalimi nuk u ndryshua', 'error');
        } else if (res.pwd_err) {
          Swal('Kujdes!', 'Fjalëkalimi është i gabuar', 'warning');
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
        } else if (res.errCmp) {
          Swal({
            title: 'Kujdes!',
            text: res.errCmp,
            confirmButtonText: 'Kthehu te forma',
            type: 'warning'
          });
        } else {
          Swal('Sukses!', 'Fjalëkalimi u ndryshua me sukses.', 'success');
          this.bsModalRef.hide();
          this.user.currentPassword = '';
          this.user.newPassword = '';
          this.user.newPasswordConfirm = '';
        }
      });
  }
}
