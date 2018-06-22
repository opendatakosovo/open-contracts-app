import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';
import { Auth } from '../utils/auth';

@Injectable()
export class UserService {
  APIUrl: string = environment.apiUrl;
  token: any;
  user: any;
  authHeaders: Headers;

  constructor(public http: Http) {
    this.authHeaders = Auth.loadToken();
  }

  getUsers() {
    return this.http.get(`${this.APIUrl}/user`, { headers: this.authHeaders }).map(res => res.json().users);
  }

  addUser(user) {
    return this.http.post(`${this.APIUrl}/user`, user, { headers: this.authHeaders }).map(res => res.json());
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

  getUserByID(id) {
    return this.http.get(`${this.APIUrl}/user/` + id, { headers: this.authHeaders }).map(res => res.json().user);
  }

  generatePassword(id) {
    return this.http.put(`${this.APIUrl}/user/generate-password/` + id, {}, { headers: this.authHeaders }).map(res => res.json());
  } ß

  changePassword(user) {
    return this.http.put(`${this.APIUrl}/user/change-password/`, user, { headers: this.authHeaders }).map(res => res.json());
  }

  editUser(id, editedUser) {
    return this.http.put(`${this.APIUrl}/user/edit-user/` + id, editedUser, {headers: this.authHeaders}).map(res => res.json());
  }

}
