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

}
