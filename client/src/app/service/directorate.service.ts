import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';
import { Auth } from '../utils/auth';

@Injectable()
export class DirectorateService {
  APIUrl: string = environment.apiUrl;
  directorate: any;
  authHeaders: Headers;

  constructor(public http: Http) {
    this.authHeaders = Auth.loadToken();
  }

  addDirectorate(directorate) {
    return this.http.post(`${this.APIUrl}/directorates`, directorate, { headers: this.authHeaders }).map(res => res.json());
  }
  getDirectorates() {
    return this.http.get(`${this.APIUrl}/directorates`, { headers: this.authHeaders }).map(res => res.json().directorates);
  }

}
