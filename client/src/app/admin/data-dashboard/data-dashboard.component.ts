import { Component, OnInit, ViewChild } from '@angular/core';
import { DatasetService } from '../../service/dataset.service';

@Component({
  selector: 'app-data-dashboard',
  templateUrl: './data-dashboard.component.html',
  styleUrls: ['./data-dashboard.component.css']
})
export class DataDashboardComponent implements OnInit {
  @ViewChild('file') file;

  constructor(public datasetService: DatasetService) { }

  fileToUpload: File;
  valid: boolean;
  message: string;
  touched: boolean;

  onFileChange(event) {
    this.fileToUpload = event.target.files[0];
    const nameArea = <HTMLInputElement>document.getElementById('name-area');
    nameArea.value = this.fileToUpload.name;
    const fileName = this.fileToUpload.name.split('.');
    this.touched = true;
    if (parseInt(fileName[0].substr(2, fileName.length), null) >= 18 && fileName[1] === 'csv') {
      this.valid = true;
    } else if (parseInt(fileName[0].substr(2, fileName.length), null) < 18) {
      this.valid = false;
      this.message = 'Dataseti eshte i vjeter';
    } else if (fileName[1] !== 'csv') {
      this.valid = false;
      this.message = 'Tipi datasetit eshte i gabuar';
    }

  }
  onClick() {
    this.file.nativeElement.click();
  }

  uploadDataset(event) {
    console.log('hello');
  }
  ngOnInit() {
  }

}
