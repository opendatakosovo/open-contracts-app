import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DatasetService } from '../../service/dataset.service';
import { Dataset } from '../../models/dataset';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-dashboard',
  templateUrl: './data-dashboard.component.html',
  styleUrls: ['./data-dashboard.component.css']
})
export class DataDashboardComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('file') file: ElementRef;
  dataSet: Dataset;
  dataSets: Dataset[];
  nameArea: HTMLInputElement;
  currentUser: User;
  constructor(public datasetService: DatasetService, private route: Router) {
    this.dataSet = new Dataset;
    this.datasetService.getDatasets()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.dataSets = data;
      });
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  fileToUpload: File;
  valid = false;
  message: string;
  touched: boolean;

  fileNameRegexValidation(year) {
    if (/^[0-9]*$/.test(year)) {
      return /^(201[8-9])|(20[2-9][0-9])|(21[0-9][0-9])$/.test(year);
    } else {
      return false;
    }

  }
  onFileChange(event) {
    if (this.fileToUpload == null) {
      this.fileToUpload = event.target.files[0];
      this.nameArea.value = this.fileToUpload.name;
      const fileName = this.fileToUpload.name.split('.');
      this.touched = true;
      if (this.fileToUpload.type !== 'text/csv') {
        this.valid = false;
        this.message = 'Tipi i setit të dhënave është i gabuar';
      } else if (!this.fileNameRegexValidation(fileName[0])) {
        this.valid = false;
        this.message = 'Seti i të dhënave është i vjetër ose emri i setit dhënave nuk është valid';
      } else {
        this.valid = true;
      }
    } else {
      this.fileToUpload = null;
      this.nameArea.value = 'Zgjedhni setin e të dhënave';
      this.valid = false;
      this.touched = false;
    }
  }
  onClick() {
    this.file.nativeElement.click();
  }

  uploadDataset(isValid) {
    if (isValid !== false) {
      this.valid = true;
      Swal({
        title: `A jeni të sigurt që deshironi ta importoni datasetin "${this.fileToUpload.name}" ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonText: 'Jo',
        confirmButtonText: 'Po'
      }).then(result => {
        if (result.value) {
          this.dataSet.datasetFilePath = this.fileToUpload.name;
          this.dataSet.folder = 'new';
          const formData = new FormData();
          formData.append('datasetFile', this.fileToUpload);
          Swal({
            title: 'Duke e importuar setin e të dhënave',
            onOpen: () => {
              Swal.showLoading();
            }
          });
          this.datasetService.addDataset(formData)
            .takeUntil(this.unsubscribeAll)
            .subscribe(res => {
              if (res.err) {
                Swal('Gabim!', `Gabim: ${res.err}`, 'error');
              } else if (res.typeValidation) {
                Swal('Kujdes!', 'Tipi i setit të dhënave nuk është valid duhet të jetë tipit CSV', 'warning');
              } else if (res.nameValidation) {
                Swal('Kujdes!', 'Seti i të dhënave është i vjetër ose emri i setit dhënave nuk është valid', 'warning');
              } else if (res.shelljsErr) {
                Swal('Gabim!', `Gabim në  importim: ${res.shelljsErr}`, 'error');
              } else if (res.stdErrBackup) {
                Swal('Gabim!', `Gabim në  importim e backup-it: ${res.stdErrBackup}`, 'error');
              } else {
                Swal('Sukses!', `Dataseti i u ${res.reImported === true ? 'ri-importua' : 'importua'} me sukses`, 'success');
                this.nameArea.value = 'Zgjedhni setin e të dhënave';
                this.fileToUpload = null;
                this.valid = false;
                this.touched = false;
                this.file.nativeElement.value = '';
              }
            });
        }
      });
    } else {
      if (this.fileToUpload == null) {
        this.message = 'Ju lutem zgjedhni setin e të dhënave!';
        this.touched = true;
      }
    }
  }


  updateDataset(valid) {
    if (valid !== false) {
      Swal({
        title: `A jeni të sigurt që deshironi ta përditësoni datasetin "${this.fileToUpload.name}" ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonText: 'Jo',
        confirmButtonText: 'Po'
      }).then(result => {
        if (result.value) {
          this.dataSet.datasetFilePath = this.fileToUpload.name;
          this.dataSet.folder = 'new';
          const formData = new FormData();
          formData.append('datasetFile', this.fileToUpload);
          Swal({
            title: 'Duke e importuar setin e të dhënave',
            onOpen: () => {
              Swal.showLoading();
            }
          });
          this.datasetService.updateDataset(formData)
            .takeUntil(this.unsubscribeAll)
            .subscribe(res => {
              if (res.err) {
                Swal('Gabim!', `Gabim: ${res.err}`, 'error');
              } else if (res.typeValidation) {
                Swal('Kujdes!', 'Tipi i setit të dhënave nuk është valid duhet të jetë tipit CSV', 'warning');
              } else if (res.nameValidation) {
                Swal('Kujdes!', 'Seti i të dhënave është i vjetër ose emri i setit dhënave nuk është valid', 'warning');
              } else if (res.fileDoesntExist) {
                Swal('Kujdes!', 'Seti i të dhënave nuk mundet të përditësohet sepse nuk eksizton', 'warning');
              } else {
                Swal('Sukses!', `Dataseti i u pëditësua me sukses`, 'success');
                this.nameArea.value = 'Zgjedhni setin e të dhënave';
                this.fileToUpload = null;
                this.valid = false;
                this.touched = false;
                this.file.nativeElement.value = '';
              }
            });
        }
      });
    } else {
      if (this.fileToUpload == null) {
        this.message = 'Ju lutem zgjedhni setin e të dhënave!';
        this.touched = true;
      }
    }
  }
  ngOnInit() {
    if (this.currentUser.role !== 'superadmin' && this.currentUser.role !== 'admin') {
      this.route.navigate(['/dashboard']);
    }
    this.nameArea = <HTMLInputElement>document.getElementById('name-area');
  }

}
