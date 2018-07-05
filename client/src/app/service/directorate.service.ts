import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';
import { HttpClientService } from './http-client.service';
import { Auth } from '../utils/auth';

@Injectable()
export class DirectorateService {
  APIUrl: string = environment.apiUrl;
  directorate: any;
  authHeaders: Headers;

  constructor(public http: HttpClientService) {
    this.http = http;
  }

  addDirectorate(directorate) {
    return this.http.postWithAuth(`${this.APIUrl}/directorates`, directorate).map(res => res.json());
  }

  getDirectorateById(id) {
    return this.http.getWithAuth(`${this.APIUrl}/directorates/` + id).map(res => res.json().directorate);
  }

  directoratesAndTheirPeopleInCharge() {
    return this.http.getWithAuth(`${this.APIUrl}/directorates`).map(res => res.json());
  }

  getDirectorateByPersonInChargeEmail(email) {
    return this.http.getWithAuth(`${this.APIUrl}/directorates/user/` + email).map(res => res.json());
  }

  editDirectorate(id , editedDirectorate) {
    return this.http.putWithAuth(`${this.APIUrl}/directorates/edit-directorate/` + id, editedDirectorate).map(res => res.json());
  }

  activateDirectorate(id , activatedDirectorate) {
    return this.http.putWithAuth(`${this.APIUrl}/directorates/activate-directorate/` + id, activatedDirectorate).map(res => res.json());
  }

  deactivateDirectorate(id , deactivatedDirectorate) {
    return this.http.putWithAuth(`${this.APIUrl}/directorates/deactivate-directorate/` + id,
     deactivatedDirectorate).map(res => res.json());
  }

}
