import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/user';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  @Input() users: User;


  constructor(public userService: UserService) {
  }


  ngOnInit() {
  }

}
