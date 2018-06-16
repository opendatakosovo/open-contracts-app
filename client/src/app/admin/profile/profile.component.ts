import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';

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
  user: User;
  check = false;

  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    console.log(this.currentUser.id);

  }

  ngOnInit() {
    this.userService.getUserByID(this.currentUser.id).subscribe(data => {
      this.user = data;
      if (this.user.role === 'user') {
        this.check = true ;
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
}
