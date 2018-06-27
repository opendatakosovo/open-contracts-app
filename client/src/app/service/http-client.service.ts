import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';


@Injectable()
export class HttpClientService {

  constructor(private http: Http) { }

  private createAuthorizationHeader(headers: Headers) {
  let token = localStorage.getItem('id_token');
      headers.append('Authorization', token);
      headers.append('Content-Type', 'application/json');  
  }

  get(url) {
    return this.http.get(url);
  }

  post(url, body) {
    return this.http.post(url, body);
  }

  put(url, body) {
    return this.http.put(url, body);
  }

  delete(url) {
    return this.http.delete(url);
  }

  getWithAuth(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, { headers: headers});
  }

  postWithAuth(url, body) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, body, { headers: headers})
  }

  putWithAuth(url, body) {
    let headers = new Headers(); 
    this.createAuthorizationHeader(headers);
    return this.http.put(url, body, { headers: headers})
  }

  deleteWithAuth(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.delete(url, { headers: headers})
  }



}
