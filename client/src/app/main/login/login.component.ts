import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  email: string;
  password: string;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    document.body.style.background = '#fdfdfd';
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
}
