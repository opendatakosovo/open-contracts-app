import { Component, OnInit, Inject } from '@angular/core';
import { HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/user';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { PageScrollInstance, PageScrollService, EasingLogic } from 'ngx-page-scroll';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  width: number = window.innerWidth;
  selectedItem = 'sq';
  isActive: boolean;
  currentUser: User;
  constructor(private translate: TranslateService, private titleService: Title, private router: Router,
    @Inject(DOCUMENT) private document: any, private pageScrollService: PageScrollService, private userService: UserService) {
    this.isActive = false;
    translate.setDefaultLang('sq');
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }
  ngOnInit() { }

  scroll() {
    this.router.navigate(['']);
    setTimeout(() => {
      const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#data-set');
      this.pageScrollService.start(pageScrollInstance);
    }, 150);
  }
  onResize() {
    this.width = window.innerWidth;
  }
  useLanguage(language: string) {
    this.translate.use(language);
    this.translate.get('pageTitle.title').subscribe(name => {
      this.titleService.setTitle(name);
    });
  }
}
