import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatasetService } from '../../service/dataset.service';
import { Dataset } from '../../models/dataset';
import { ContractsService } from '../../service/contracts.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSet: Dataset;
  dataSets: Dataset[];
  data: string;
  format: string;
  constructor(private translate: TranslateService, public datasetService: DatasetService,
              public contractService: ContractsService ) {
    translate.setDefaultLang('sq');
    this.datasetService.getDatasets().subscribe(data => {
      this.dataSets = data;
    });
  }

  ngOnInit() {
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
  mouseOver() {
    const dataSet = document.querySelector('.data-set-link');
    const home = document.querySelector('.active');
    home.setAttribute('class', 'inactive');
    dataSet.setAttribute('class', 'data-set-link-active');
  }
  mouseLeave() {
    const dataSet = document.querySelector('.data-set-link-active');
    const home = document.querySelector('.inactive');
    home.setAttribute('class', 'active');
    dataSet.setAttribute('class', 'data-set-link');
  }
  geoPreview(isValid) {
    const elemA = (<HTMLInputElement>document.getElementById('format')).value;
    const elemB = (<HTMLInputElement>document.getElementById('data')).value;
    if (isValid === true) {
      if (elemA === 'json') {
        window.location.href = '/datasets/json/' + elemB.replace('.csv', '');
      } else if (elemA === 'csv') {
        if (elemB === '2018.csv' || elemB === '2017.csv') {
          window.location.href = '/datasets/new/' + elemB;
        } else {
          window.location.href = '/datasets/old/' + elemB;
        }
      }
    }
  }
}
