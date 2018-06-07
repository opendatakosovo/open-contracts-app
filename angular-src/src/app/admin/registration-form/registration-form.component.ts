import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  constructor() { }

  @Output() studentAdded =  new EventEmitter<User>();

  ngOnInit() {
  }

   user:User = { 
      firstName : "",
      lastName : "",
      email : "",
      password : "",
      type : "",
   };

   private type:string = "admin";

}
