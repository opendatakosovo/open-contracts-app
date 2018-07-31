import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { environment } from '../../environments/environment';

@Injectable()
export class DataService {
  APIUrl = environment.apiUrl;

  constructor(public http: HttpClientService) {
    this.http = http;
  }

  getContractsCountByYears() {
    return this.http.get(`${this.APIUrl}/data/contracts-count-by-years`).map(res => res.json());
  }

  getTopTenContractors() {
    return this.http.get(`${this.APIUrl}/data/top-ten-contractors`).map(res => res.json());
  }

  getContractsByName(name) {
    return this.http.get(`${this.APIUrl}/data/get-contracts-by-contractor/${name}`).map(res => res.json());
  }

}
