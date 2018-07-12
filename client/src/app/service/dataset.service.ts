import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { environment } from '../../environments/environment';

@Injectable()
export class DatasetService {
  APIUrl = environment.apiUrl;
  constructor(public http: HttpClientService) {
    this.http = http;
  }

  addDataset(formData: FormData) {
    return this.http.postWithAuth(`${this.APIUrl}/datasets`, formData, 'multipart').map(res => res.json());
  }

}
