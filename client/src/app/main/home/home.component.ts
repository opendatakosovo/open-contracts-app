import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';
import { DatasetService } from '../../service/dataset.service';
import { Dataset } from '../../models/dataset';
import { ContractsService } from '../../service/contracts.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Meta } from '@angular/platform-browser';
declare var require: any;
const translateVis = require('../../utils/socialMediaTranslation.json');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  dataSet: Dataset;
  dataSets: Dataset[];
  data: string;
  format: string;
  language = 'sq';
  constructor(private translate: TranslateService, public datasetService: DatasetService,
    public contractService: ContractsService, public router: Router, public rout: ActivatedRoute, private meta: Meta) {
    translate.setDefaultLang('sq');
    this.datasetService.getDatasets()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.dataSets = data;
      });
    window.scroll(0, 0);
  }

  ngOnInit() {
    if ((this.router.url.split('?', 1)[0] === '/sq' && this.router.url.split('?', 2).length > 1)) {
      this.language = 'sq';
      this.translate.use(this.language);
    } else if ((this.router.url.split('?', 1)[0] === '/sr' && this.router.url.split('?', 2).length > 1)) {
      this.language = 'sr';
      this.translate.use(this.language);
    } else if ((this.router.url.split('?', 1)[0] === '/en' && this.router.url.split('?', 2).length > 1)) {
      this.language = 'en';
      this.translate.use(this.language);
    }
  }

  mouseOver() {
    const dataSet = document.querySelector('.data-set-link');
    const home = document.getElementById('home-nav');
    home.setAttribute('class', 'inactive');
    dataSet.setAttribute('class', 'data-set-link-active');
  }
  mouseLeave() {
    const dataSet = document.querySelector('.data-set-link-active');
    const home = document.querySelector('.inactive');
    home.setAttribute('class', 'active');
    dataSet.setAttribute('class', 'data-set-link');
  }
  downloadDataSet(isValid) {
    const elemA = (<HTMLInputElement>document.getElementById('format')).value;
    const elemB = (<HTMLInputElement>document.getElementById('data')).value;
    if (isValid === true) {
      if (elemA === 'json') {
        window.location.href = '/datasets/json/' + elemB.replace('.csv', '');
      } else if (elemA === 'csv') {
        if (elemB === '2018.csv' || elemB === '2017.csv' || elemB === '2019.csv') {
          window.location.href = '/datasets/new/' + elemB;
        } else {
          window.location.href = '/datasets/old/' + elemB;
        }
      }
    }
  }
}
