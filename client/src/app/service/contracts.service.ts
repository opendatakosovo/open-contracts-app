import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { environment } from '../../environments/environment';


@Injectable()
export class ContractsService {
  APIUrl: string = environment.apiUrl;
  contract: any;
  constructor(public http: HttpClientService) {
    this.http = http;
  }

  addContract(formData, contentType = 'json') {
    return this.http.postWithAuth(`${this.APIUrl}/contracts`, formData, contentType).map(res => res.json());
  }

  updateContract(id, formData, contentType = 'json') {
    return this.http.putWithAuth(`${this.APIUrl}/contracts/update-contract/${id}`, formData, contentType).map(res => res.json());
  }

  getContracts() {
    return this.http.getWithAuth(`${this.APIUrl}/contracts/`).map(res => res.json().data);
  }

  getContractByID(id) {
    return this.http.getWithAuth(`${this.APIUrl}/contracts/${id}`).map(res => res.json().data);
  }

  deleteContractByID(id) {
    return this.http.deleteWithAuth(`${this.APIUrl}/contracts/${id}`).map(res => res.json().contract);
  }

  latestContracts() {
    return this.http.getWithAuth(`${this.APIUrl}/contracts/latest-contracts`).map(res => res.json().contract);
  }

  serverPagination(data) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts/page`, data).map(res => res.json());
  }

  serverPaginationLatestContracts(data) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts/latest-contracts/page`, data).map(res => res.json());
  }

  serverSortLatestContractsAscending(data) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts/latest-contracts/page/ascending`, data).map(res => res.json());
  }

  serverSortLatestContractsDescending(data) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts/latest-contracts/page/descending`, data).map(res => res.json());
  }

  filterContract(search) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts/filter`, search).map(res => res.json());
  }
  filterContractDashboard(search, role, directorateName) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts/filter${role != null ? `?role=${role}&directorate=${directorateName}` : ''}`, search).map(res => res.json());
  }
  serverSortContractsAscending(data) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts/page/ascending`, data).map(res => res.json());
  }

  serverSortContractsDescending(data) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts/page/descending`, data).map(res => res.json());
  }
}
