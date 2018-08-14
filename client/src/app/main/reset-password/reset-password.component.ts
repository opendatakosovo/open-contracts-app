import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(public userService: UserService, private router: Router) {
    this.userService.resetPassword()
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (!res.err) {
          this.router.navigate(['/']);
        } else {
          Swal('Gabim', 'Nuk u dergua Email', 'error');
        }
      });
  }

  ngOnInit() {
  }

}
