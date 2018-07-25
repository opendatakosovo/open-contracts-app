import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('sq');
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

}
