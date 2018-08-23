import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/user';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, RouterLink, NavigationExtras } from '@angular/router';
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
  language = 'sq';
  isActive: boolean;
  currentUser: User;
  selected = 'sq';
  currentRoute: string;
  constructor(public translate: TranslateService, private titleService: Title, private router: Router,
    @Inject(DOCUMENT) private document: any, private pageScrollService: PageScrollService, private userService: UserService, private route: ActivatedRoute) {
    this.isActive = false;
    this.currentRoute = this.router.url;
    if (this.translate.currentLang === 'sq' || this.currentRoute === '/sq' || this.router.url === '/sq/visualisations' || this.router.url.split('?', 1)[0] === '/sq') {
      this.language = 'sq';
      this.translate.use(this.language);
    } else if (this.translate.currentLang === 'sr' || this.currentRoute === '/sr' || this.router.url === '/sr/visualisations' || this.router.url.split('?', 1)[0] === '/sr') {
      this.language = 'sr';
      this.translate.use(this.language);
    } else if (this.translate.currentLang === 'en' || this.currentRoute === '/en' || this.router.url === '/en/visualisations' || this.router.url.split('?', 1)[0] === '/en') {
      this.language = 'en';
      this.translate.use(this.language);
    }
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get('pageTitle')
        .takeUntil(this.unsubscribeAll)
        .subscribe(name => {
          this.titleService.setTitle(name);
        });
    });
  }
  ngOnInit() {
    this.activeClasses();
    window.scroll(0, 0);
  }
  activeClasses() {
    setTimeout(() => {
      const navItem = document.querySelector('.visualisations');
      const home = document.getElementById('home-nav');
      const about = document.querySelector('.about-us');
      if (this.router.url === '/sq/visualisations' || this.router.url === '/sr/visualisations' || this.router.url === '/en/visualisations') {
        navItem.classList.add('active');
        home.classList.remove('active');
        about.classList.remove('active');
      } else if (this.router.url === '/sq' || this.router.url === '/sr' || this.router.url === '/en') {
        navItem.classList.remove('active');
        home.classList.add('active');
        about.classList.remove('active');
      } else if (this.router.url === '/sq/about-us' || this.router.url === '/sr/about-us' || this.router.url === '/en/about-us') {
        home.classList.remove('active');
        navItem.classList.remove('active');
        about.classList.add('active');
      } else {
        navItem.classList.remove('active');
        home.classList.add('active');
        about.classList.remove('active');
      }
    }, 1);
  }
  scrollHome() {
    this.router.navigate(['']);
    window.scroll(0, 0);
  }
  scroll() {
    this.router.navigate(['', this.language]);
    setTimeout(() => {
      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#data-set');
      this.pageScrollService.start(pageScrollInstance);
    }, 250);
  }
  clickDataSet() {
    const dataSet = document.querySelector('.data-set-link');
    const navItem = document.querySelector('.visualisations');
    const home = document.getElementById('home-nav');
    const about = document.querySelector('.about-us');
    dataSet.classList.add('data-set-link-active');
    navItem.classList.remove('active');
    about.classList.remove('active');
    home.classList.remove('active');
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
  clickVisualisations() {
    const navItem = document.querySelector('.visualisations');
    const home = document.getElementById('home-nav');
    const about = document.querySelector('.about-us');
    navItem.classList.add('active');
    home.classList.remove('active');
    about.classList.remove('active');
    if (this.language === 'sq') {
      this.router.navigate(['/sq/visualisations']);
    } else if (this.language === 'en') {
      this.router.navigate(['/en/visualisations']);
    } else {
      this.router.navigate(['/sr/visualisations']);
    }
  }
  clickAboutUs() {
    if (this.language === 'sq') {
      this.router.navigate(['/sq/about-us']);
    } else if (this.language === 'en') {
      this.router.navigate(['/en/about-us']);
    } else {
      this.router.navigate(['/sr/about-us']);
    }
    this.activeClasses();
  }
  clickHome() {
    const dataSet = document.querySelector('.data-set-link');
    const home = document.getElementById('home-nav');
    dataSet.classList.remove('data-set-link-active');
    home.setAttribute('class', 'active');
    this.activeClasses();
  }
  onResize() {
    this.width = window.innerWidth;
  }
  useLanguage(language: string) {
    let next;
    let navigationExtras: NavigationExtras;
    if (this.router.url === '/sq' || this.router.url === '/en' || this.router.url === '/sr') {
      next = '/' + language;
    } else if (this.router.url === '/sq/visualisations' && language !== 'sq') {
      next = '/' + language + '/visualisations';
    } else if (this.router.url === '/en/visualisations' && language !== 'en') {
      next = '/' + language + '/visualisations';
    } else if (this.router.url === '/sr/visualisations' && language !== 'sr') {
      next = '/' + language + '/visualisations';
    } else if ((this.router.url.split('?', 2)[0] === '/sq' && this.router.url.split('?', 2).length > 1)) {
      navigationExtras = {
        queryParams: {
          'string': this.route.snapshot.queryParamMap.get('string'), 'directorate': this.route.snapshot.queryParamMap.get('directorate'),
          'date': this.route.snapshot.queryParamMap.get('date'), 'value': this.route.snapshot.queryParamMap.get('value')
        }
      };
      this.language = 'sq';
      this.translate.use(this.language);
      next = '/' + language;
    } else if ((this.router.url.split('?', 1)[0] === '/sr' && this.router.url.split('?', 2).length > 1)) {
      navigationExtras = {
        queryParams: {
          'string': this.route.snapshot.queryParamMap.get('string'), 'directorate': this.route.snapshot.queryParamMap.get('directorate'),
          'date': this.route.snapshot.queryParamMap.get('date'), 'value': this.route.snapshot.queryParamMap.get('value')
        }
      };
      this.language = 'sr';
      this.translate.use(this.language);
      next = '/' + language;
    } else if ((this.router.url.split('?', 1)[0] === '/en' && this.router.url.split('?', 2).length > 1)) {
      navigationExtras = {
        queryParams: {
          'string': this.route.snapshot.queryParamMap.get('string'), 'directorate': this.route.snapshot.queryParamMap.get('directorate'),
          'date': this.route.snapshot.queryParamMap.get('date'), 'value': this.route.snapshot.queryParamMap.get('value')
        }
      };
      this.language = 'en';
      this.translate.use(this.language);
      next = '/' + language;
    }
    this.translate.setDefaultLang(language);
    this.translate.use(language);
    console.log(navigationExtras);
    this.language = language;
    localStorage.setItem('language', this.language);
    this.router.navigate([next], navigationExtras);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get('pageTitle')
        .takeUntil(this.unsubscribeAll)
        .subscribe(name => {
          this.titleService.setTitle(name);
        });
    });
  }
}
