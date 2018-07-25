import { Component, OnInit, Inject } from '@angular/core';
import { HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { PageScrollInstance, PageScrollService, EasingLogic } from 'ngx-page-scroll';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  width: number = window.innerWidth;
  selectedItem = 'item1';
  constructor(private translate: TranslateService, private titleService: Title, private router: Router,
     @Inject(DOCUMENT) private document: any, private pageScrollService: PageScrollService) {
    translate.setDefaultLang('sq');
  }
  ngOnInit() { }

  scroll() {
    this.router.navigate(['']);
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#data-set');
    this.pageScrollService.start(pageScrollInstance);
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
