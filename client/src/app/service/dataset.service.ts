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

  getDatasets() {
    return this.http.getWithAuth(`${this.APIUrl}/datasets/`).map(res => res.json().datasets);
  }

  getDatasetByYear(year) {
    return this.http.getWithAuth(`${this.APIUrl}/datasets/json/` + year).map(res => res.json());
  }

  updateDataset(formData: FormData) {
    return this.http.putWithAuth(`${this.APIUrl}/datasets/update/`, formData, 'multipart').map(res => res.json());
  }

}
