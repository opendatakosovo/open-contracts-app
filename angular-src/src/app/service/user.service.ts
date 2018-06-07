import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";

@Injectable()
export class UserService {

  constructor(public http : Http) { }


  getUsers() {
    return this.http.get('http://localhost:3000/user').map(res => res.json().users);
  }
}
