import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";

@Injectable()
export class DirectorateService {

  constructor(public http: Http) { }

  getDirectorates() {
    return this.http.get('http://localhost:300/directorate').map(res => res.json().users);
  }

}
