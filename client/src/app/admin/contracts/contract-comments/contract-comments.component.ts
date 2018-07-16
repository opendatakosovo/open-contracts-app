import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-contract-comments',
  templateUrl: './contract-comments.component.html',
  styleUrls: ['./contract-comments.component.css']
})
export class ContractCommentsComponent implements OnInit {
  users: User[];
  currentUser = {
    id: '',
    email: ''
  };
  user: User;
  constructor(public userService: UserService) {
    this.users = [];
    this.user = new User;
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.userService.getUsers().subscribe(data => {
      data.forEach(element => {
        if (element.role !== 'superadmin') {
          this.users.push(element);
        }
      });
      });
   }

  ngOnInit() {
    this.userService.getUserByID(this.currentUser.id).subscribe(data => {
      this.user = data;
    });
  }

}
