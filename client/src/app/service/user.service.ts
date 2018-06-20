import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserService {
  APIUrl: string = environment.apiUrl;
  token: any;
  user: any;

  constructor(public http: Http) { }

  getUsers() {
    return this.http.get(`${this.APIUrl}/user`).map(res => res.json().users);
  }

  addUser(user) {
    return this.http.post(`${this.APIUrl}/user`, user).map(res => res.json());
  }

  authUser(user) {
    return this.http.post(`${this.APIUrl}/login`, user).map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.token = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.clear();
  }

  getUserByID (id) {
    return this.http.get(`${this.APIUrl}/user/` + id).map(res => res.json().user);
  }

  generatePassword (id) {
    return this.http.put(`${this.APIUrl}/user/generate-password/` + id, {}).map(res => res.json());
  }

  editUser(id, editedUser) {
    return this.http.put(`${this.APIUrl}/user/edit-user/` + id, editedUser).map(res => res.json());
  }

}
