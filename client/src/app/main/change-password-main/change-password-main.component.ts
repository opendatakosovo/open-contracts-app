import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute, } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password-main',
  templateUrl: './change-password-main.component.html',
  styleUrls: ['./change-password-main.component.css']
})
export class ChangePasswordMainComponent implements OnInit {
  password: string;
  confirmPassword: string;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(public userService: UserService, private router: Router, private activatedRouter: ActivatedRoute) {
    const token = this.activatedRouter.snapshot.paramMap.get('token');
    this.userService.getToken(token)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.redirect) {
          this.router.navigate(['/']);
        }
      });
  }

  ngOnInit() {
  }

  changePassword(event, isValid) {
    event.preventDefault();
    const token = this.activatedRouter.snapshot.paramMap.get('token');
    this.userService.changePasswordWithToken({ password: this.password }, token)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (!res.err) {
          Swal('Sukses', 'Fjalëkalimi u ndryshua me sukses!', 'success').then(result => {
            if (result.value) {
              this.router.navigate(['/login']);
            }
          });
        } else {
          Swal('Gabim!', `Gabimi:${res.err}`, 'error');
        }
      })

  }
}
