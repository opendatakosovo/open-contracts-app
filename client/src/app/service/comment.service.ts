import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';
import { HttpClientService } from './http-client.service';
import { Auth } from '../utils/auth';

@Injectable()
export class CommentService {
  APIUrl: string = environment.apiUrl;
  comment: any;
  authHeaders: Headers;

  constructor(public http: HttpClientService) {
    this.http = http;
  }
  addComment(comment) {
    return this.http.postWithAuth(`${this.APIUrl}/comments`, comment).map(res => res.json());
  }
  addReply(id, reply) {
    return this.http.postWithAuth(`${this.APIUrl}/comments/` + id, reply).map(res => res.json());
  }

  getComments(contractId) {
    return this.http.getWithAuth(`${this.APIUrl}/comments/` + contractId).map(res => res.json().comments);
  }

  deleteComment(commentId) {
    return this.http.deleteWithAuth(`${this.APIUrl}/comments/` + commentId).map(res => res.json());
  }

  deleteReply(commentId, replyId) {
    return this.http.deleteWithAuth(`${this.APIUrl}/comments/delete-reply/` + replyId, commentId).map(res => res.json());
  }

}
