import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';
import { HttpClientService } from './http-client.service';
import { Router } from '@angular/router';


@Injectable()
export class UserService {
  APIUrl: string = environment.apiUrl;
  token: any;
  user: any;
  authHeaders: Headers;
  redirectUrl: string;

  constructor(public http: HttpClientService, private router: Router) {
    this.http = http;
    this.authHeaders = this.loadToken();
  }

  loadToken() {
    this.token = localStorage.getItem('id_token');
    this.authHeaders = new Headers();
    this.authHeaders.append('Authorization', this.token);
    this.authHeaders.append('Content-Type', 'application/json');
    return this.authHeaders;
  }

  getUsers() {
    return this.http.getWithAuth(`${this.APIUrl}/user`).map(res => res.json().users);
  }


  addUser(user) {
    return this.http.postWithAuth(`${this.APIUrl}/user`, user).map(res => res.json());
  }

  authUser(user) {
    return this.http.post(`${this.APIUrl}/login`, user).map(res => {
      if (this.redirectUrl) {
        this.router.navigate([this.redirectUrl]);
      } else {
        this.router.navigate(['/dashboard']);
      }
      return res.json();
    });
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }


  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  }

  getUserByID(id) {
    return this.http.getWithAuth(`${this.APIUrl}/user/` + id).map(res => res.json().user);
  }

  getAllSimpleActiveUsers() {
    return this.http.getWithAuth(`${this.APIUrl}/user/simple-users`).map(res => res.json());
  }

  generatePassword(id) {
    return this.http.putWithAuth(`${this.APIUrl}/user/generate-password/` + id, {}).map(res => res.json());
  }

  changePassword(user) {
    return this.http.putWithAuth(`${this.APIUrl}/user/change-password/`, user).map(res => res.json());
  }

  editUser(id, editedUser) {
    return this.http.putWithAuth(`${this.APIUrl}/user/edit-user/` + id, editedUser).map(res => res.json());
  }

  activateUser(id, activatedUser) {
    return this.http.putWithAuth(`${this.APIUrl}/user/activate-user/` + id, activatedUser).map(res => res.json());
  }
  getActiveUsers() {
    return this.http.getWithAuth(`${this.APIUrl}/user/active-users`).map(res => res.json().users);
  }

  forgotPassword(email) {
    return this.http.post(`${this.APIUrl}/user/send-email-for-regeneration`, { 'email': email }).map(res => res.json());
  }

  resetPassword() {
    return this.http.post(`${this.APIUrl}/user/reset-password`, {}).map(res => res.json());
  }

  getToken(token) {
    return this.http.get(`${this.APIUrl}/user/change-password-admin/${token}`).map(res => res.json());
  }

  changePasswordWithToken(user, token) {
    return this.http.post(`${this.APIUrl}/user/change-password-admin/${token}`, user).map(res => res.json());
  }
}
