import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/user';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { PageScrollInstance, PageScrollService } from 'ngx-page-scroll';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  width: number = window.innerWidth;
  selectedItem = 'sq';
  isActive: boolean;
  currentUser: User;
  constructor(public translate: TranslateService, private titleService: Title, private router: Router,
    @Inject(DOCUMENT) private document: any, private pageScrollService: PageScrollService, private userService: UserService) {
    this.isActive = false;
    if (localStorage.getItem('language')) {
      translate.setDefaultLang(localStorage.getItem('language'));
      translate.use(localStorage.getItem('language'));
    } else {
      translate.setDefaultLang('sq');
      translate.use('sq');
      localStorage.setItem('language', 'sq');
    }
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get('pageTitle.title')
        .takeUntil(this.unsubscribeAll)
        .subscribe(name => {
          this.titleService.setTitle(name);
        });
    });
  }
  ngOnInit() { }

  scroll() {
    this.router.navigate(['']);
    setTimeout(() => {
      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#data-set');
      this.pageScrollService.start(pageScrollInstance);
    }, 250);
  }
  clickDataSet() {
    const dataSet = document.querySelector('.data-set-link');
    const navItem = document.querySelector('.nav-items');
    const home = document.getElementById('home-nav');
    dataSet.classList.add('data-set-link-active');
    navItem.classList.remove('active');
    home.removeAttribute('class');
    home.setAttribute('class', 'inactive');
    if (navItem.classList.contains('active') === true) {
      navItem.classList.remove('active');
      home.setAttribute('class', 'inactive');
    }
  }
  clickNav() {
    const dataSet = document.querySelector('.data-set-link');
    const home = document.getElementById('home-nav');
    dataSet.classList.remove('data-set-link-active');
  }
  clickHome() {
    const dataSet = document.querySelector('.data-set-link');
    const home = document.getElementById('home-nav');
    dataSet.classList.remove('data-set-link-active');
    home.setAttribute('class', 'active');
  }
  onResize() {
    this.width = window.innerWidth;
  }
  useLanguage(language: string) {
    this.translate.setDefaultLang(language);
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get('pageTitle.title')
        .takeUntil(this.unsubscribeAll)
        .subscribe(name => {
          this.titleService.setTitle(name);
        });
    });
  }
}
