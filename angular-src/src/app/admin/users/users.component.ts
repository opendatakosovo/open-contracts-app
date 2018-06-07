import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user = {
    firstName: '',
    lastName:'',
    password:'',
    email:''
  }
   users:User[];
   private type:string = "admin";

  constructor(public userService : UserService) { 
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
    })
  }

  ngOnInit() {
  
  }

}
