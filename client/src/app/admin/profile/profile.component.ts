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
    });
    if (this.user.role === 'user') {
      this.check = true ;
    }
  }}
