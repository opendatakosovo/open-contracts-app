import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class DirectorateService {
  APIUrl: string = environment.apiUrl;
  directorate: any;

  constructor(public http: Http) { }

  addDirectorate(directorate) {
    return this.http.post(`${this.APIUrl}/directorates` , directorate).map(res => res.json());
  }
}
