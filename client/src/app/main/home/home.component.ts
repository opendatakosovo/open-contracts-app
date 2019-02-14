import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from '@ngx-translate/core';
import { DatasetService } from '../../service/dataset.service';
import { Dataset } from '../../models/dataset';
import { ContractsService } from '../../service/contracts.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { DirectorateService } from '../../service/directorate.service';
import { Directorate } from '../../models/directorates';
import { DataService } from '../../service/data.service';
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
  field: string;
  language = 'sq';
  value: string;
  directorates: Directorate[];
  topTenContractors;
  constructor(private translate: TranslateService, public datasetService: DatasetService,
    public contractService: ContractsService, public router: Router, public rout: ActivatedRoute, private meta: Meta, public directorateService: DirectorateService, public dataService: DataService) {
    translate.setDefaultLang('sq');
    this.datasetService.getDatasets()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.dataSets = data;
      });
    this.directorateService.getAllPublicDirectorates()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.directorates = data;
      });
    this.dataService.getTopTenContractors()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.topTenContractors = data;
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
    const format = (<HTMLInputElement>document.getElementById('format')).value;
    const value = (<HTMLInputElement>document.getElementById('data')).value;
    const field = (<HTMLInputElement>document.getElementById('field')).value;
    if (isValid === true) {
      if (format === 'json') {
        window.location.href = '/datasets/json/' + field + '/' + value.replace('.csv', '');
      } else if (format === 'csv') {
        window.location.href = '/datasets/csv/' + field + '/' + value;
      }
    }
  }
  onChange(event) {
    const elemB = (<HTMLInputElement>document.getElementById('field')).value;
    this.value = elemB;
    const elements = (<HTMLInputElement>document.getElementById('data'));
    elements.value = 'undefined';
  }
}
