import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';


@Injectable()
export class HttpClientService {

  constructor(private http: Http) { }

  private createAuthorizationHeader(headers: Headers, contentType) {
    const token = localStorage.getItem('id_token');
    if (contentType === 'json') {
      headers.append('Content-Type', 'application/json');
    }
    headers.append('Authorization', token);
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

  getWithAuth(url, contentType = 'json') {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, contentType);
    return this.http.get(url, { headers: headers });
  }

  postWithAuth(url, body, contentType = 'json') {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, contentType);
    return this.http.post(url, body, { headers: headers });
  }

  putWithAuth(url, body, contentType = 'json') {
    console.warn('ContentType: ', contentType);
    const headers = new Headers();
    this.createAuthorizationHeader(headers, contentType);
    return this.http.put(url, body, { headers: headers });
  }

  deleteWithAuth(url, contentType = 'json') {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, contentType);
    return this.http.delete(url, { headers: headers });
  }

}
