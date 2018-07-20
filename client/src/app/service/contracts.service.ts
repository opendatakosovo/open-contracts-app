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

  addContract(formData: FormData) {
    return this.http.postWithAuth(`${this.APIUrl}/contracts`, formData, 'multipart').map(res => res.json());
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

  editContract(id, editedContract) {
    return this.http.putWithAuth(`${this.APIUrl}/contracts/edit-contract/` + id, editedContract).map(res => res.json());
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
}
