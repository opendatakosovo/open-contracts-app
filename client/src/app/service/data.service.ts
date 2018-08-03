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

  getContractSigningDateAndPublicationDateForChart(year) {
    return this.http.get(`${this.APIUrl}/data/contracts-by-years-publication-date-signing-date/${year}`).map(res => res.json());
  }

  getContractByYearWithPredictedValueAndTotalAmount(year) {
    return this.http.get(`${this.APIUrl}/data/contracts-with-predicted-value-and-total-amount/${year}`).map(res => res.json());
  }

  getContractYears() {
    return this.http.get(`${this.APIUrl}/data/years`).map(res => res.json());
  }

  // Dashboard Data
  getUserData() {
    return this.http.getWithAuth(`${this.APIUrl}/data/user`).map(res => res.json());
  }

  getDirectorateData() {
    return this.http.getWithAuth(`${this.APIUrl}/data/directorates`).map(res => res.json());
  }

  getContractsData() {
    return this.http.getWithAuth(`${this.APIUrl}/data/contracts`).map(res => res.json());
  }

}
