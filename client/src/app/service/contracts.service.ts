import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { environment } from '../../environments/environment';


@Injectable()
export class ContractsService {
  APIUrl: string = environment.apiUrl;
  constructor(public http: HttpClientService) {
    this.http = http;
  }

  addContract(formData: FormData) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts`, formData, 'multipart').map(res => res.json);
  }
}
