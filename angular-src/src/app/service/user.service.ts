import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import {environment} from '../../environments/environment';


@Injectable()
export class UserService {
    

  constructor(public http : Http) { }


  getUsers() {
    return this.http.get(`${environment.apiUrl}/user`).map(res => res.json());
  }
  addUser(user){
    return this.http.post(`${environment.apiUrl}/user`,user).map(res => res.json());
  }
}
