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
  getDirectorates() {
    return this.http.getWithAuth(`${this.APIUrl}/directorates`).map(res => res.json().directorates);
  }
  getDirectorateByID(id) {
    return this.http.getWithAuth(`${this.APIUrl}/directorates/` + id).map(res => res.json().directorate);
  }
  editDirectorate(id , editedDirectorate) {
    return this.http.putWithAuth(`${this.APIUrl}/directorates/edit-directorate/` + id, editedDirectorate).map(res => res.json());
  }
}
